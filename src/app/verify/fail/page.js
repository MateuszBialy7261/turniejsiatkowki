import AuthLayout from "@/components/AuthLayout";

export default function VerifyFailPage() {
  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-red-600 mb-4 text-center">
        ❌ Błąd weryfikacji
      </h1>
      <p className="text-gray-700 mb-6 text-sm sm:text-base text-center">
        Token weryfikacyjny jest nieprawidłowy lub konto zostało już aktywowane.
      </p>
      <a
        href="/register"
        className="block w-full sm:w-auto mx-auto bg-blue-300 hover:bg-blue-400 text-white font-medium py-2 px-6 rounded transition cursor-pointer text-center"
      >
        Spróbuj ponownie zarejestrować się
      </a>
    </AuthLayout>
  );
}
