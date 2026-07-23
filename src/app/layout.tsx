import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// This explicitly locks the mobile browser theme to light mode
export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light', 
};

export const metadata: Metadata = {
  title: 'Abu Hayyãn - Pre-Order',
  description: 'Official pre-order for Pearls from the Masterpieces of Abu Hayyan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
