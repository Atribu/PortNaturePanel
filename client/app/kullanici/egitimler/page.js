"use client";
import Egitimlerim from "../egitimler/Egitimlerim.jsx";
import PersonelSidebar from "../components/PersonelSidebar.jsx";

export default function EgitimPage() {
  return (
    <div className="flex min-h-screen">
      <PersonelSidebar />
      <main className="flex-1 p-6 bg-gray-50">
        <Egitimlerim />
      </main>
    </div>
  );
}