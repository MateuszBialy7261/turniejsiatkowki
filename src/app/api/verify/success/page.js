export default function VerifySuccessPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          ✅ Konto zostało aktywowane!
        </h1>
        <p className="text-gray-700 mb-6 text-sm sm:text-base">
          Twoje konto zostało pomyślnie zweryfikowane. Możesz teraz się zalogować.
        </p>
        <a
          href="/login"
          className="inline-block w-full sm:w-auto bg-blue-300 hover:bg-blue-400 text-white font-medium py-2 px-6 rounded transition cursor-pointer"
        >
          Przejdź do logowania
        </a>
      </div>
    </div>
  );
}
