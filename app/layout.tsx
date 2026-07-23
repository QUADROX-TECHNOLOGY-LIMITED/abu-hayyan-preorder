import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Abu Hayyan | Pearls from the Masterpieces",
  description: "Pre-order the debut collection of classical Arabic poetry by Yusuf Olalekan Oyetunji.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-[#1a100c] text-[#fcf8f2] antialiased selection:bg-[#d4af37] selection:text-[#1a100c]`}>
        {children}
      </body>
    </html>
  );
}