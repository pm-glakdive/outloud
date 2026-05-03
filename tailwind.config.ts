import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      colors: {
        ink: {
          DEFAULT: "#111111",
          subtle: "#666666",
          muted: "#999999",
        },
        bg: {
          DEFAULT: "#fafaf9",
          card: "#ffffff",
          subtle: "#f3f3f1",
        },
        accent: {
          DEFAULT: "#0a7d28",
          warm: "#c2410c",
        },
      },
    },
  },
  plugins: [],
};

export default config;
