"use client";

import React, { ReactNode } from "react";
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

type AppBreadcrumbsProps = {
  separator?: ReactNode;
  listClassName?: string;
  activeClassName?: string;
  linkClassName?: string;
  className?: string;
};

export function AppBreadcrumbs({
  separator = "/",
  listClassName,
  activeClassName,
  linkClassName,
  className,
}: Readonly<AppBreadcrumbsProps>) {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList
        className={cn(
          "rounded-lg border border-border bg-background px-3 py-2 shadow-sm shadow-black/5",
          listClassName,
        )}
      >
        {pathNames.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join("/")}`;
          const label = v.chain(link).titleCase().replaceAll("-", " ").value();
          const isActive = paths === href;
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem
                className={cn(listClassName, isActive && activeClassName)}
              >
                <BreadcrumbPage>
                  <Link
                    className={cn(
                      "hover:underline",
                      linkClassName,
                      isActive && "text-muted-foreground",
                    )}
                    href={href}
                  >
                    {label}
                  </Link>
                </BreadcrumbPage>
              </BreadcrumbItem>
              {index < pathNames.length - 1 && (
                <span aria-hidden="true" className="mx-2 text-muted-foreground">
                  {separator}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
