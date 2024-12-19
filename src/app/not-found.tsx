import Link from "next/link";

import { LuSearch, LuHouse } from "react-icons/lu";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-40px)] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
      <h2 className="mb-4 text-2xl font-semibold">Página no encontrada</h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        La página solicitada no existe. Es posible que haya sido eliminada o
        bien el enlace que seguiste es incorrecto.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild>
          <Link className="flex items-center gap-2" href="/">
            <LuHouse className="size-4" />
            Volver al inicio
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link className="flex items-center gap-2" href="/aspirantes">
            <LuSearch className="size-4" />
            Buscar aspirantes
          </Link>
        </Button>
      </div>
    </div>
  );
}
