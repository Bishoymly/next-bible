import type { Metadata } from "next";

import { GospelShareButton } from "@/components/gospel-share-button";
import { ReaderPage } from "@/components/reader-page";
import { SalvationGuideComponent } from "@/components/salvation-guide";

const description =
  "Read a concise, Scripture-grounded guide to the good news of Jesus Christ.";

export const metadata: Metadata = {
  title: "The Gospel",
  description,
  alternates: { canonical: "/gospel" },
  openGraph: {
    type: "website",
    url: "/gospel",
    title: "The Gospel of Jesus Christ",
    description,
    siteName: "Bible",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Gospel of Jesus Christ",
    description,
  },
};

export default function GospelPage() {
  return (
    <ReaderPage
      label="The Christian message"
      title="The Gospel of Jesus Christ"
      description="A concise guide to sin, grace, faith, repentance, and the hope Christians confess in Christ."
      actions={<GospelShareButton />}
    >
      <SalvationGuideComponent />
    </ReaderPage>
  );
}
