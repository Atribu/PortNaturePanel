"use client";

import { useEffect, useState } from "react";

export default function Egitimlerim() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEgitimler = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (!user || !user.departman) return;

      try {
        const res = await fetch("http://localhost:5003/api/training", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          // Sadece kendi departmanındaki eğitimleri filtrele
          const filtered = data.filter(
            (e) => e.department === user.departman
          );
          setTrainings(filtered);
        }
      } catch (err) {
        console.error("Eğitimler çekilemedi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEgitimler();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-4">📚 Eğitimlerim</h1>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : trainings.length === 0 ? (
        <p>Bu departman için tanımlı eğitim bulunmamaktadır.</p>
      ) : (
        <ul className="space-y-4">
          {trainings.map((t) => (
            <li key={t._id} className="border p-4 rounded shadow-sm">
              <h3 className="text-lg font-semibold">{t.title}</h3>
              <p className="text-sm text-gray-600">{t.description}</p>
              <a
                href={t.contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm underline mt-2 inline-block"
              >
                İçeriği Görüntüle
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}