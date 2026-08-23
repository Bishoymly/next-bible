import { GospelGuide } from "@/components/gospel-guide";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start Reading the Bible",
  description: "A gentle, Scripture-first path for beginning to read and understand the Bible.",
  alternates: { canonical: "/start" },
};

export default function StartPage() {
  return <GospelGuide />;
}
