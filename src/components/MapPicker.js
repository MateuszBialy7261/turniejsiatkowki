"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function MapPicker({ location, setLocation, setCoords }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [query, setQuery] = useState(location || "");

  useEffect(() => {
    if (!mapRef.current) {
      const initialMap = L.map("map", {
        center: [52.2297, 21.0122], // Warszawa domyślnie
        zoom: 6,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(initialMap);

      const marker = L.marker([52.2297, 21.0122], { draggable: true }).addTo(
        initialMap
      );

      marker.on("dragend", () => {
        const { lat, lng } = marker.getLatLng();
        setCoords({ lat, lng });
      });

      setMap(initialMap);
      mapRef.current = initialMap;
      markerRef.current = marker;
    }
  }, [setCoords]);

  // 🔹 Funkcja wyszukiwania lokalizacji (bez przeładowania strony)
  const handleSearch = async (e) => {
    e.preventDefault(); // ⛔️ blokuje przeładowanie
    if (!query.trim()) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setLocation(display_name);
        setCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });

        map.setView([lat, lon], 13);
        markerRef.current.setLatLng([lat, lon]);
      } else {
        alert("Nie znaleziono lokalizacji 😕");
      }
    } catch {
      alert("Błąd podczas wyszukiwania lokalizacji");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Wyszukiwarka */}
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 flex-wrap"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Wpisz miasto lub adres..."
          className="border rounded-lg p-3 flex-1 min-w-[200px] focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
        >
          Szukaj
        </button>
      </form>

      {/* Mapa */}
      <div
        id="map"
        className="w-full h-72 rounded-xl border border-gray-200 shadow-inner"
      ></div>

      {location && (
        <p className="text-sm text-gray-600 italic mt-1">
          📍 Wybrano: <span className="font-medium">{location}</span>
        </p>
      )}
    </div>
  );
}
