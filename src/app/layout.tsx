import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AquaWatchAI · KwaliHub · Rural WASH Intelligence & Digital Twin",
  description:
    "Every village deserves clean water. Continuous digital twin integrating IoT telemetry, community water guardians, and causal AI diagnostics for rural Nigeria.",
  keywords: [
    "WASH",
    "AquaWatchAI",
    "Kwali Area Council",
    "Digital Twin",
    "Rural Water Security",
    "IoT Hydrology",
    "Water Board FCT",
    "UN SDG 6",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans selection:bg-purple-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
