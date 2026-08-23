import Link from "next/link";
import legacy from "@/public/generated/legacy/manifest.json";
import { UtilityHeader } from "@/components/utility-header";

const topics = (legacy.records as { kind?: string; slug?: string }[]).filter((record) => record.kind === "topics" && record.slug).map((record) => record.slug!);
export const metadata = { title: "Study topics", alternates: { canonical: "/topics" } };
export default function TopicsPage() { return <><UtilityHeader /><main className="min-h-screen px-4 py-8 sm:px-6"><div className="mx-auto max-w-4xl"><h1 className="text-3xl font-semibold">Study topics</h1><ul className="mt-6 grid gap-3 sm:grid-cols-2">{topics.map((topic) => <li key={topic}><Link href={`/topics/${topic}`} className="block rounded-md border border-border p-4 capitalize transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2">{topic.replaceAll("-", " ")}</Link></li>)}</ul></div></main></>; }
