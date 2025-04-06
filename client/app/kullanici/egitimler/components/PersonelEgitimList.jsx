"use client";

import { useEffect, useState } from "react";
import { FileText, FileVideo, FileSpreadsheet, File } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function Egitimlerim() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedTrainings, setCompletedTrainings] = useState([]);
  const [selectedTrainingId, setSelectedTrainingId] = useState(null);
  // Departmana ait eğitimlerin ID listesi
  const trainingIds = trainings.map((t) => t._id?.toString()).filter(Boolean);

  // Bu kullanıcı o departmandaki hangi eğitimleri tamamlamış?
  const completedInThisDept = completedTrainings
  .map((c) => c.trainingId)
  .filter((id) => trainingIds.includes(id));

  const [filter, setFilter] = useState("all"); // "all", "completed", "incomplete"

  // Yüzde hesabı
  const completionPercentage =
    trainings.length > 0
      ? Math.round((completedInThisDept.length / trainings.length) * 100)
      : 0;
  const filteredTrainings = trainings.filter((t) => {
  const isCompleted = completedTrainings.some(
    (c) => c.trainingId === t._id.toString()
  );

  if (filter === "completed") return isCompleted;
  if (filter === "incomplete") return !isCompleted;
  return true;
});

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
          const filtered = data.filter((e) => e.department === user.departman);
          setTrainings(filtered);
        }
      } catch (err) {
        console.error("Eğitimler çekilemedi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEgitimler();
    fetchCompletedTrainings(); // ⬅️ Ayrı çağır, gecikme olmasın
  }, []);

  const handleCompleteTraining = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5003/api/training/${selectedTrainingId}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    if (res.ok) {
      setCompletedTrainings((prev) => [...prev, selectedTrainingId]);
    } else {
      alert(data.message);
    }
    setSelectedTrainingId(null); // modal'ı kapat
  };

  const fetchCompletedTrainings = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5003/api/training/completed", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setCompletedTrainings(
          data.completed.map((c) => ({
            trainingId: c.trainingId,
            completedAt: c.completedAt,
          }))
        );
      }
    } catch (err) {
      console.error("Tamamlanan eğitimler alınamadı:", err);
    }
  };

  const getFileIcon = (url) => {
    if (url.match(/\.(pdf)$/)) return <FileText className="w-5 h-5" />;
    if (url.match(/\.(mp4|mov|avi)$/)) return <FileVideo className="w-5 h-5" />;
    if (url.match(/\.(xls|xlsx|csv)$/))
      return <FileSpreadsheet className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-4">📚 Eğitimlerim</h1>
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-full text-sm border ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Tümü
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 rounded-full text-sm border ${
            filter === "completed"
              ? "bg-green-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Tamamlananlar
        </button>
        <button
          onClick={() => setFilter("incomplete")}
          className={`px-3 py-1 rounded-full text-sm border ${
            filter === "incomplete"
              ? "bg-yellow-500 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Tamamlanmayanlar
        </button>
      </div>
      {trainings.length > 0 && (
        <div className="mb-4 text-sm text-gray-700">
          Tamamlanan:{" "}
          <span className="font-semibold">{completedInThisDept.length}</span> /{" "}
          {trainings.length} (
          <span className="font-semibold text-green-600">
            {completionPercentage}%
          </span>
          )
        </div>
      )}

      {loading ? (
        <p>Yükleniyor...</p>
      ) : trainings.length === 0 ? (
        <p>Bu departman için tanımlı eğitim bulunmamaktadır.</p>
      ) : (
        <ul className="space-y-4">
          {filteredTrainings.map((t) => {
            const trainingStatus = completedTrainings.find(
              (c) => c.trainingId === t._id.toString()
            );

            return (
              <li key={t._id} className="border p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">{t.title}</h3>
                <p className="text-gray-600">{t.description}</p>
                <a
                  href={`http://localhost:5003/${t.contentUrl}`}
                  target="_blank"
                  className="text-blue-600 underline flex items-center gap-2 mt-2"
                >
                  {getFileIcon(t.contentUrl)} İçeriği Görüntüle
                </a>

                {trainingStatus ? (
                  <span className="inline-block mt-3 bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm">
                    ✅ Tamamlandı —{" "}
                    {new Date(trainingStatus.completedAt).toLocaleString(
                      "tr-TR"
                    )}
                  </span>
                ) : (
                  <button
                    onClick={() => setSelectedTrainingId(t._id)}
                    className="mt-3 bg-green-500 text-white py-1 px-3 rounded-xl hover:bg-green-600 text-sm"
                  >
                    ✅ Tamamlandı Olarak İşaretle
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {/* ConfirmDialog bileşenini tam buraya ekliyorsun */}
      <ConfirmDialog
        open={!!selectedTrainingId}
        onOpenChange={(open) => {
          if (!open) setSelectedTrainingId(null);
        }}
        onConfirm={handleCompleteTraining}
      />
    </div>
  );
}
