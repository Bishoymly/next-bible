import type { Metadata } from "next";
import { ScriptureSearch } from "@/components/scripture-search";
import { UtilityHeader } from "@/components/utility-header";

export const metadata: Metadata = { title: "Search Scripture", description: "Search a translation locally in your browser.", alternates: { canonical: "/search" } };
export default function SearchPage() { return <><UtilityHeader /><main className="min-h-screen px-4 py-8 sm:px-6"><div className="mx-auto max-w-4xl pb-6"><h1 className="text-3xl font-semibold">Search Scripture</h1><p className="mt-2 text-muted-foreground">Search runs on a downloaded translation index in your browser. Nothing is sent to a server.</p></div><ScriptureSearch /></main></>; }
