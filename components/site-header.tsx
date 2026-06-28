"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { uiText } from "@/lib/uiText";
import { cn } from "@/lib/utils";
import { SiteHeaderActions } from "@/components/site-header-actions";

export function SiteHeader({
  language = "English",
  leftContent,
  title,
  rightContent,
  libraryHref,
  libraryLabel,
  askLabel,
  className,
  sticky = false,
  maxWidthClassName = "max-w-7xl",
}: {
  language?: string;
  leftContent?: React.ReactNode;
  title?: React.ReactNode;
  rightContent?: React.ReactNode;
  libraryHref?: string;
  libraryLabel?: string;
  askLabel?: string;
  className?: string;
  sticky?: boolean;
  maxWidthClassName?: string;
}) {
  const text = uiText[language] ?? uiText.English;
  const actions =
    libraryHref && libraryLabel ? (
      <SiteHeaderActions libraryHref={libraryHref} libraryLabel={libraryLabel} askLabel={askLabel} />
    ) : (
      rightContent
    );

  return (
    <header
      className={cn(
        sticky ? "sticky top-0 z-30 px-3 pt-3 sm:px-5 sm:pt-4" : "relative z-10 px-4 pt-5 sm:px-6 lg:px-8",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between gap-3 rounded-lg border border-border bg-background/80 px-4 py-3 backdrop-blur-sm md:px-5",
          maxWidthClassName
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          {leftContent ? <div className="flex shrink-0 items-center gap-2">{leftContent}</div> : null}
          <Link href="/" className="flex min-w-0 items-center gap-3 text-sm text-foreground">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
              <BookOpen className="h-4 w-4" />
            </span>
            <span className="truncate text-base font-semibold leading-none">{text.holyBibleReader}</span>
          </Link>
          {title ? <div className="hidden h-6 w-px bg-border/60 md:block" /> : null}
          {title ? <div className="hidden min-w-0 md:block">{title}</div> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
