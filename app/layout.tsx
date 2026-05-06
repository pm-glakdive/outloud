import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Outloud — Say the number before they reach for the calculator",
  description:
    "A daily mental-math drill for the meetings where you can't pull out paper and pen. Anchor, adjust, say it.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fafaf9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto max-w-md min-h-screen flex flex-col px-5 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
