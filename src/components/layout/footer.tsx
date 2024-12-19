import Link from "next/link";

import { LucideMail } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { contactEmailFlag } from "@/lib/flags";

interface FooterProps {
  className?: string;
}

export async function Footer({ className }: Readonly<FooterProps>) {
  const contactEmail = (await contactEmailFlag())?.toString();

  return (
    <footer
      className={cn(
        "fixed bottom-0 right-0 flex items-center justify-end w-screen",
        className,
      )}
    >
      {contactEmail && (
        <Button
          className="rounded-none bg-background p-2 hover:ring-1 hover:ring-muted"
          variant="link"
        >
          <Link
            className="flex items-center gap-2 text-xs font-semibold tracking-wider opacity-70 hover:opacity-100"
            href={`mailto:${contactEmail}`}
          >
            <LucideMail className="size-4" />
            {contactEmail}
          </Link>
        </Button>
      )}
    </footer>
  );
}
