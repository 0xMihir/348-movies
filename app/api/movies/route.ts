import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// GET /api/movies
// Returns all movies joined with genre name and avg review rating.
export async function GET() {
  try {
    const [rows] = await pool.execute(`
      SELECT
        m.id,
        m.title,
        m.director,
        m.genre_id,
        g.name        AS genre_name,
        m.release_year,
        m.duration_min,
        m.language,
        m.synopsis,
        m.created_at,
        COUNT(r.id)              AS review_count,
        ROUND(AVG(r.rating), 1) AS avg_rating
      FROM Movies m
      LEFT JOIN Genres  g ON g.id = m.genre_id
      LEFT JOIN Reviews r ON r.movie_id = m.id
      GROUP BY m.id, m.title, m.director, m.genre_id, g.name,
               m.release_year, m.duration_min, m.language, m.synopsis, m.created_at
      ORDER BY m.title ASC
    `);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/movies error:", err);
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}

// POST /api/movies
// Inserts a new movie. Uses parameterized query to prevent SQL injection.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, director, genre_id, release_year, duration_min, language, synopsis } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const [result] = await pool.execute(
      `INSERT INTO Movies (title, director, genre_id, release_year, duration_min, language, synopsis)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        director?.trim() || null,
        genre_id || null,
        release_year || null,
        duration_min || null,
        language?.trim() || "English",
        synopsis?.trim() || null,
      ]
    );

    const insertResult = result as { insertId: number };
    return NextResponse.json({ id: insertResult.insertId }, { status: 201 });
  } catch (err) {
    console.error("POST /api/movies error:", err);
    return NextResponse.json({ error: "Failed to create movie" }, { status: 500 });
  }
}
