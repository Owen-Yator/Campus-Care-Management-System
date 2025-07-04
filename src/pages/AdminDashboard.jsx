import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchReports();
    fetchComplaints();
  }, []);

  const fetchReports = async () => {
    const res = await fetch("/api/reports");
    const data = await res.json();
    setReports(data);
  };

  const fetchComplaints = async () => {
    const res = await fetch("/api/complaints");
    const data = await res.json();
    setComplaints(data);
  };

  const handleDeleteReport = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      await fetch(`/api/reports/${id}`, { method: "DELETE" });
      fetchReports();
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      await fetch(`/api/complaints/${id}`, { method: "DELETE" });
      fetchComplaints();
    }
  };

  const handleMarkResolvedReport = async (id) => {
    await fetch(`/api/reports/${id}/status`, { method: "PATCH" });
    fetchReports();
  };

  const handleMarkResolvedComplaint = async (id) => {
    await fetch(`/api/complaints/${id}/status`, { method: "PATCH" });
    fetchComplaints();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <Navbar isAdmin />

      <div className="pt-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-blue-800 mb-10 text-center">Admin Dashboard</h2>

        {/* Reports Section */}
        <section className="mb-16">
          <h3 className="text-2xl font-semibold text-purple-700 mb-6">📋 Damage Reports</h3>
          {reports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((report) => (
                <div key={report._id} className="border border-purple-200 p-5 rounded-xl bg-white shadow-md">
                  <p className="text-gray-800"><strong>Description:</strong> {report.description}</p>
                  <p className="text-gray-800"><strong>Location:</strong> {report.location}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    ⏱ {new Date(report.createdAt).toLocaleString()}
                  </p>

                  {/* Status Label */}
                  <p className={`text-sm font-medium mt-2 ${
                    report.status === "resolved" ? "text-green-600" : "text-yellow-600"
                  }`}>
                    {report.status === "resolved" ? "✅ Resolved" : "🟡 Pending"}
                  </p>

                  {/* Report Image */}
                  {report.image?.data && (
                    <img
                      src={`data:${report.image.contentType};base64,${btoa(
                        new Uint8Array(report.image.data.data)
                          .reduce((acc, byte) => acc + String.fromCharCode(byte), "")
                      )}`}
                      alt="Reported Issue"
                      className="mt-4 max-h-48 w-full object-cover rounded-lg"
                    />
                  )}

                  {/* Mark as Resolved */}
                  {report.status === "pending" && (
                    <button
                      onClick={() => handleMarkResolvedReport(report._id)}
                      className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                      Mark as Resolved
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteReport(report._id)}
                    className="mt-3 ml-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete Report
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reports available.</p>
          )}
        </section>

        {/* Complaints Section */}
        <section>
          <h3 className="text-2xl font-semibold text-red-700 mb-6">🗣️ Complaints</h3>
          {complaints.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complaints.map((complaint) => (
                <li key={complaint._id} className="border border-red-200 p-5 rounded-xl bg-white shadow-md">
                  <p className="text-gray-800"><strong>Description:</strong> {complaint.description}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    ⏱ {new Date(complaint.createdAt).toLocaleString()}
                  </p>

                  {/* Status Label */}
                  <p className={`text-sm font-medium mt-2 ${
                    complaint.status === "resolved" ? "text-green-600" : "text-yellow-600"
                  }`}>
                    {complaint.status === "resolved" ? "✅ Resolved" : "🟡 Pending"}
                  </p>

                  {/* Complaint Image */}
                  {complaint.image?.data && (
                    <img
                      src={`data:${complaint.image.contentType};base64,${btoa(
                        new Uint8Array(complaint.image.data.data)
                          .reduce((acc, byte) => acc + String.fromCharCode(byte), "")
                      )}`}
                      alt="Complaint Image"
                      className="mt-4 max-h-48 w-full object-cover rounded-lg"
                    />
                  )}

                  {/* Mark as Resolved */}
                  {complaint.status === "pending" && (
                    <button
                      onClick={() => handleMarkResolvedComplaint(complaint._id)}
                      className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                      Mark as Resolved
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteComplaint(complaint._id)}
                    className="mt-3 ml-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete Complaint
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No complaints available.</p>
          )}
        </section>
      </div>
    </div>
  );
}
