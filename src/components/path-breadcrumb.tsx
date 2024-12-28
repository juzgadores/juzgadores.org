"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import v from "voca";
import { Home } from "lucide-react";

import {
  BreadcrumbSeparator,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  Breadcrumb,
} from "@/components/ui/breadcrumb";

import { cn } from "@/lib/utils";

export type BreadcrumbsContextType = {
  breadcrumbs: { href: string; label: string }[];
};

const BreadcrumbsContext = createContext<BreadcrumbsContextType>({
  breadcrumbs: [],
});

export const useBreadcrumbs = () => useContext(BreadcrumbsContext);

type AppBreadcrumbsProps = {
  listClassName?: string;
  activeClassName?: string;
  linkClassName?: string;
  className?: string;
  currentBreadcrumb?: { href: string; label: string };
};

export function PathBreadcrumb({
  listClassName,
  activeClassName,
  linkClassName,
  className,
  currentBreadcrumb,
}: Readonly<AppBreadcrumbsProps>) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbs: { href: string; label: string }[] = [];

  // Build breadcrumbs based on path
  pathSegments.forEach((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const label = v.chain(segment).titleCase().replaceAll("-", " ").value();

    // If this is the last segment and we have a custom breadcrumb, use that instead
    if (index === pathSegments.length - 1 && currentBreadcrumb) {
      breadcrumbs.push(currentBreadcrumb);
    } else {
      breadcrumbs.push({ href, label });
    }
  });

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className={listClassName}>
        {breadcrumbs.map(({ href, label }, index) => {
          const isPage = index === breadcrumbs.length - 1;
          const BreadcrumbComponent = isPage ? BreadcrumbPage : BreadcrumbLink;
          return (
            <React.Fragment key={href}>
              <BreadcrumbItem
                className={cn(listClassName, isPage && activeClassName)}
              >
                <BreadcrumbComponent
                  className={cn(!isPage && [linkClassName, "hover:underline"])}
                  href={isPage ? undefined : href}
                >
                  {index === 0 && (
                    <Home className="mr-2 inline-block size-4 pb-0.5 align-middle" />
                  )}
                  {label}
                </BreadcrumbComponent>
              </BreadcrumbItem>
              {!isPage && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
