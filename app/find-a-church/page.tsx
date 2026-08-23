import { ChurchGuidanceComponent } from "@/components/church-guidance";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find a Faithful Church",
  description: "Biblical guidance for looking for a faithful local church and healthy Christian community.",
  alternates: { canonical: "/find-a-church" },
};

export default function FindAChurchPage() {
  return <ChurchGuidanceComponent />;
}
