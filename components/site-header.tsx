"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { uiText } from "@/lib/uiText";
import { cn } from "@/lib/utils";

export function SiteHeader({
  language = "English",
  leftContent,
  title,
  rightContent,
  className,
  sticky = false,
  maxWidthClassName = "max-w-7xl",
}: {
  language?: string;
  leftContent?: React.ReactNode;
  title?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
  sticky?: boolean;
  maxWidthClassName?: string;
}) {
  const text = uiText[language] ?? uiText.English;

  return (
    <header
      className={cn(
        sticky ? "sticky top-0 z-30 px-3 pt-3 sm:px-5 sm:pt-4" : "relative z-10 px-4 pt-5 sm:px-6 lg:px-8",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between gap-3 rounded-full border border-[rgba(200,150,58,0.18)] bg-background/72 px-4 py-3 backdrop-blur md:px-6",
          maxWidthClassName
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          {leftContent ? <div className="flex shrink-0 items-center gap-2">{leftContent}</div> : null}
          <Link href="/" className="flex min-w-0 items-center gap-3 text-sm text-foreground">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(200,150,58,0.28)] bg-[rgba(200,150,58,0.08)] text-accent">
              <BookOpen className="h-4 w-4" />
            </span>
            <span className="truncate font-display text-2xl leading-none text-foreground">{text.holyBibleReader}</span>
          </Link>
          {title ? <div className="hidden h-6 w-px bg-border/60 md:block" /> : null}
          {title ? <div className="hidden min-w-0 md:block">{title}</div> : null}
        </div>
        {rightContent ? <div className="flex shrink-0 items-center gap-2">{rightContent}</div> : null}
      </div>
    </header>
  );
}
