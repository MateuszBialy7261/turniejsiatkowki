"use client";



import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";


// 🧩 Naprawa problemu z brakiem ikony pinu w Leaflet (Next.js + Vercel)
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});
import L from "leaflet";

// 🧩 WAŻNE: komponent działa wyłącznie po stronie klienta
export default function MapPicker({ location, setLocation, setCoords }) {
  const mapContainerRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const [query, setQuery] = useState(location || "");
  const [isClient, setIsClient] = useState(false);

  // Upewniamy się, że komponent działa dopiero po stronie klienta
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current || mapInstance.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [52.2297, 21.0122], // Warszawa
      zoom: 6,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const marker = L.marker([52.2297, 21.0122], { draggable: true }).addTo(map);

    marker.on("dragend", () => {
      const { lat, lng } = marker.getLatLng();
      setCoords({ lat, lng });
    });

    mapInstance.current = map;
    markerInstance.current = marker;
  }, [isClient, setCoords]);

  const handleSearch = async (e) => {
    // ⛔️ blokujemy przeładowanie strony
    e.preventDefault();
    e.stopPropagation();

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

        if (mapInstance.current && markerInstance.current) {
          mapInstance.current.setView([lat, lon], 13);
          markerInstance.current.setLatLng([lat, lon]);
        }
      } else {
        alert("Nie znaleziono lokalizacji 😕");
      }
    } catch (error) {
      console.error(error);
      alert("Błąd podczas wyszukiwania lokalizacji");
    }
  };

  if (!isClient) {
    // Podczas SSR nie renderujemy niczego
    return (
      <div className="text-gray-500 italic text-sm">
        Wczytywanie mapy...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
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
          onClick={(e) => {
            e.preventDefault();
            handleSearch(e);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
        >
          Szukaj
        </button>
      </form>

      <div
        ref={mapContainerRef}
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
