import GradualSpacing from "@/components/ui/gradual-spacing";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <GradualSpacing
          text="juzgadores.org"
          className="text-3xl text-teal-800 text-center font-bold"
        />
        <Image
          src="/logo.png"
          alt="Juzgadores.org logo"
          width={180}
          height={38}
          priority
          className="dark:invert hue-rotate-60 saturate-150 mx-auto"
        />
      </main>
    </div>
  );
}
