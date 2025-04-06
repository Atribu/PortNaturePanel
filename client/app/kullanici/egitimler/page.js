"use client";
import PersonelSidebar from "../components/PersonelSidebar";
import PersonelEgitimList from "./components/PersonelEgitimList";

export default function EgitimPage() {
  return (
    <div className="flex min-h-screen">
      <PersonelSidebar />
      <main className="flex-1 p-6 bg-gray-50">
        <PersonelEgitimList />
      </main>
    </div>
  );
}