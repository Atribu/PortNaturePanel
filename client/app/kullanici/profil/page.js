"use client";
import Profil from "./Profil";

export default function ProfilPage() {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-4">👤 Profil Bilgilerim</h1>
      <Profil />
    </div>
  );
}