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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "ElectroPoint – Premium Electronics for Creators",
    template: "%s | ElectroPoint",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "ElectroPoint – Premium Electronics for Creators",
    description:
      "Curated tech for modern creators. Shop the latest laptops, smartphones, and accessories with ElectroPoint.",
    url: "/",
    siteName: "ElectroPoint",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "ElectroPoint - Premium Electronics Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ElectroPoint – Premium Electronics for Creators",
    description:
      "Curated tech for modern creators. Shop the latest laptops, smartphones, and accessories with ElectroPoint.",
    images: ["/opengraph-image.png"],
    creator: "@Dev92rishi",
  },
  applicationName: "ElectroPoint",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <head>
        <meta
          name="description"
          content="Discover the latest laptops, smartwatches, and accessories at ElectroPoint"
        />
      </head>
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
