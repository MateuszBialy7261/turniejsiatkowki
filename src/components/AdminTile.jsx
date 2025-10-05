"use client";

export default function AdminTile({ href, icon, title, desc }) {
  return (
    <a
      href={href}
      className="block bg-white rounded-2xl shadow-md p-6 text-center hover:bg-blue-50 hover:scale-[1.02] transition-transform duration-300"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-xl font-semibold">{title}</div>
      {desc && <p className="text-gray-600 mt-1 text-sm">{desc}</p>}
    </a>
  );
}
