import type { Metadata, Viewport } from "next";
import { Geist, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkyMail - Newsletter & Email Campaign Platform",
  description:
    "Schedule, send, and track newsletters at scale. Enterprise-grade infrastructure for modern communications.",
  keywords:
    "newsletter, email marketing, bulk email, email campaigns, transactional emails",
  authors: [{ name: "SkyMail" }],
  openGraph: {
    title: "SkyMail",
    description:
      "Schedule, send, and track newsletters at scale. Enterprise-grade infrastructure.",
    type: "website",
    url: "https://skymail.app",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "SkyMail",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F766E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-white dark:bg-black overflow-x-hidden`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
