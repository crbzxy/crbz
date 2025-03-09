import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography"; 

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-roboto-condensed)", "sans-serif"],
      },
      typography: {
        invert: {
          css: {
            color: "#fff",
            a: { color: "#3b82f6" },
            strong: { color: "#fff" },
            blockquote: {
              color: "#fff",
              backgroundColor: "#1e293b",
              borderLeftColor: "#3b82f6",
            },
            hr: { borderColor: "#e5e7eb" },
          },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config;
