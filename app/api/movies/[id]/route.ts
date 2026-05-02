import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET /api/movies/[id]
// Returns a single movie with its reviews.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const [movies] = await pool.execute(
      `SELECT m.*, g.name AS genre_name
       FROM Movies m
       LEFT JOIN Genres g ON g.id = m.genre_id
       WHERE m.id = ?`,
      [id]
    );
    const rows = movies as unknown[];
    if (rows.length === 0) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    const [reviews] = await pool.execute(
      `SELECT id, reviewer_name, rating, review_text, review_date
       FROM Reviews
       WHERE movie_id = ?
       ORDER BY review_date DESC`,
      [id]
    );

    return NextResponse.json({ movie: rows[0], reviews });
  } catch (err) {
    console.error("GET /api/movies/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch movie" }, { status: 500 });
  }
}

// PUT /api/movies/[id]
// Updates movie fields. Uses parameterized query.
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { title, director, genre_id, release_year, duration_min, language, synopsis } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const [result] = await pool.execute(
      `UPDATE Movies
       SET title = ?, director = ?, genre_id = ?, release_year = ?,
           duration_min = ?, language = ?, synopsis = ?
       WHERE id = ?`,
      [
        title.trim(),
        director?.trim() || null,
        genre_id || null,
        release_year || null,
        duration_min || null,
        language?.trim() || "English",
        synopsis?.trim() || null,
        id,
      ]
    );

    const res = result as { affectedRows: number };
    if (res.affectedRows === 0) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/movies/[id] error:", err);
    return NextResponse.json({ error: "Failed to update movie" }, { status: 500 });
  }
}

// DELETE /api/movies/[id]
// Deletes a movie and its reviews (ON DELETE CASCADE handles reviews).
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const [result] = await pool.execute(
      "DELETE FROM Movies WHERE id = ?",
      [id]
    );
    const res = result as { affectedRows: number };
    if (res.affectedRows === 0) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/movies/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 });
  }
}
