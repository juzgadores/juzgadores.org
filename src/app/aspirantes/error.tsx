"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">
        Parámetros de búsqueda inválidos
      </h2>

      <p className="text-muted-foreground">
        Por favor, ajusta los filtros e intenta de nuevo.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => router.push("/aspirantes")}>
          Listado completo
        </Button>

        <Button variant="outline" onClick={() => reset()}>
          Intentar de nuevo
        </Button>
      </div>
    </div>
  );
}
