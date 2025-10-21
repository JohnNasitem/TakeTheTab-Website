import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { AppProviders } from "@/components/providers/app-providers";
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Take The Tab",
  description: "A platform used to manage shared bills",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navbarLinks = [
    { name: "Home", href: "/" },
    { name: "Account", href: "/account" },
    { name: "Friends", href: "/friends" }
  ]

  return (
    <html lang="en">
      <SpeedInsights/>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="text-[var(--color-foreground)] bg-[var(--color-background)] flex flex-col min-h-screen">
          <Navbar links={navbarLinks} logo="/vercel.svg" />
          <div className="flex-1">
            <AppProviders>
              {children}
            </AppProviders>
          </div>
        </div>
      </body>
    </html>
  );
}
