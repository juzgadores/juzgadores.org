import { redirect } from "next/navigation";
import Image from "next/image";

import GradualSpacing from "@/components/ui/gradual-spacing";

import { standbyFlag } from "@/lib/flags";

export default async function HomePage() {
  const landingStandby = await standbyFlag();

  if (!landingStandby) {
    return redirect("/aspirantes");
  }

  return (
    <>
      <GradualSpacing
        className="text-center text-3xl font-bold text-teal-800"
        text="juzgadores.org"
      />
      <Image
        width={90}
        src="/logo.png"
        className="mx-auto opacity-80 hue-rotate-60 saturate-150 dark:invert"
        alt="Juzgadores.org logo"
        height={19}
        priority
      />
    </>
  );
}
