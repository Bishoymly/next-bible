"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
const links = [["/", "Home"], ["/search", "Search"], ["/study", "Study"], ["/library", "Saved"], ["/translations", "Translations"]] as const;
export function UtilityHeader() { const pathname = usePathname(); return <header className="border-b border-border px-4 py-3 sm:px-6"><nav aria-label="Utility" className="mx-auto flex max-w-4xl items-start gap-2"><div className="flex min-w-0 flex-1 flex-wrap gap-x-1 gap-y-2">{links.map(([href, label]) => { const current = href === "/" ? pathname === href : pathname.startsWith(href); return <Link key={href} href={href} aria-current={current ? "page" : undefined} className={`rounded-md px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 ${current ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{label}</Link>; })}</div><div className="shrink-0"><ThemeToggle /></div></nav></header>; }
