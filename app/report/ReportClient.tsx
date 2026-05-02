"use client";

import { useState } from "react";

interface Genre {
  id: number;
  name: string;
}

interface MovieRow {
  id: number;
  title: string;
  director: string | null;
  genre: string | null;
  release_year: number | null;
  duration_min: number | null;
  language: string | null;
  review_count: number;
  avg_rating: number | null;
  min_rating: number | null;
  max_rating: number | null;
}

interface Stats {
  total_movies: number;
  total_reviews: number;
  avg_duration_min: number | null;
  overall_avg_rating: number | null;
}

const currentYear = new Date().getFullYear();

export default function ReportClient({
  initialGenres,
  initialMovies,
  initialStats,
}: {
  initialGenres: Genre[];
  initialMovies: MovieRow[];
  initialStats: Stats;
}) {
  const [genres]                   = useState<Genre[]>(initialGenres);
  const [genreId, setGenreId]      = useState("");
  const [yearFrom, setYearFrom]    = useState("1900");
  const [yearTo, setYearTo]        = useState(currentYear.toString());
  const [minRating, setMinRating]  = useState("0");
  const [movies, setMovies]        = useState<MovieRow[]>(initialMovies);
  const [stats, setStats]          = useState<Stats | null>(initialStats);
  const [loading, setLoading]      = useState(false);

  async function runReport() {
    setLoading(true);
    const params = new URLSearchParams();
    if (genreId)   params.set("genre_id",   genreId);
    if (yearFrom)  params.set("year_from",  yearFrom);
    if (yearTo)    params.set("year_to",    yearTo);
    if (minRating) params.set("min_rating", minRating);

    const res = await fetch(`/api/report?${params}`);
    const data = await res.json();
    setMovies(data.movies || []);
    setStats(data.stats || null);
    setLoading(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runReport();
  }

  function handleReset() {
    setGenreId("");
    setYearFrom("1900");
    setYearTo(currentYear.toString());
    setMinRating("0");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Movie Report</h1>

      {/* ── Filter Controls ── */}
      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 mb-8 shadow-sm">
        <h2 className="font-semibold mb-4 text-gray-700">Filter Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

          {/* Genre dropdown — populated from DB, not hardcoded */}
          <div>
            <label className="block text-sm font-medium mb-1">Genre</label>
            <select value={genreId} onChange={e => setGenreId(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm bg-white">
              <option value="">All genres</option>
              {genres.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Year From</label>
            <input type="number" min="1888" max="2100" value={yearFrom}
              onChange={e => setYearFrom(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Year To</label>
            <input type="number" min="1888" max="2100" value={yearTo}
              onChange={e => setYearTo(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Min Avg Rating: <span className="text-indigo-600 font-semibold">{minRating}</span>
            </label>
            <input type="range" min="0" max="10" step="0.5" value={minRating}
              onChange={e => setMinRating(e.target.value)}
              className="w-full" />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button type="submit" disabled={loading}
            className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
            {loading ? "Loading…" : "Generate Report"}
          </button>
          <button type="button" onClick={handleReset}
            className="border px-5 py-2 rounded hover:bg-gray-100 text-sm">
            Reset Filters
          </button>
        </div>
      </form>

      {/* ── Aggregate Stats ── */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Movies matched",     value: stats.total_movies },
            { label: "Total reviews",      value: stats.total_reviews },
            { label: "Avg duration",       value: stats.avg_duration_min != null ? `${stats.avg_duration_min} min` : "—" },
            { label: "Overall avg rating", value: stats.overall_avg_rating != null ? `${stats.overall_avg_rating} / 10` : "—" },
          ].map(s => (
            <div key={s.label} className="bg-white border rounded-lg p-4 shadow-sm text-center">
              <div className="text-2xl font-bold text-indigo-600">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Results Table ── */}
      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Title", "Director", "Genre", "Year", "Duration", "Language", "Reviews", "Avg", "Min", "Max"].map(h => (
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
                  {m.genre ? (
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{m.genre}</span>
                  ) : "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">{m.release_year || "—"}</td>
                <td className="px-4 py-3 text-gray-600">{m.duration_min ? `${m.duration_min} min` : "—"}</td>
                <td className="px-4 py-3 text-gray-600">{m.language || "—"}</td>
                <td className="px-4 py-3 text-center">{m.review_count}</td>
                <td className="px-4 py-3 text-center font-semibold text-amber-600">
                  {m.avg_rating != null ? m.avg_rating : "—"}
                </td>
                <td className="px-4 py-3 text-center text-gray-500">{m.min_rating ?? "—"}</td>
                <td className="px-4 py-3 text-center text-gray-500">{m.max_rating ?? "—"}</td>
              </tr>
            ))}
            {movies.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-400">
                  No movies match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
