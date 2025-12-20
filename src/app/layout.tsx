import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Home/Navbar/Navbar";
import Footer from "@/components/Home/Footer/Footer";
import { ClientProviders } from "./ClientProvider";
import CartSheet from "@/components/cart/CartSheet";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ElectroPoint - Premium Electronics",
  description: "Curated tech for the modern creator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased glass`}
      >
        <ClientProviders>
          <Navbar />
          {children}
          <Footer />
          <CartSheet />
        </ClientProviders>
      </body>
    </html>
  );
}
