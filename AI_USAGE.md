# AI Usage

This document discloses how AI tools were used during the development of this
project, in accordance with the CS348 AI Acceptable Use Policy for the
Semester Project.

## Tools used

- **Claude (Anthropic)** — used as a coding assistant during development.

## What the AI assisted with

The schema design and the high-level architecture decisions were made by me.
The AI was used in a supporting role for the following tasks:

1. **Translating my schema design into SQL syntax.** I defined the tables,
   columns, data types, primary keys, and foreign keys on paper first
   (`Genres`, `Movies`, `Reviews`). The AI helped me write the corresponding
   `CREATE TABLE` statements in MySQL syntax.

2. **Foreign-key constraint behavior.** I decided that deleting a movie
   should also delete its reviews (no orphaned reviews for a non-existent
   movie). The AI helped me express this as `ON DELETE CASCADE` on
   `fk_reviews_movie` and `ON DELETE SET NULL` on `fk_movies_genre`.

3. **Isolation level for the report transaction.** The AI recommended
   `REPEATABLE READ` for the `/api/report` endpoint, where two SELECTs run
   back-to-back (per-movie stats and overall aggregates). I evaluated the
   recommendation against the requirements of this application — the report
   shows aggregations over the full filtered set, and a concurrent insert
   between the two queries could make the per-movie average and the overall
   average disagree — and decided to use `REPEATABLE READ`. The concurrency
   tradeoff is acceptable for a small-scale review app; for a much larger
   read-heavy deployment a weaker isolation level (e.g., `READ COMMITTED`)
   would be a reasonable alternative.

4. **Boilerplate for the filter logic in the report endpoint.** The AI
   generated an initial draft of the parameter binding for the year range,
   genre filter, and minimum-rating filter on `/api/report`. I reviewed the
   draft and caught a bug in how the parameters were ordered relative to the
   `?` placeholders, and corrected it before committing. The final query
   uses parameterized placeholders for every user-controlled input.

5. **General coding assistance.** Minor help with Next.js App Router route
   handler signatures (the `params: Promise<{ id: string }>` pattern in
   Next.js 15) and TypeScript typing for the `mysql2/promise` result rows.

## How I verified / modified the AI-generated output

- **Read every line before committing.** I do not commit code I do not
  understand. Where the AI's output was unclear to me, I either rewrote it
  or asked for an explanation until I could justify the choice myself.
- **Caught and corrected a real bug.** As described above, the initial
  filter-binding code from the AI had the parameters in the wrong order
  relative to the `?` placeholders. I caught this on review and fixed it.
- **Cross-checked against official documentation.** For the parts of the
  stack I was less familiar with — `mysql2/promise` API, Next.js route
  handler conventions, and MySQL isolation-level semantics — I verified
  the AI's claims against the official MySQL and Next.js docs rather than
  trusting the AI alone.
- **Owned the design decisions.** Schema design, choice of indexes, the
  decision to use prepared statements everywhere for SQL-injection
  protection, and the isolation-level choice were my decisions. The AI
  was a sounding board, not the author of the design.

## Summary

I am the author of this submission. I can explain and justify every part
of the schema, the indexes, the SQL-injection protection, and the
transaction / isolation-level choices in my project.
