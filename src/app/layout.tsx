import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FooterNavigation } from "@/components/layout/footer-navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "満足度記録アプリ",
  description: "日々の活動に対する満足度を記録し、振り返ることで自己評価と行動改善を促進するアプリです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased app-container`}
      >
        <main className="main-content">
          {children}
        </main>
        <FooterNavigation />
      </body>
    </html>
  );
}
