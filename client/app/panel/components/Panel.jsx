"use client";

import Sidebar from "./Sidebar";

export default function Panel({ children }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="ml-64 w-full p-6 bg-gray-50">
        {children}
      </main>
    </div>
  );
}