import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Napkin — Mental math for knowledge workers",
  description:
    "A daily mental-math drill for PMs, analysts, and founders. Stop pulling out the calculator in meetings.",
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
