"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";

// Ikona markera (domyślnie leaflet nie ładuje swojej)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ setCoords }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setCoords(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={markerIcon}></Marker>
  );
}

export default function MapPicker({ location, setLocation, setCoords }) {
  const [position, setPosition] = useState([52.2297, 21.0122]); // Warszawa jako start
  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 wyszukiwanie adresu (geokodowanie przez darmowe Nominatim API)
  const searchAddress = async (e) => {
    e.preventDefault();
    if (!location.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          location
        )}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const newPos = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPos);
        setMarker(newPos);
        setCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
      }
    } catch (err) {
      console.error("Błąd pobierania lokalizacji:", err);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={searchAddress} className="flex gap-2">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Wpisz adres lub nazwę miasta (np. Hala, Kraków)"
          className="border rounded-lg flex-grow p-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 rounded-lg transition"
          disabled={loading}
        >
          {loading ? "⏳" : "Szukaj"}
        </button>
      </form>

      <MapContainer
        center={position}
        zoom={marker ? 14 : 6}
        scrollWheelZoom={true}
        className="w-full h-[300px] rounded-xl shadow-md border"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {marker && <Marker position={marker} icon={markerIcon} />}
        <LocationMarker setCoords={setCoords} />
      </MapContainer>

      <p className="text-sm text-gray-500">
        🔹 Wpisz adres i kliknij „Szukaj” lub wybierz miejsce klikając na mapie.
      </p>
    </div>
  );
}
