import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center mt-16">
      <h1 className="text-4xl font-bold mb-4">Movie Review Tracker</h1>
      <p className="text-gray-600 mb-10 text-lg">
        Browse, manage, and review movies. Generate filtered reports with aggregate statistics.
      </p>
      <div className="flex justify-center gap-6">
        <Link
          href="/movies"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium"
        >
          Manage Movies
        </Link>
        <Link
          href="/report"
          className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 font-medium"
        >
          View Report
        </Link>
      </div>
    </div>
  );
}
