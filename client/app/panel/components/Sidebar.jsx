"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-100 shadow-md z-50 p-6">
      <h2 className="text-2xl font-bold mb-8">Yönetim Paneli</h2>
      <ul className="space-y-4 text-sm">
        <li>
          <Link href="/panel" className="text-blue-600 hover:underline">👥 Personeller</Link>
        </li>
        <li>
          <Link href="/panel/dashboard" className="text-blue-600 hover:underline">📊 Dashboard</Link>
        </li>
        <li>
          <Link href="/panel/egitimler" className="text-blue-600 hover:underline">
            🎓 Eğitimler
          </Link>
        </li>
        <li>
          <Link href="/panel/ayarlar" className="text-blue-600 hover:underline">⚙️ Ayarlar</Link>
        </li>
      </ul>
    </aside>
  );
}