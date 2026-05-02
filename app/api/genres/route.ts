import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET /api/genres
// Returns all genres ordered alphabetically.
// Used to populate genre dropdowns dynamically from the database.
export async function GET() {
  try {
    const [rows] = await pool.execute(
      "SELECT id, name FROM Genres ORDER BY name ASC"
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/genres error:", err);
    return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 });
  }
}
