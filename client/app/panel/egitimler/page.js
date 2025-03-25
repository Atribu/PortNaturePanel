"use client";

import { useEffect, useState } from "react";

export default function EgitimPage() {
  const [trainings, setTrainings] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    department: "",
    contentUrl: "",
  });

  const fetchTrainings = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5003/api/training", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setTrainings(data);
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5003/api/training", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      setTrainings((prev) => [data.training, ...prev]);
      setForm({ title: "", description: "", department: "", contentUrl: "" });
    } else {
      alert(data.message);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5003/api/training/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setTrainings((prev) => prev.filter((t) => t._id !== id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-xl mt-8">
      <h1 className="text-2xl font-bold mb-4">🎓 Eğitim Yönetimi</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="title"
          placeholder="Eğitim Başlığı"
          value={form.title}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        >
          <option value="">Departman Seç</option>
          {[
            "İnsan Kaynakları",
            "Satış & Pazarlama",
            "Bilgi Sistemleri",
            "Kat Hizmetleri",
            "Güvenlik",
            "Teknik Servis",
            "Satınalma",
            "Muhasebe",
            "Mutfak",
            "Yiyecek & İçecek",
            "Animasyon",
            "Kalite",
            "Ön Büro",
          ].map((dep) => (
            <option key={dep}>{dep}</option>
          ))}
        </select>
        <input
          type="text"
          name="contentUrl"
          placeholder="İçerik Linki (PDF, video, vs)"
          value={form.contentUrl}
          onChange={handleChange}
          required
          className="p-2 border rounded col-span-2"
        />
        <textarea
          name="description"
          placeholder="Açıklama"
          value={form.description}
          onChange={handleChange}
          className="p-2 border rounded col-span-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 col-span-2"
        >
          Ekle
        </button>
      </form>

      <ul className="space-y-4">
        {trainings.map((t) => (
          <li
            key={t._id}
            className="border p-4 rounded flex justify-between items-start"
          >
            <div>
              <h3 className="text-lg font-semibold">{t.title}</h3>
              <p className="text-sm text-gray-600">{t.description}</p>
              <p className="text-xs text-blue-600 mt-1">{t.contentUrl}</p>
              <span className="text-xs text-white bg-blue-500 px-2 py-1 rounded inline-block mt-2">
                {t.department}
              </span>
            </div>
            <button
              onClick={() => handleDelete(t._id)}
              className="text-red-500 hover:underline text-sm"
            >
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}