import type { Metadata } from "next";
import { Libre_Baskerville, Source_Sans_3, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  style: "normal",
  fallback: ["Georgia", "Times New Roman", "Times", "serif"],
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const metadata: Metadata = {
  title: "PathForge AI | Executive Multi-Agent Career & Adaptive Learning Engine",
  description: "Personalized Learning & Career Navigation Platform Powered by 5 Collaborating AI Agents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${libreBaskerville.variable} ${sourceSans3.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F8] text-slate-800 font-sans selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
