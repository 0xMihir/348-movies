import { NextRequest, NextResponse } from "next/server";
import { PoolConnection } from "mysql2/promise";
import pool from "@/lib/db";

// GET /api/report
// Query params: genre_id, year_from, year_to, min_rating
//
// Returns filtered movies with per-movie stats and overall aggregates.
// Both queries run inside a single REPEATABLE READ transaction so that a
// review or movie inserted between the two SELECTs cannot cause the
// per-movie rows and the summary totals to disagree.
// All filter values are passed as parameterized placeholders — no string
// interpolation — protecting against SQL injection.
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const genreId   = searchParams.get("genre_id");
  const yearFrom  = parseInt(searchParams.get("year_from")  || "1888");
  const yearTo    = parseInt(searchParams.get("year_to")    || "2100");
  const minRating = parseFloat(searchParams.get("min_rating") || "0");

  // Build optional genre filter clause
  const genreClause = genreId ? "AND m.genre_id = ?" : "";

  let conn: PoolConnection | null = null;
  try {
    conn = await pool.getConnection();

    // REPEATABLE READ ensures both queries see the same snapshot of the data.
    // Without this, a concurrent INSERT into Reviews between the two queries
    // could make the per-movie avg_rating and the overall_avg_rating disagree.
    await conn.execute("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ");
    await conn.beginTransaction();

    // Per-movie stats with HAVING to filter by avg rating
    const [movies] = await conn.execute(
      `SELECT
         m.id,
         m.title,
         m.director,
         m.release_year,
         m.duration_min,
         m.language,
         g.name                   AS genre,
         COUNT(r.id)              AS review_count,
         ROUND(AVG(r.rating), 2) AS avg_rating,
         MIN(r.rating)            AS min_rating,
         MAX(r.rating)            AS max_rating
       FROM Movies m
       LEFT JOIN Genres  g ON g.id = m.genre_id
       LEFT JOIN Reviews r ON r.movie_id = m.id
       WHERE m.release_year BETWEEN ? AND ?
         ${genreClause}
       GROUP BY m.id, m.title, m.director, m.release_year,
                m.duration_min, m.language, g.name
       HAVING avg_rating >= ? OR review_count = 0
       ORDER BY avg_rating DESC, m.title ASC`,
      // Param order matches SQL placeholders: year range (WHERE), genre (AND), min_rating (HAVING)
      genreId
        ? [yearFrom, yearTo, genreId, minRating]
        : [yearFrom, yearTo, minRating]
    );

    // Overall aggregate stats for the filtered result set
    const [stats] = await conn.execute(
      `SELECT
         COUNT(DISTINCT m.id)          AS total_movies,
         COUNT(r.id)                   AS total_reviews,
         ROUND(AVG(m.duration_min), 1) AS avg_duration_min,
         ROUND(AVG(r.rating), 2)       AS overall_avg_rating
       FROM Movies m
       LEFT JOIN Genres  g ON g.id = m.genre_id
       LEFT JOIN Reviews r ON r.movie_id = m.id
       WHERE m.release_year BETWEEN ? AND ?
         ${genreClause}`,
      genreId ? [yearFrom, yearTo, genreId] : [yearFrom, yearTo]
    );

    await conn.commit();

    return NextResponse.json({ movies, stats: (stats as unknown[])[0] });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error("GET /api/report error:", err);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  } finally {
    if (conn) conn.release();
  }
}
