export default function PersonelHome() {
  const user = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">👋 Merhaba {user?.name || "Personel"}</h1>
      <p className="text-gray-600">
        Bu sayfada eğitimlerinizi, profil bilgilerinizi ve belgelerinizi takip edebilirsiniz.
      </p>
    </div>
  );
}