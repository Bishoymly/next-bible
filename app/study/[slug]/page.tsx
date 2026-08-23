import type { Metadata } from "next";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import legacy from "@/public/generated/legacy/manifest.json";
import { ScriptureSearch } from "@/components/scripture-search";
import { UtilityHeader } from "@/components/utility-header";

type Params = { slug: string };
const studies = legacy.studies as { slug: string; title: string; topic: string; updatedAt: string | null }[];
const slugs = studies.map((study) => study.slug);
function title(slug: string) { return slug.split("-").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" "); }
export const dynamicParams = false;
export function generateStaticParams(): Params[] { return slugs.map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> { const { slug } = await params; const study = studies.find((item) => item.slug === slug); const label = study?.title || title(slug); return { title: label, description: `Guided Scripture study for ${label}.`, alternates: { canonical: `/study/${slug}` } }; }
export default async function LegacyStudy({ params }: { params: Promise<Params> }) { const { slug } = await params; const study = studies.find((item) => item.slug === slug); const label = study?.title || title(slug); let paragraphs: string[] = []; try { paragraphs = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "generated", "legacy", "studies", `${slug}.json`), "utf8")).paragraphs || []; } catch {} return <><UtilityHeader /><main className="min-h-screen px-4 py-8 sm:px-6"><article className="mx-auto max-w-4xl"><p className="text-sm font-medium text-muted-foreground">GUIDED STUDY</p><h1 className="mt-2 text-3xl font-semibold">{label}</h1>{paragraphs.length ? paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-muted-foreground">{paragraph}</p>) : <p className="mt-4 text-muted-foreground">This published study path has moved here. Search Scripture to continue with local guided study.</p>}<div className="mt-5"><Link href="/study" className="rounded-md border border-border px-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-2">Open guided study</Link></div><h2 className="mt-10 text-xl font-semibold">Search Scripture</h2><div className="mt-3"><ScriptureSearch /></div></article></main></>; }
