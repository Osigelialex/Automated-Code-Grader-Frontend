import React from "react";
import { CheckCircle } from "lucide-react";

export function SideBanner() {
  const features = [
    "LLM powered feedback on assignments",
    "Customizable test-cases",
    "Multiple programming language support",
    "Unlimited Access"
  ];

  return (
    <div className="bg-gradient-to-br from-primary to-primary/80 lg:col-span-5 text-white p-3 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative text-center space-y-8 lg:py-24">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">
            What we offer?
          </h2>
          <p className="text-white/80 text-lg">
            Experience the future of coding education
          </p>
        </div>

        <ul className="space-y-6 mx-auto lg:w-3/4">
          {features.map((feature, index) => (
            <li 
              key={index} 
              className="flex items-center gap-2 p-4 bg-white/10 rounded-lg backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
            >
              <div className="p-2 bg-white/20 rounded-full">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-md font-medium">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SideBanner;