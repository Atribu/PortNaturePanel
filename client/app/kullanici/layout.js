import PersonelSidebar from "./components/PersonelSidebar.jsx";

export default function KullaniciLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <PersonelSidebar />
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}