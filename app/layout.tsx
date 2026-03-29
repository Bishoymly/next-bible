import type { Metadata } from "next";
import { Cormorant_Garamond, EB_Garamond, Cinzel } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const bodyFont = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-body",
});

const labelFont = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-label",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <body className={`${displayFont.variable} ${bodyFont.variable} ${labelFont.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
        <GoogleAnalytics gaId="G-YEJ5GJ8FSH" />
      </body>
    </html>
  );
}
