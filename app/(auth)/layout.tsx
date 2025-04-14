import React from "react";
import { SideBanner } from "../components/ui/sideBanner";

export default function AuthLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen overflow-hidden">
      <div className="grid lg:grid-cols-12 md:grid-cols-1 gap-4 md:gap-8">
        {/* Mobile banner - shown only on small screens */}
        <div className="lg:hidden w-full">
          <SideBanner isMobile={true} />
        </div>
        
        {/* Content area - adjusted padding for mobile */}
        <div className="lg:col-span-7 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-20">
          {children}
        </div>

        {/* Desktop banner - hidden on mobile */}
        <div className="hidden lg:block lg:col-span-5">
          <SideBanner isMobile={false} />
        </div>
      </div>
    </main>
  )
}