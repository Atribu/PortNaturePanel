"use client";
import { useEffect, useState } from "react";

export default function TrainingPanel() {
  const [trainings, setTrainings] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", department: "", contentUrl: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5003/api/training", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTrainings(data);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:5003/api/training/${editingId}`
      : "http://localhost:5003/api/training";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ title: "", description: "", department: "", contentUrl: "" });
      setEditingId(null);
      fetchTrainings();
    } else {
      alert("İşlem başarısız!");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5003/api/training/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTrainings();
  };

  const startEdit = (training) => {
    setForm(training);
    setEditingId(training._id);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-4">📚 Eğitim Yönetimi</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8">
          <input
            type="text"
            name="title"
            placeholder="Başlık"
            value={form.title}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="description"
            placeholder="Açıklama"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          >
            <option value="">Departman Seç</option>
            <option>İnsan Kaynakları</option>
            <option>Satış & Pazarlama</option>
            <option>Bilgi Sistemleri</option>
            <option>Kat Hizmetleri</option>
            <option>Güvenlik</option>
            <option>Teknik Servis</option>
            <option>Satınalma</option>
            <option>Muhasebe</option>
            <option>Mutfak</option>
            <option>Yiyecek & İçecek</option>
            <option>Animasyon</option>
            <option>Kalite</option>
            <option>Ön Büro</option>
          </select>
          <input
            type="text"
            name="contentUrl"
            placeholder="İçerik URL"
            value={form.contentUrl}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <button className="bg-blue-500 text-white p-2 rounded">
            {editingId ? "Güncelle" : "Ekle"}
          </button>
        </form>

        <table className="w-full border">
          <thead>
            <tr className="bg-blue-100">
              <th className="border p-2">Başlık</th>
              <th className="border p-2">Departman</th>
              <th className="border p-2">İçerik URL</th>
              <th className="border p-2">Düzenle</th>
              <th className="border p-2">Sil</th>
            </tr>
          </thead>
          <tbody>
            {trainings.map((training) => (
              <tr key={training._id}>
                <td className="border p-2">{training.title}</td>
                <td className="border p-2">{training.department}</td>
                <td className="border p-2">{training.contentUrl}</td>
                <td className="border p-2">
                  <button
                    onClick={() => startEdit(training)}
                    className="text-indigo-600 hover:underline"
                  >
                    Düzenle
                  </button>
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(training._id)}
                    className="text-red-600 hover:underline"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}