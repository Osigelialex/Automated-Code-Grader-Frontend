import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { Toaster } from 'sonner';

const poppins = Poppins({ subsets: ['latin'], weight: "400"})

export const metadata: Metadata = {
  title: "CheckMater",
  description: "An automated grading system for programming assignments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${poppins.className}`}>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
