import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/components/**/*.{ts,tsx,js,jsx,mdx}",
  ],

  theme: {
    extend: {},
  },

  plugins: [require("tailwindcss-animate")],
} satisfies Config;
