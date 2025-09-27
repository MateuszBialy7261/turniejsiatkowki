"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ActivatedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");

  useEffect(() => {
    if (status === "success") {
      // przekierowanie po 5 sekundach
      const timer = setTimeout(() => {
        router.push("/login");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg text-center">
        {status === "success" ? (
          <>
            <p className="text-green-600 font-semibold text-lg">
              ✅ Twoje konto zostało aktywowane! Możesz się teraz zalogować.
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Za chwilę zostaniesz przekierowany do logowania...
            </p>
          </>
        ) : (
          <p className="text-red-600 font-semibold text-lg">
            ❌ Link aktywacyjny jest nieprawidłowy lub wygasł.
          </p>
        )}
      </div>
    </div>
  );
}
