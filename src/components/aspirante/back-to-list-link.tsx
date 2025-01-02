"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export function BackToListLink() {
  const router = useRouter();
  const pathname = usePathname();
  const [showLink, setShowLink] = useState(false);

  useEffect(() => {
    // Check if we came from the search page
    const referrer = document.referrer;
    const isFromSearch =
      referrer.includes("/aspirantes") && !referrer.includes(pathname);

    setShowLink(isFromSearch);
  }, [pathname]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  if (!showLink) {
    return null;
  }

  return (
    <Button
      className="-ml-2 mb-4 h-8 px-2 text-muted-foreground"
      variant="ghost"
      onClick={handleBack}
    >
      <ArrowLeft className="mr-1" />
      Volver al listado
    </Button>
  );
}
