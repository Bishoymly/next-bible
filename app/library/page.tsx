import { LocalLibrary } from "@/components/local-library";
import { ReaderPage } from "@/components/reader-page";
export const metadata = { robots: { index: false, follow: false }, alternates: { canonical: "/library" } };
export default function LibraryPage() {
  return (
    <ReaderPage
      title="Saved verses and notes"
      description="Your private reading library lives only in this browser. No account or server storage is used."
    >
      <LocalLibrary />
    </ReaderPage>
  );
}
