"use client";

import { useState } from "react";

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  director: string | null;
  genre_id: number | null;
  genre_name: string | null;
  release_year: number | null;
  duration_min: number | null;
  language: string | null;
  synopsis: string | null;
  review_count: number;
  avg_rating: number | null;
}

interface Review {
  id: number;
  reviewer_name: string;
  rating: number;
  review_text: string | null;
  review_date: string;
}

const emptyForm = {
  title: "",
  director: "",
  genre_id: "",
  release_year: "",
  duration_min: "",
  language: "English",
  synopsis: "",
};

export default function MoviesClient({
  initialMovies,
  initialGenres,
}: {
  initialMovies: Movie[];
  initialGenres: Genre[];
}) {
  const [movies, setMovies]         = useState<Movie[]>(initialMovies);
  const [genres]                    = useState<Genre[]>(initialGenres);
  const [form, setForm]             = useState(emptyForm);
  const [formDirty, setFormDirty]   = useState(false);
  const [editingId, setEditingId]   = useState<number | null>(null);
  const [showForm, setShowForm]     = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [reviews, setReviews]       = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ reviewer_name: "", rating: "7", review_text: "", review_date: new Date().toISOString().slice(0, 10) });
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  function reviewFormDirty() {
    return reviewForm.reviewer_name !== "" || reviewForm.review_text !== "";
  }

  function updateForm(field: keyof typeof emptyForm, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    setFormDirty(true);
  }

  async function fetchMovies() {
    const res = await fetch("/api/movies");
    const data = await res.json();
    setMovies(data);
  }

  async function fetchReviews(movieId: number) {
    const res = await fetch(`/api/movies/${movieId}`);
    const data = await res.json();
    setReviews(data.reviews || []);
  }

  function openAdd() {
    if (selectedMovie && reviewFormDirty()) {
      alert("You have unsaved review changes. Please submit or clear them first.");
      return;
    }
    setSelectedMovie(null);
    setForm(emptyForm);
    setFormDirty(false);
    setEditingId(null);
    setShowForm(true);
    setError("");
  }

  function openEdit(m: Movie) {
    if (selectedMovie && reviewFormDirty()) {
      alert("You have unsaved review changes. Please submit or clear them first.");
      return;
    }
    setSelectedMovie(null);
    setForm({
      title:        m.title,
      director:     m.director || "",
      genre_id:     m.genre_id?.toString() || "",
      release_year: m.release_year?.toString() || "",
      duration_min: m.duration_min?.toString() || "",
      language:     m.language || "English",
      synopsis:     m.synopsis || "",
    });
    setFormDirty(false);
    setEditingId(m.id);
    setShowForm(true);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload = {
      title:        form.title,
      director:     form.director || null,
      genre_id:     form.genre_id ? parseInt(form.genre_id) : null,
      release_year: form.release_year ? parseInt(form.release_year) : null,
      duration_min: form.duration_min ? parseInt(form.duration_min) : null,
      language:     form.language || "English",
      synopsis:     form.synopsis || null,
    };
    const url    = editingId ? `/api/movies/${editingId}` : "/api/movies";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "An error occurred");
      return;
    }
    setShowForm(false);
    setFormDirty(false);
    setEditingId(null);
    fetchMovies();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this movie and all its reviews?")) return;
    await fetch(`/api/movies/${id}`, { method: "DELETE" });
    if (selectedMovie?.id === id) setSelectedMovie(null);
    fetchMovies();
  }

  async function openReviews(m: Movie) {
    if (showForm && formDirty) {
      alert("You have unsaved movie changes. Please save or cancel them first.");
      return;
    }
    setShowForm(false);
    setSelectedMovie(m);
    fetchReviews(m.id);
  }

  async function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMovie) return;
    const payload = {
      reviewer_name: reviewForm.reviewer_name,
      rating:        parseInt(reviewForm.rating),
      review_text:   reviewForm.review_text || null,
      review_date:   reviewForm.review_date,
    };
    const res = await fetch(`/api/movies/${selectedMovie.id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setReviewForm({ reviewer_name: "", rating: "7", review_text: "", review_date: new Date().toISOString().slice(0, 10) });
      fetchReviews(selectedMovie.id);
      fetchMovies();
    }
  }

  async function handleDeleteReview(reviewId: number) {
    if (!selectedMovie) return;
    await fetch(`/api/movies/${selectedMovie.id}/reviews?review_id=${reviewId}`, { method: "DELETE" });
    fetchReviews(selectedMovie.id);
    fetchMovies();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Movies</h1>
        <button onClick={openAdd} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          + Add Movie
        </button>
      </div>

      {/* ── Reviews Panel ── */}
      {selectedMovie && (
        <div className="mb-8 bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Reviews for {selectedMovie.title}</h2>
            <button onClick={() => setSelectedMovie(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
          </div>

          {/* Add review form */}
          <form onSubmit={handleAddReview} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
            <input required value={reviewForm.reviewer_name}
              onChange={e => setReviewForm(f => ({ ...f, reviewer_name: e.target.value }))}
              className="border rounded px-3 py-2 text-sm" placeholder="Your name" />
            <div className="flex items-center gap-2">
              <label className="text-sm whitespace-nowrap">Rating (1–10):</label>
              <input type="number" min="1" max="10" required value={reviewForm.rating}
                onChange={e => setReviewForm(f => ({ ...f, rating: e.target.value }))}
                className="border rounded px-3 py-2 text-sm w-16" />
            </div>
            <input type="date" required value={reviewForm.review_date}
              onChange={e => setReviewForm(f => ({ ...f, review_date: e.target.value }))}
              className="border rounded px-3 py-2 text-sm" />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm">
              Add Review
            </button>
            <textarea value={reviewForm.review_text}
              onChange={e => setReviewForm(f => ({ ...f, review_text: e.target.value }))}
              className="md:col-span-4 border rounded px-3 py-2 text-sm" rows={2}
              placeholder="Review text (optional)" />
          </form>

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <p className="text-gray-400 text-sm">No reviews yet.</p>
          ) : (
            <ul className="space-y-3">
              {reviews.map(r => (
                <li key={r.id} className="border rounded p-3 flex justify-between items-start">
                  <div>
                    <div className="flex gap-3 items-center">
                      <span className="font-medium text-sm">{r.reviewer_name}</span>
                      <span className="text-amber-600 font-semibold text-sm">{r.rating}/10</span>
                      <span className="text-gray-400 text-xs">{r.review_date}</span>
                    </div>
                    {r.review_text && <p className="text-sm text-gray-600 mt-1">{r.review_text}</p>}
                  </div>
                  <button onClick={() => handleDeleteReview(r.id)}
                    className="text-red-500 hover:text-red-700 text-xs ml-4 shrink-0">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <div className="bg-white border rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit Movie" : "Add Movie"}</h2>
          {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input required value={form.title} onChange={e => updateForm("title", e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm" placeholder="Movie title" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Director</label>
              <input value={form.director} onChange={e => updateForm("director", e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm" placeholder="Director name" />
            </div>

            {/* Genre dropdown — populated dynamically from DB */}
            <div>
              <label className="block text-sm font-medium mb-1">Genre</label>
              <select value={form.genre_id} onChange={e => updateForm("genre_id", e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm bg-white">
                <option value="">— Select genre —</option>
                {genres.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Release Year</label>
              <input type="number" min="1888" max="2100" value={form.release_year}
                onChange={e => updateForm("release_year", e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm" placeholder="e.g. 2024" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
              <input type="number" min="1" value={form.duration_min}
                onChange={e => updateForm("duration_min", e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm" placeholder="e.g. 120" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <input value={form.language} onChange={e => updateForm("language", e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm" placeholder="English" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Synopsis</label>
              <textarea value={form.synopsis} onChange={e => updateForm("synopsis", e.target.value)}
                rows={3} className="w-full border rounded px-3 py-2 text-sm" placeholder="Brief description..." />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={loading}
                className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
                {loading ? "Saving…" : editingId ? "Update Movie" : "Create Movie"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setFormDirty(false); }}
                className="border px-5 py-2 rounded hover:bg-gray-100">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Movies Table ── */}
      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Title", "Director", "Genre", "Year", "Duration", "Language", "Reviews", "Avg Rating", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {movies.map(m => (
              <tr key={m.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{m.title}</td>
                <td className="px-4 py-3 text-gray-600">{m.director || "—"}</td>
                <td className="px-4 py-3">
                  {m.genre_name ? (
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{m.genre_name}</span>
                  ) : "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">{m.release_year || "—"}</td>
                <td className="px-4 py-3 text-gray-600">{m.duration_min ? `${m.duration_min} min` : "—"}</td>
                <td className="px-4 py-3 text-gray-600">{m.language || "—"}</td>
                <td className="px-4 py-3 text-center">{m.review_count}</td>
                <td className="px-4 py-3 text-center font-medium">
                  {m.avg_rating != null ? (
                    <span className="text-amber-600">{m.avg_rating} / 10</span>
                  ) : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openReviews(m)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">
                      Reviews
                    </button>
                    <button onClick={() => openEdit(m)}
                      className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(m.id)}
                      className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1 rounded">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {movies.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-400">No movies yet. Add one above.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
