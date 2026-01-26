import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
