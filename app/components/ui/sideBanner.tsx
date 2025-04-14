import React from "react";
import { CheckCircle } from "lucide-react";

export function SideBanner({ isMobile = false }: { isMobile?: boolean }) {
  const features = [
    "LLM powered feedback on assignments",
    "Customizable test-cases",
    "Multiple programming language support",
    "Unlimited Access"
  ];

  // Mobile version shows a more compact banner
  if (isMobile) {
    return (
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <h2 className="text-xl font-bold tracking-tight">What we offer</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-1 p-2 bg-white/10 rounded-lg backdrop-blur-sm"
              >
                <CheckCircle className="text-white h-4 w-4 flex-shrink-0" />
                <span className="text-xs font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Desktop version (original with some improvements)
  return (
    <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-3 h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative text-center space-y-8 py-12 lg:py-24">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">
            What we offer?
          </h2>
          <p className="text-white/80 sm:text-lg">
            Experience the future of coding education
          </p>
        </div>

        <ul className="space-y-6 mx-auto text-left px-3">
          {features.map((feature, index) => (
            <li 
              key={index} 
              className="flex items-center gap-2 p-4 bg-white/10 rounded-lg backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
            >
              <div className="p-2 bg-white/20 rounded-full">
                <CheckCircle className="text-white" />
              </div>
              <span className="lg:text-lg text-sm font-medium">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SideBanner;