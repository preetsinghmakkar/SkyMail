import type { Metadata } from "next";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-white dark:bg-black`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
