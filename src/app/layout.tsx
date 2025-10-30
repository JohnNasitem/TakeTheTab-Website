import type { Metadata } from "next";
import { Manrope, Ubuntu } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Take The Tab",
  description: "A platform used to manage shared bills",
  icons: "/icon.svg"
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
  return (
    <html lang="en" className={`${manrope.variable} ${ubuntu.variable}`}>
      <body className="antialiased">
        <div className="text-[var(--color-foreground)] bg-[var(--color-background)] flex flex-col max-h-dvh">
          <Navbar/>
          <div className="flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
