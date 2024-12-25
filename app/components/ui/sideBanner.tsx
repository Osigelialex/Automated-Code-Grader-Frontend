import React from "react";
import { Stylish } from 'next/font/google'

const stylish = Stylish({ subsets: ['latin'], weight: '400' });

export function SideBanner() {

  const features = [
    "LLM powered feedback on assignments",
    "Customizable test-cases",
    "Multiple programming language support",
    "Unlimited Access"
  ];

  return (
    <div className={`bg-primary lg:col-span-5 text-white ${stylish.className} p-3 lg:p-0`}>
      <div className="text-center space-y-6 lg:py-52">
        <h2 className="text-3xl lg:text-4xl font-bold tracking-wide mb-6">What we offer?</h2>
        <ul className="space-y-4 mx-auto lg:w-3/4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <span className="text-xl lg:text-2xl">✅</span>
              <span className="text-md lg:text-xl font-medium">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
