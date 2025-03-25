"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "", departman: "", });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5003/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Kayıt başarılı!");
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      setMessage("Sunucu hatası");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Kayıt Ol</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="İsim"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="E-posta"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Şifre"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />

         <select
            name="departman"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          >
            <option value="">Departman Seçin</option>
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Kayıt Ol
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}