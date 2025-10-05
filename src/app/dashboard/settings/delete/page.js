"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteAccountPage() {
  const [msg, setMsg] = useState(null);
  const [confirm, setConfirm] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm !== "USUŃ") {
      setMsg({ type: "error", text: "❌ Wpisz USUŃ, aby potwierdzić" });
      return;
    }

    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg({ type: "success", text: "✅ Konto zostało usunięte" });
      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      setMsg({ type: "error", text: "❌ " + err.message });
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-red-600">🗑️ Usuń konto</h1>

      <p className="text-gray-700 mb-4">
        Tej operacji <b>nie można cofnąć</b>. Wszystkie dane zostaną trwale usunięte z bazy.
      </p>

      {msg && (
        <div
          className={`p-3 rounded mb-4 ${
            msg.type === "success" ? "bg-[#d4edf8] text-black" : "bg-red-100 text-red-800"
          }`}
        >
          {msg.text}
        </div>
      )}

      <label className="block mb-4">
        <span className="text-gray-700">Wpisz <b>USUŃ</b>, aby potwierdzić:</span>
        <input
          type="text"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="mt-1 block w-full border rounded-md p-2"
        />
      </label>

      <button
        onClick={handleDelete}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold"
      >
        Usuń konto
      </button>
    </main>
  );
}
