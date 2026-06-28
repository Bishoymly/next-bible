import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Holy Bible Reader",
    template: "%s | Holy Bible Reader"
  },
  description: "A modern Bible study experience with immersive reading, introductions, study notes, and multilingual access.",
  keywords: ["bible", "study", "scripture", "religious text", "bible reader", "bible translations"],
  authors: [{ name: "Holy Bible Reader" }],
  metadataBase: new URL('https://www.holybiblereader.com'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.holybiblereader.com",
    siteName: "Holy Bible Reader",
    title: "Holy Bible Reader",
    description: "A modern Bible study experience with immersive reading, introductions, study notes, and multilingual access.",
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
    title: "Holy Bible Reader",
    description: "A modern Bible study experience with immersive reading, introductions, study notes, and multilingual access.",
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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={sans.variable} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
