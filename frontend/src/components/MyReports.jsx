// src/pages/MyReports.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ReportsList from "../components/ReportsList";

export default function MyReports() {
  const { token, user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/reports/user", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          params: user?.id ? { userId: user.id } : {},
        });
        if (isMounted) setReports(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => (isMounted = false);
  }, [token, user]);

  return (
    <main className="max-w-7xl mx-auto px-5 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6">My Reports</h1>
      {loading ? <p>Loading…</p> : <ReportsList reports={reports} />}
    </main>
  );
}
