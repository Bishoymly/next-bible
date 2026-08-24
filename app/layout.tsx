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
    default: "Bible Reader",
    template: "%s | Bible Reader"
  },
  description: "Read and search Scripture across English and Arabic translations, with book introductions, study notes, and private bookmarks.",
  keywords: ["bible", "study", "scripture", "religious text", "bible reader", "bible translations"],
  authors: [{ name: "Bible Reader" }],
  metadataBase: new URL('https://bible.bishoy.io'),
  alternates: { canonical: '/' },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bible.bishoy.io",
    siteName: "Bible Reader",
    title: "Bible Reader",
    description: "Read and search Scripture across English and Arabic translations, with book introductions, study notes, and private bookmarks.",
  },
  twitter: {
    card: "summary",
    title: "Bible Reader",
    description: "Read and search Scripture across English and Arabic translations, with book introductions, study notes, and private bookmarks.",
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
