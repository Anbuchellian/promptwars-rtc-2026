import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PathForge AI | Multi-Agent Adaptive Career Engine",
  description: "Personalized Learning & Career Navigation Platform Powered by 4 Collaborating AI Agents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
