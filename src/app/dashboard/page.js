"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function redirectUser() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();

        if (!data?.loggedIn) {
          router.push("/login");
          return;
        }

        switch (data.role) {
          case "admin":
            router.push("/dashboard/admin");
            break;
          case "organizator":
            router.push("/dashboard/organizator");
            break;
          case "sedzia":
            router.push("/dashboard/sedzia");
            break;
          default:
            router.push("/login");
        }
      } catch {
        router.push("/login");
      }
    }

    redirectUser();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen text-gray-600">
      Przekierowywanie do panelu...
    </div>
  );
}
