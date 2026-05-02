import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Movie Review Tracker",
  description: "CS348 Project — Movie Review Tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <nav className="bg-indigo-700 text-white shadow">
          <div className="max-w-6xl mx-auto px-4 py-3 flex gap-6 items-center">
            <Link href="/" className="font-bold text-lg tracking-tight">
              🎬 Movie Review Tracker
            </Link>
            <Link href="/movies" className="hover:underline text-sm">
              Manage Movies
            </Link>
            <Link href="/report" className="hover:underline text-sm">
              Report
            </Link>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
