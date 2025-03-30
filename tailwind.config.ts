import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      textColor: {
        DEFAULT: "#4A4A4A"
      },
      colors: {
        primary: "#3b82f6",
        secondary: "#f8f9fb"
      },
    },
  },
  plugins: [
    require('daisyui')
  ],
  // daisyui: {
  //   themes: ["light"],
  //   darkTheme: "light",
  // },
} satisfies Config;
