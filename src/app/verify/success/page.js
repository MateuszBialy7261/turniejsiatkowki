import AuthLayout from "@/components/AuthLayout";

export default function VerifySuccessPage() {
  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-green-600 mb-4 text-center">
        ✅ Konto zostało aktywowane!
      </h1>
      <p className="text-gray-700 mb-6 text-sm sm:text-base text-center">
        Twoje konto zostało pomyślnie zweryfikowane. Możesz teraz się zalogować.
      </p>
      <a
        href="/login"
        className="block w-full sm:w-auto mx-auto bg-blue-300 hover:bg-blue-400 text-white font-medium py-2 px-6 rounded transition cursor-pointer text-center"
      >
        Przejdź do logowania
      </a>
    </AuthLayout>
  );
}
