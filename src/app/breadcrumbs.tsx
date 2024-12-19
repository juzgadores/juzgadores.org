"use client";

import { useSelectedLayoutSegments } from "next/navigation";

import {
  Breadcrumbs as BreadcrumbsRoot,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumbs";

export function Breadcrumbs() {
  const segments = useSelectedLayoutSegments();

  return (
    <BreadcrumbsRoot>
      <h1>Breadcrumbs</h1>
      {segments.map((segment, index) => (
        <BreadcrumbItem key={index}>
          {/* <li key={index}>{segment}</li> */}
          <BreadcrumbLink href="">{segment}</BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
      ))}
    </BreadcrumbsRoot>
  );
}

{
  /* <BreadcrumbItem>
        <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
        <BreadcrumbSeparator />
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbPage>Breadcrumbs</BreadcrumbPage>
      </BreadcrumbItem> */
}

// import { usePathname } from "next/navigation";
// import Link from "next/link";

// import { LuChevronRight } from "react-icons/lu";

// import { cn } from "@/lib/utils";

// type BreadcrumbItem = {
//   href: string;
//   label: string;
// };

// function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
//   const paths = pathname.split("/").filter(Boolean);
//   return paths.map((path, index) => {
//     const href = `/${paths.slice(0, index + 1).join("/")}`;
//     const label = path.charAt(0).toUpperCase() + path.slice(1);
//     return { href, label };
//   });
// }

// export function Breadcrumbs({ className }: Readonly<{ className?: string }>) {
//   const pathname = usePathname();
//   const breadcrumbs = generateBreadcrumbs(pathname);

//   if (breadcrumbs.length === 0) return null;

//   return (
//     <nav
//       className={cn("flex items-center gap-2 text-sm", className)}
//       aria-label="Breadcrumbs"
//     >
//       <Link
//         className="text-muted-foreground transition-colors hover:text-foreground"
//         href="/"
//       >
//         Inicio
//       </Link>
//       {breadcrumbs.map((item, index) => (
//         <BreadcrumbItem
//           key={item.href}
//           {...item}
//           isLast={index === breadcrumbs.length - 1}
//         />
//       ))}
//     </nav>
//   );
// }

// function BreadcrumbItem({
//   href,
//   label,
//   isLast,
// }: Readonly<BreadcrumbItem & { isLast: boolean }>) {
//   return (
//     <>
//       <LuChevronRight className="size-4 text-muted-foreground" />
//       <Link
//         className={cn(
//           "transition-colors",
//           isLast
//             ? "font-medium text-foreground"
//             : "text-muted-foreground hover:text-foreground",
//         )}
//         aria-current={isLast ? "page" : undefined}
//         href={href}
//       >
//         {label}
//       </Link>
//     </>
//   );
// }
