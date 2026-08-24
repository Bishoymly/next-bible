import type { Metadata } from "next";

import { GospelShareButton } from "@/components/gospel-share-button";
import { ReaderPage } from "@/components/reader-page";
import { SalvationGuideComponent } from "@/components/salvation-guide";

const description =
  "Read a concise, Scripture-grounded explanation of our need, Christ's death and resurrection, and salvation by grace through faith.";

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
      description="The good news of what God has done in Christ, and his call to repent and believe."
      actions={<GospelShareButton />}
      wide
    >
      <SalvationGuideComponent />
    </ReaderPage>
  );
}
