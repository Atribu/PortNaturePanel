"use client";

import { useEffect, useState } from "react";
import { FileText, FileVideo, FileSpreadsheet, File } from "lucide-react";

export default function EgitimPage() {
  const [trainings, setTrainings] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    department: "",
    contentFile: null,
  });
  const [editingId, setEditingId] = useState(null);

  const fetchTrainings = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5003/api/training", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTrainings(data);
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    const url = editingId
      ? `http://localhost:5003/api/training/${editingId}`
      : "http://localhost:5003/api/training";

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      fetchTrainings();
      setForm({ title: "", description: "", department: "", contentFile: null });
      setEditingId(null);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
  
    const res = await fetch(`http://localhost:5003/api/training/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  
    if (res.ok) fetchTrainings();
  };

  const getFileIcon = (url) => {
    if (url.match(/\.(pdf)$/)) return <FileText className="w-5 h-5" />;
    if (url.match(/\.(mp4|mov|avi)$/)) return <FileVideo className="w-5 h-5" />;
    if (url.match(/\.(xls|xlsx|csv)$/)) return <FileSpreadsheet className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-6">🎓 Eğitim Yönetimi</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 mb-8">
        <input
          type="text"
          name="title"
          placeholder="Eğitim Başlığı"
          value={form.title}
          onChange={handleChange}
          required
          className="p-3 border rounded-xl"
        />
        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          required
          className="p-3 border rounded-xl"
        >
          <option value="">Departman Seç</option>
          {["İnsan Kaynakları", "Satış & Pazarlama", "Bilgi Sistemleri", "Kat Hizmetleri", "Güvenlik", "Teknik Servis", "Satınalma", "Muhasebe", "Mutfak", "Yiyecek & İçecek", "Animasyon", "Kalite", "Ön Büro"].map((dep) => (
            <option key={dep}>{dep}</option>
          ))}
        </select>
        <input
          type="file"
          name="contentFile"
          onChange={handleChange}
          className="p-3 border rounded-xl col-span-2"
        />
        <textarea
          name="description"
          placeholder="Açıklama"
          value={form.description}
          onChange={handleChange}
          className="p-3 border rounded-xl col-span-2"
        />
        <button
          type="submit"
          className={`${editingId ? "bg-green-500" : "bg-blue-500"} col-span-2 text-white py-2 px-4 rounded-xl hover:shadow-xl`}
        >
          {editingId ? "Güncelle" : "Ekle"}
        </button>
      </form>

      <div className="space-y-4">
        {trainings.map((t) => (
          <div key={t._id} className="border p-5 rounded-xl flex justify-between items-start hover:shadow-md transition-shadow">
            <div>
              <h3 className="text-xl font-semibold mb-2">{t.title}</h3>
              <p className="text-gray-600 mb-2">{t.description}</p>
              <a href={`http://localhost:5003/${t.contentUrl}`} target="_blank" className="text-blue-600 underline flex gap-2 items-center">
                {getFileIcon(t.contentUrl)} İçerik Görüntüle
              </a>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block mt-3">{t.department}</span>
            </div>
            <button onClick={() => handleDelete(t._id)} className="text-red-500 hover:underline">
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}