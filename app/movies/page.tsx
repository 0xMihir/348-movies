import pool from "@/lib/db";
import MoviesClient from "./MoviesClient";

export const dynamic = "force-dynamic";

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

export default async function MoviesPage() {
  const [movies] = await pool.execute(`
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

  const [genres] = await pool.execute(
    "SELECT id, name FROM Genres ORDER BY name ASC"
  );

  return (
    <MoviesClient
      initialMovies={movies as Movie[]}
      initialGenres={genres as Genre[]}
    />
  );
}
