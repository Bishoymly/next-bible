import type { Metadata } from "next";
import Link from "next/link";
import { ScriptureSearch } from "@/components/scripture-search";
import { UtilityHeader } from "@/components/utility-header";

export const metadata: Metadata = { title: "Guided Study", description: "Local, source-backed Scripture study and search.", alternates: { canonical: "/study" } };
export default function StudyPage() { return <><UtilityHeader /><main className="min-h-screen px-4 py-8 sm:px-6"><div className="mx-auto max-w-4xl"><p className="text-sm font-medium text-muted-foreground">GUIDED STUDY</p><h1 className="mt-2 text-3xl font-semibold">Study a passage with care</h1><p className="mt-3 max-w-2xl text-muted-foreground">Choose a chapter to read, then use its guided observations and reflection questions. Published study pages remain available below.</p><div className="mt-5 flex flex-wrap gap-3"><Link className="rounded-md bg-primary px-4 py-2 text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2" href="/bsb/genesis/1">Read Genesis 1</Link><Link className="rounded-md border border-border px-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-2" href="/topics">Browse topics</Link></div><h2 className="mt-10 text-xl font-semibold">Find a passage</h2><div className="mt-3"><ScriptureSearch /></div></div></main></>; }
