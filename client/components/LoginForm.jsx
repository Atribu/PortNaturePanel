"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ✅ Türkçe karakterleri temizleyip slug oluşturan fonksiyon
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-") // boşluk ve özel karakterleri tireye çevir
    .replace(/^-+|-+$/g, "");    // baştaki ve sondaki tireleri temizle
}

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);

  const router = useRouter();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5003/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Giriş başarılı!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        const role = data.user.role;

setTimeout(() => {
  if (role === "admin") {
    router.push("/panel");
  } else {
    router.push("/kullanici");
  }
}, 1000);
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      setMessage("Sunucu hatası");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Giriş Yap</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Giriş Yap
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}