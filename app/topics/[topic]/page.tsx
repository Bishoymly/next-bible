import type { Metadata } from "next";
import Link from "next/link";
import legacy from "@/public/generated/legacy/manifest.json";
import { UtilityHeader } from "@/components/utility-header";

type Params = { topic: string };
const topics = (legacy.records as { kind?: string; slug?: string }[]).filter((record) => record.kind === "topics" && record.slug).map((record) => record.slug!);
export const dynamicParams = false;
export function generateStaticParams(): Params[] { return topics.map((topic) => ({ topic })); }
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> { const { topic } = await params; const label = topic.replaceAll("-", " "); return { title: label, alternates: { canonical: `/topics/${topic}` } }; }
export default async function TopicPage({ params }: { params: Promise<Params> }) { const { topic } = await params; const label = topic.replaceAll("-", " "); const studies = (legacy.studies as { slug: string; title: string; topicSlug: string }[]).filter((study) => study.topicSlug === topic); return <><UtilityHeader /><main className="min-h-screen px-4 py-8 sm:px-6"><div className="mx-auto max-w-4xl"><h1 className="text-3xl font-semibold capitalize">{label}</h1>{studies.length ? <ul className="mt-5 space-y-2">{studies.map((study) => <li key={study.slug}><Link href={`/study/${study.slug}`} className="block rounded-md border border-border p-3 hover:bg-muted">{study.title}</Link></li>)}</ul> : <p className="mt-4 text-muted-foreground">No imported studies are assigned to this topic.</p>}<Link href="/study" className="mt-5 inline-block rounded-md border border-border px-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-2">Open guided study</Link></div></main></>; }
