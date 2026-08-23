import { SalvationGuideComponent } from "@/components/salvation-guide";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Path to Salvation",
  description: "Read a concise, Scripture-grounded guide to the good news of salvation in Jesus Christ.",
  alternates: { canonical: "/salvation" },
};

export default function SalvationPage() {
  return <SalvationGuideComponent />;
}
