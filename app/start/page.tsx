import { GospelGuide } from "@/components/gospel-guide";
import { ReaderPage } from "@/components/reader-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Reading the Bible",
  description: "A gentle, Scripture-first path for beginning to read and understand the Bible.",
  alternates: { canonical: "/start" },
};

export default function StartPage() {
  return (
    <ReaderPage
      title="A simple place to begin"
      description="Read a few foundational passages slowly. You do not need to understand everything at once."
    >
      <GospelGuide />
    </ReaderPage>
  );
}
