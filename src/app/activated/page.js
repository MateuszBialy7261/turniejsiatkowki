"use client";

import { Suspense } from "react";
import ActivatedContent from "./ActivatedContent";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Ładowanie...</p>}>
      <ActivatedContent />
    </Suspense>
  );
}
