"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5003/api/admin/recent-users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setRecentUsers(data);
        }
      } catch (err) {
        console.error("Son kullanıcıları çekme hatası:", err);
      }
    };

    fetchRecentUsers();
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5003/api/admin/summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setSummary(data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Sunucu hatası");
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Dashboard</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {!summary ? (
          <p>Yükleniyor...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <p className="text-sm text-gray-500">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-800">{summary.totalUsers}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <p className="text-sm text-gray-500">Admin Sayısı</p>
                <p className="text-2xl font-bold text-green-600">{summary.totalAdmins}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow text-center">
                <p className="text-sm text-gray-500">Personel Sayısı</p>
                <p className="text-2xl font-bold text-blue-600">{summary.totalPersonel}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Departmanlara Göre Dağılım</h2>
              <ul className="space-y-2">
                {Object.entries(summary.departmanCounts).map(([dep, count]) => (
                  <li key={dep} className="flex justify-between border-b pb-2">
                    <span>{dep}</span>
                    <span className="font-semibold">{count} kişi</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow mt-8">
              <h2 className="text-xl font-semibold mb-4">📊 Departmanlara Göre Grafik</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.entries(summary.departmanCounts).map(([name, value]) => ({
                    name,
                    value,
                  }))}
                >
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {summary && summary.departmanCounts && (
              <div className="bg-white p-6 rounded-xl shadow mt-8">
                <h2 className="text-xl font-semibold mb-4">🍰 Departmanlara Göre Dağılım (Grafik)</h2>
                <div className="flex justify-center">
                  <PieChart width={400} height={400}>
                    <Pie
                      data={Object.entries(summary.departmanCounts).map(([name, value]) => ({
                        name,
                        value,
                      }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label
                    >
                      {Object.entries(summary.departmanCounts).map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#ec4899", "#14b8a6", "#8b5cf6", "#f97316", "#0ea5e9"][index % 10]}
                        />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </div>
              </div>
            )}

            {recentUsers.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow mt-8">
                <h2 className="text-xl font-semibold mb-4">🆕 Son Eklenen Kullanıcılar</h2>
                <ul className="space-y-3 text-sm">
                  {recentUsers.map((user) => (
                    <li key={user._id} className="flex justify-between border-b pb-2">
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-gray-500">{user.email}</p>
                      </div>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full h-fit mt-1">
                        {user.departman}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}