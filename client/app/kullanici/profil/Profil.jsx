"use client";
import { useEffect, useState } from "react";

export default function Profil() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return <p>Kullanıcı bilgileri yükleniyor...</p>;

  return (
    <div className="space-y-4 text-sm text-gray-800">
      <div>
        <span className="font-semibold">👤 İsim:</span> {user.name}
      </div>
      <div>
        <span className="font-semibold">📧 E-posta:</span> {user.email}
      </div>
      <div>
        <span className="font-semibold">🏢 Departman:</span> {user.departman}
      </div>
      <div>
        <span className="font-semibold">🎭 Rol:</span>{" "}
        <span className={`inline-block px-2 py-1 text-xs rounded-full 
          ${user.role === "admin" ? "bg-green-200 text-green-800" : "bg-blue-200 text-blue-800"}`}>
          {user.role}
        </span>
      </div>
    </div>
  );
}