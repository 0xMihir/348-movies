import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// POST /api/movies/[id]/reviews
// Adds a review for a movie. Uses parameterized query.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { reviewer_name, rating, review_text, review_date } = body;

    if (!reviewer_name || !rating || !review_date) {
      return NextResponse.json(
        { error: "reviewer_name, rating, and review_date are required" },
        { status: 400 }
      );
    }
    if (rating < 1 || rating > 10) {
      return NextResponse.json({ error: "Rating must be 1–10" }, { status: 400 });
    }

    const [result] = await pool.execute(
      `INSERT INTO Reviews (movie_id, reviewer_name, rating, review_text, review_date)
       VALUES (?, ?, ?, ?, ?)`,
      [id, reviewer_name.trim(), rating, review_text?.trim() || null, review_date]
    );

    const insertResult = result as { insertId: number };
    return NextResponse.json({ id: insertResult.insertId }, { status: 201 });
  } catch (err) {
    console.error("POST /api/movies/[id]/reviews error:", err);
    return NextResponse.json({ error: "Failed to add review" }, { status: 500 });
  }
}

// DELETE /api/movies/[id]/reviews?review_id=X
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const reviewId = req.nextUrl.searchParams.get("review_id");
  if (!reviewId) {
    return NextResponse.json({ error: "review_id query param required" }, { status: 400 });
  }
  try {
    const [result] = await pool.execute(
      "DELETE FROM Reviews WHERE id = ? AND movie_id = ?",
      [reviewId, id]
    );
    const res = result as { affectedRows: number };
    if (res.affectedRows === 0) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/movies/[id]/reviews error:", err);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
