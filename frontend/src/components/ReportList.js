// src/components/ReportsList.jsx
import React, { useMemo, useState } from "react";

/**
 * Utility function to return Tailwind classes based on report status
 */
const statusChip = (status) => {
  const s = (status || "open").toLowerCase();
  switch (s) {
    case "resolved":
      return "bg-green-500/20 text-green-400";
    case "pending":
      return "bg-yellow-500/20 text-yellow-400";
    case "rejected":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-blue-500/20 text-blue-400"; // open/default
  }
};

export default function ReportsList({ reports = [], loading = false }) {
  const [filter, setFilter] = useState("All");

  // ✅ Filtering logic
  const filteredReports = useMemo(() => {
    if (filter === "All") return reports;
    return reports.filter(
      (r) => (r.status || "open").toLowerCase() === filter.toLowerCase()
    );
  }, [reports, filter]);

  // ✅ Image fallback logic (handles missing URLs or broken images)
  const getImageUrl = (url) => {
    if (!url) return "/placeholder.png"; // optional default image
    return url.startsWith("http") ? url : `http://localhost:5000/${url}`;
  };

  return (
    <section className="bg-[#111827] border border-gray-800 rounded-xl p-6 shadow-lg">
      {/* 🔹 Filter Buttons */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Filter Reports</h2>
        <div className="flex gap-3 flex-wrap">
          {["All", "Open", "Pending", "Resolved", "Rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                filter === f
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 Loading State */}
      {loading && (
        <div className="text-center py-10 text-gray-400 animate-pulse">
          Loading reports...
        </div>
      )}

      {/* 🔹 No Reports */}
      {!loading && filteredReports.length === 0 && (
        <p className="text-gray-400 text-center py-10">
          No reports found for this filter.
        </p>
      )}

      {/* 🔹 Reports Grid */}
      {!loading && filteredReports.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredReports.map((r, i) => (
            <article
              key={r._id || i}
              className="bg-[#1f2937] border border-gray-700 rounded-xl overflow-hidden hover:shadow-blue-500/10 hover:shadow-md transition duration-300"
            >
              <div className="w-full aspect-[4/3] bg-black/20">
                <img
                  src={getImageUrl(r.imageUrl)}
                  alt="Issue"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                    e.currentTarget.style.opacity = 0.6;
                  }}
                />
              </div>

              <div className="p-4">
                {/* Description */}
                <p className="text-sm text-gray-200 line-clamp-2 min-h-[2.5rem]">
                  {r.notes || "No description provided."}
                </p>

                {/* Date */}
                <p className="text-xs text-gray-400 mt-2">
                  📅{" "}
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "Unknown date"}
                </p>

                {/* Location */}
                {Array.isArray(r.location?.coordinates) &&
                r.location.coordinates.length === 2 ? (
                  <p className="text-xs text-gray-500 mt-1">
                    📍 Lat: {Number(r.location.coordinates[1]).toFixed(4)}, Lng:{" "}
                    {Number(r.location.coordinates[0]).toFixed(4)}
                  </p>
                ) : r.lat && r.lng ? (
                  <p className="text-xs text-gray-500 mt-1">
                    📍 Lat: {Number(r.lat).toFixed(4)}, Lng:{" "}
                    {Number(r.lng).toFixed(4)}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1 italic">📍 Location not captured</p>
                )}

                {/* Status */}
                <span
                  className={`mt-3 inline-block text-xs font-semibold px-3 py-1 rounded ${statusChip(
                    r.status
                  )}`}
                >
                  {String(r.status || "Open")}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
