import React from "react";
import { SideBanner } from "../components/ui/sideBanner";

export default function AuthLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen overflow-hidden">
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 px-8 py-12 lg:py-20">
          {children}
        </div>
        
        <SideBanner />
      </div>
    </main>
    )
}