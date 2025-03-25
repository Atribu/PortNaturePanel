"use client";

import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFields, setEditFields] = useState({ departman: "", password: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartman, setSelectedDepartman] = useState("");

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    departman: "",
    role: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5003/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUsers(data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Sunucu hatası");
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setNewUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditChange = (e) => {
    setEditFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5003/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();

      if (res.ok) {
        setUsers((prev) => [...prev, data.user]);
        setNewUser({
          name: "",
          email: "",
          password: "",
          departman: "",
          role: "",
        });
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Kullanıcı ekleme hatası:", err);
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const token = localStorage.getItem("token");
    const newRole = currentRole === "admin" ? "personel" : "admin";

    try {
      const res = await fetch(
        `http://localhost:5003/api/admin/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      console.error("Rol değiştirme hatası:", err);
    }
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:5003/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err) {
      console.error("Silme hatası:", err);
    }
  };

  const handleSaveEdit = async (userId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:5003/api/admin/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editFields),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, ...editFields } : u))
        );
        setEditingUserId(null);
        setEditFields({ departman: "", password: "" });
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditFields({ departman: "", password: "" });
  };

  const renderDepartmanOptions = () =>
    [
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
      <option key={dep} value={dep}>
        {dep}
      </option>
    ));

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          👥 Personel Listesi
        </h1>
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            ➕ Yeni Personel Ekle
          </h2>
          <form
            onSubmit={handleAddUser}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg shadow"
          >
            <input
              type="text"
              name="name"
              placeholder="İsim"
              value={newUser.name}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="E-posta"
              value={newUser.email}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Şifre"
              value={newUser.password}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            />
            <select
              name="departman"
              value={newUser.departman}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            >
              <option value="">Departman Seçin</option>
              {renderDepartmanOptions()}
            </select>
            <select
              name="role"
              value={newUser.role}
              onChange={handleChange}
              required
              className="p-2 border rounded"
            >
              <option value="">Rol Seçin</option>
              <option value="personel">Personel</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="col-span-full md:col-span-2 lg:col-span-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Kaydet
            </button>
          </form>
        </div>
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="İsim veya e-posta ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded w-full md:w-1/2"
          />

          <select
            value={selectedDepartman}
            onChange={(e) => setSelectedDepartman(e.target.value)}
            className="p-2 border rounded w-full md:w-1/3"
          >
            <option value="">Tüm Departmanlar</option>
            {renderDepartmanOptions()}
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase">
                  İsim
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase">
                  E-posta
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase">
                  Departman
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase">
                  Düzenle
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase">
                  Sil
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users
                .filter((user) => {
                  const fulltext = `${user.name} ${user.email}`.toLowerCase();
                  const searchMatch = fulltext.includes(
                    searchTerm.toLowerCase()
                  );
                  const departmanMatch =
                    selectedDepartman === "" ||
                    user.departman === selectedDepartman;
                  return searchMatch && departmanMatch;
                })
                .map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-3 text-gray-700">{user.email}</td>
                    <td className="px-6 py-3">
                      {editingUserId === user._id ? (
                        <select
                          name="departman"
                          value={editFields.departman}
                          onChange={handleEditChange}
                          className="border p-1 rounded"
                        >
                          <option value="">Seçiniz</option>
                          {renderDepartmanOptions()}
                        </select>
                      ) : (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                          {user.departman}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {editingUserId === user._id ? (
                        <div className="space-y-2">
                          <input
                            type="password"
                            name="password"
                            placeholder="Yeni şifre"
                            value={editFields.password}
                            onChange={handleEditChange}
                            className="border p-1 rounded w-full"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(user._id)}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                            >
                              Kaydet
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-500 underline text-xs"
                            >
                              İptal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingUserId(user._id);
                            setEditFields({
                              departman: user.departman,
                              password: "",
                            });
                          }}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Düzenle
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleRoleChange(user._id, user.role)}
                        className="text-indigo-600 font-medium text-sm hover:underline"
                      >
                        {user.role === "admin" ? "Personel Yap" : "Admin Yap"}
                      </button>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 font-medium text-sm hover:underline"
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
    </div>
  );
}
