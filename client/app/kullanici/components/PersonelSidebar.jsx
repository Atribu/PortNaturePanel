"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PersonelSidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login"); // veya giriş sayfan neresiyse
  };

  return (
    <aside className="w-64 h-screen bg-gray-100 shadow-md fixed top-0 left-0 p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">📋 Personel Paneli</h2>
        <ul className="space-y-4 text-sm">
          <li>
            <Link href="/kullanici" className="text-blue-600 hover:underline">🏠 Anasayfa</Link>
          </li>
          <li>
            <Link href="/kullanici/egitimler" className="text-blue-600 hover:underline">🎓 Eğitimlerim</Link>
          </li>
          <li>
            <Link href="/kullanici/profil" className="text-blue-600 hover:underline">👤 Profilim</Link>
          </li>
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded"
      >
        🚪 Çıkış Yap
      </button>
    </aside>
  );
}