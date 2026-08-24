import type { Metadata } from "next";
import { ScriptureSearch } from "@/components/scripture-search";
import { ReaderPage } from "@/components/reader-page";

export const metadata: Metadata = { title: "Search Scripture", description: "Search a translation locally in your browser.", alternates: { canonical: "/search" } };
export default function SearchPage() {
  return (
    <ReaderPage
      title="Search Scripture"
      description="Find words and phrases across a translation. Search happens privately in your browser."
    >
      <ScriptureSearch />
    </ReaderPage>
  );
}
