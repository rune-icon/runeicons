import type { Metadata } from "next";
import { Geist, Geist_Mono, Gemunu_Libre, Inter } from "next/font/google";

import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gemunuLibre = Gemunu_Libre({
  variable: "--font-gemunu-libre",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "RuneIcon",
  description: "Beautiful icons for your next project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} ${gemunuLibre.variable} antialiased`}
      >
        <Navbar />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
