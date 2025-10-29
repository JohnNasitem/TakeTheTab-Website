import type { Metadata } from "next";
import { Manrope, Ubuntu } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { AppProviders } from "@/components/providers/app-providers";

export const metadata: Metadata = {
  title: "Take The Tab",
  description: "A platform used to manage shared bills",
};

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const ubuntu = Ubuntu({
  subsets: ["latin"],
  variable: "--font-ubuntu",
  weight: ["400", "500", "700"],
  display: "swap",
});

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
    <html lang="en" className={`${manrope.variable} ${ubuntu.variable}`}>
      <body className="antialiased">
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
