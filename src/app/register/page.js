"use client";
import { useState } from "react";

export default function Page() {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    clubName: "",
    nip: "",
    address: "",
    license: false,
    helperAnswer: "",
    rodo: false,
  });

  // Obsługa zmiany pól formularza
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Walidacja numeru telefonu w formacie 123-456-789
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3 && value.length <= 6) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    } else if (value.length > 6) {
      value =
        value.slice(0, 3) +
        "-" +
        value.slice(3, 6) +
        "-" +
        value.slice(6, 9);
    }
    setFormData({ ...formData, phone: value });
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.rodo) {
      alert("Musisz wyrazić zgodę na przetwarzanie danych osobowych.");
      return;
    }
    console.log("Dane do rejestracji:", formData);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4">Rejestracja</h2>

        {/* Imię */}
        <label className="block">
          <span className="text-gray-700">Imię</span>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-300 focus:border-blue-300"
            required
          />
        </label>

        {/* Nazwisko */}
        <label className="block">
          <span className="text-gray-700">Nazwisko</span>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-300 focus:border-blue-300"
            required
          />
        </label>

        {/* Rola */}
        <label className="block">
          <span className="text-gray-700">Rola</span>
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-300 focus:border-blue-300"
            required
          >
            <option value="">Wybierz rolę</option>
            <option value="sedzia">Sędzia</option>
            <option value="organizator">Organizator</option>
          </select>
        </label>

        {/* Pola dla sędziego */}
        {role === "sedzia" && (
          <>
            <label className="block">
              <span className="text-gray-700">Adres e-mail</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-300 focus:border-blue-300"
                required
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Numer telefonu</span>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                maxLength={11}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-300 focus:border-blue-300"
                placeholder="123-456-789"
                required
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Wiek</span>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-300 focus:border-blue-300"
                required
              />
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="license"
                checked={formData.license}
                onChange={handleChange}
                className="h-5 w-5 text-blue-400 border-gray-300 rounded focus:ring-blue-300 cursor-pointer"
              />
              <span>Czy posiadasz licencję sędziego?</span>
            </label>
          </>
        )}

        {/* Pola dla organizatora */}
        {role === "organizator" && (
          <>
            <label className="block">
              <span className="text-gray-700">Pełna nazwa klubu</span>
              <input
                type="text"
                name="clubName"
                value={formData.clubName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-300 focus:border-blue-300"
                required
              />
            </label>

            <label className="block">
              <span className="text-gray-700">NIP</span>
              <input
                type="text"
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-300 focus:border-blue-300"
                required
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Adres</span>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-300 focus:border-blue-300"
                required
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Numer telefonu</span>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                maxLength={11}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-300 focus:border-blue-300"
                placeholder="123-456-789"
                required
              />
            </label>

            <label className="block">
              <span className="text-gray-700">Adres e-mail</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-300 focus:border-blue-300"
                required
              />
            </label>
          </>
        )}

        {/* Pytanie pomocnicze */}
        <label className="block">
          <span className="text-gray-700 font-semibold">
            Pytanie pomocnicze: Ile to jest 2 + 3?
          </span>
          <input
            type="text"
            name="helperAnswer"
            value={formData.helperAnswer}
            onChange={handleChange}
            placeholder="Twoja odpowiedź"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-300 focus:border-blue-300"
            required
          />
        </label>

        {/* Checkbox RODO */}
        <label className="flex items-start space-x-2">
          <input
            type="checkbox"
            name="rodo"
            checked={formData.rodo}
            onChange={handleChange}
            className="h-5 w-5 text-blue-400 border-gray-300 rounded focus:ring-blue-300 cursor-pointer mt-1"
            required
          />
          <span className="text-xs text-gray-600">
            Wyrażam zgodę na przetwarzanie moich danych osobowych przez{" "}
            <strong>Smart Web Solutions Mateusz Biały</strong> (właściciel aplikacji) 
            w celach utworzenia konta i realizacji zadań turniejowych. 
            W razie wątpliwości prosimy o{" "}
            <a href="/kontakt" className="text-blue-500 hover:underline">kontakt</a>.
          </span>
        </label>

        {/* Przycisk */}
        <button
          type="submit"
          className="w-full bg-blue-300 text-white py-2 rounded hover:bg-blue-400 transition cursor-pointer"
        >
          Zarejestruj się
        </button>

        <p className="text-sm text-center mt-4">
          Masz już konto?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Zaloguj się tutaj
          </a>
        </p>
      </form>
    </div>
  );
}
