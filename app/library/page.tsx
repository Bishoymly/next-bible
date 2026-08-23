import { LocalLibrary } from "@/components/local-library";
import { UtilityHeader } from "@/components/utility-header";
export const metadata = { robots: { index: false, follow: false }, alternates: { canonical: "/library" } };
export default function LibraryPage() { return <><UtilityHeader /><main className="min-h-screen px-4 py-8 sm:px-6"><h1 className="mx-auto mb-6 max-w-3xl text-3xl font-semibold">Saved verses and notes</h1><LocalLibrary /></main></>; }
