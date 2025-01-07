import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Bible Study Companion",
    template: "%s | Bible Study Companion"
  },
  description: "Your comprehensive Bible study companion with multiple translations, study tools, and cross-references. Read, study, and explore the Bible in different languages.",
  keywords: ["bible", "study", "scripture", "religious text", "bible study", "bible translations"],
  authors: [{ name: "Bible Study Companion" }],
  metadataBase: new URL('https://new.holybiblereader.com'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://new.holybiblereader.com",
    siteName: "Bible Study Companion",
    title: "Bible Study Companion",
    description: "Your comprehensive Bible study companion with multiple translations, study tools, and cross-references.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bible Study Companion"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Bible Study Companion",
    description: "Your comprehensive Bible study companion with multiple translations, study tools, and cross-references.",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "G-YEJ5GJ8FSH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <body className={inter.className}>{children}</body>
      <Analytics />
      <GoogleAnalytics gaId="G-YEJ5GJ8FSH" />
    </html>
  );
}
