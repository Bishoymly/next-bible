import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Bible Reader",
    template: "%s | Bible Reader"
  },
  description: "Your comprehensive Bible reader with multiple translations, study tools, and cross-references. Read, study, and explore the Bible in different languages.",
  keywords: ["bible", "study", "scripture", "religious text", "bible reader", "bible translations"],
  authors: [{ name: "Bible Reader" }],
  metadataBase: new URL('https://www.holybiblereader.com'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.holybiblereader.com",
    siteName: "Bible Reader",
    title: "Bible Reader",
    description: "Your comprehensive Bible reader with multiple translations, study tools, and cross-references.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bible Reader"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Bible Reader",
    description: "Your comprehensive Bible reader with multiple translations, study tools, and cross-references.",
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
