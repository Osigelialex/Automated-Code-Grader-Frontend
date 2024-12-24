import type { Metadata } from "next";
import { Roboto, Stylish } from "next/font/google";
import "./globals.css";

const roboto = Roboto({ subsets: ['latin'], weight: "400"})
export const stylish = Stylish({ subsets: ['latin'], weight: "400"})

export const metadata: Metadata = {
  title: "CheckMate",
  description: "An automated grading system for programming assignments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={stylish.className}
      >
        {children}
      </body>
    </html>
  );
}
