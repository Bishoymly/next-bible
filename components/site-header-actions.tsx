"use client";

import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeaderActions({
  libraryHref,
  libraryLabel,
  askLabel,
}: {
  libraryHref: string;
  libraryLabel: string;
  askLabel?: string;
}) {
  return (
    <>
      <Link
        href={libraryHref}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden md:inline-flex")}
      >
        {libraryLabel}
      </Link>
      {askLabel ? (
        <Link
          href="https://ask.holybiblereader.com"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden md:inline-flex")}
        >
          {askLabel}
        </Link>
      ) : null}
      <ThemeToggle />
    </>
  );
}
