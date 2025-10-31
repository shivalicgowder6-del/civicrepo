import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import getInitials from "../utils/getInitials";
import ReportList from "../components/ReportList"; // ✅ correct filename

const DashboardPage = () => {
  const { user, isLoggedIn } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const [image, setImage] = useState(null);
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locating, setLocating] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  // ✅ Fetch Reports
  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
      toast.error("Failed to load reports!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get location
  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported on this device.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        toast.success("📍 Location captured successfully!");
      },
      (err) => {
        console.error(err);
        setLocating(false);
        toast.error("Failed to get location.");
      }
    );
  };

  // ✅ Submit report
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !notes || !location.lat) {
      toast.warning("Please upload an image, add description, and capture location!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("notes", notes);
    formData.append("lat", location.lat);
    formData.append("lng", location.lng);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.post("http://localhost:5000/api/reports", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports((prev) => [data.report, ...prev]);
      toast.success("✅ Report submitted successfully!");
      setImage(null);
      setNotes("");
      setLocation({ lat: null, lng: null });
    } catch (err) {
      console.error(err);
      toast.error("Error submitting report!");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Stats
  const counts = reports.reduce(
    (acc, r) => {
      const s = r.status?.toLowerCase() || "open";
      acc[s] = (acc[s] || 0) + 1;
      acc.total++;
      return acc;
    },
    { total: 0, open: 0, pending: 0, resolved: 0, rejected: 0 }
  );

  // ✅ Filtered Reports
  const filteredReports =
    filter === "All"
      ? reports
      : reports.filter((r) => r.status?.toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-screen bg-[#0b1120] text-white flex">
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />

      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] p-6 border-r border-gray-800 hidden md:flex flex-col">
        <nav className="flex flex-col gap-4 text-gray-300">
          <a href="/dashboard" className="hover:text-blue-400">Dashboard</a>
          <a href="/myreports" className="hover:text-blue-400">My Reports</a>
          <button className="text-left hover:text-blue-400">Settings</button>
        </nav>
      </aside>

      {/* Main Section */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Civic Sentinel</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">
              Welcome back 👋 {isLoggedIn && user?.name ? user.name.split(" ")[0] : ""}
            </span>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {isLoggedIn && user?.name ? getInitials(user.name) : "U"}
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { title: "Total Reports", value: counts.total, color: "blue" },
            { title: "Open", value: counts.open, color: "yellow" },
            { title: "Pending", value: counts.pending, color: "purple" },
            { title: "Resolved", value: counts.resolved, color: "green" },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br from-${card.color}-500/20 to-${card.color}-700/30 border border-${card.color}-700/40 p-5 rounded-xl shadow-md`}
            >
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-3xl font-bold">{card.value}</p>
            </div>
          ))}
        </section>

        {/* Report Form */}
        <section className="bg-[#111827] border border-gray-800 rounded-xl p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-6">Report a New Issue</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-gray-300">Upload Image</label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-gray-200"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300">Description / Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe the issue (e.g., pothole, garbage, light failure...)"
                className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500"
                rows="4"
              ></textarea>
            </div>

            <div>
              <label className="block mb-2 text-gray-300">Capture Location</label>
              <button
                type="button"
                onClick={getLocation}
                disabled={locating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all"
              >
                {locating ? "Fetching location..." : "📍 Get My Location"}
              </button>

              {location.lat && (
                <p className="mt-2 text-sm text-gray-400">
                  ✅ Latitude: {location.lat.toFixed(4)}, Longitude: {location.lng.toFixed(4)}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all"
            >
              {uploading ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        </section>

        {/* Reports */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-6">Your Reports</h2>
          {loading ? <p>Loading reports...</p> : <ReportList reports={filteredReports} />}
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
