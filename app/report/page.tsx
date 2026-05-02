import pool from "@/lib/db";
import ReportClient from "./ReportClient";

export const dynamic = "force-dynamic";

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

export default async function ReportPage() {
  const currentYear = new Date().getFullYear();
  const yearFrom = 1900;
  const yearTo = currentYear;

  const [genres] = await pool.execute(
    "SELECT id, name FROM Genres ORDER BY name ASC"
  );

  const [movies] = await pool.execute(
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
     GROUP BY m.id, m.title, m.director, m.release_year,
              m.duration_min, m.language, g.name
     HAVING avg_rating >= ? OR review_count = 0
     ORDER BY avg_rating DESC, m.title ASC`,
    [yearFrom, yearTo, 0]
  );

  const [statsRows] = await pool.execute(
    `SELECT
       COUNT(DISTINCT m.id)          AS total_movies,
       COUNT(r.id)                   AS total_reviews,
       ROUND(AVG(m.duration_min), 1) AS avg_duration_min,
       ROUND(AVG(r.rating), 2)       AS overall_avg_rating
     FROM Movies m
     LEFT JOIN Genres  g ON g.id = m.genre_id
     LEFT JOIN Reviews r ON r.movie_id = m.id
     WHERE m.release_year BETWEEN ? AND ?`,
    [yearFrom, yearTo]
  );

  return (
    <ReportClient
      initialGenres={genres as Genre[]}
      initialMovies={movies as MovieRow[]}
      initialStats={(statsRows as Stats[])[0]}
    />
  );
}
