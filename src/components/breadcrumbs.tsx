"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import v from "voca";
import { Home } from "lucide-react";

import {
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  Breadcrumb,
} from "@/components/ui/breadcrumb";

import { cn } from "@/lib/utils";

type TBreadCrumbProps = {
  separator?: ReactNode;
  listClassName?: string;
  activeClassName?: string;
  linkClassName?: string;
  className?: string;
};

const NextBreadcrumb = ({
  separator = <BreadcrumbSeparator />,
  listClassName,
  activeClassName,
  linkClassName,
  className,
}: TBreadCrumbProps) => {
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
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <Home aria-hidden="true" strokeWidth={2} size={16} />
            <span className="sr-only">Inicio</span>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathNames.length > 0 && separator}

        {pathNames.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join("/")}`;
          const label = v.chain(link).titleCase().replaceAll("-", " ").value();
          const isActive = paths === href;
          return (
            <BreadcrumbItem
              key={index}
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

              {pathNames.length !== index + 1 && separator}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default NextBreadcrumb;
