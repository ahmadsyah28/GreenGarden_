// app/layout.js
"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layouts/NavbarGuest";
import Footer from "@/components/layouts/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <AuthProvider>
          {!isAdminPage && !isAuthPage && <Navbar />}
          <main className={isAuthPage ? "min-h-screen flex items-center justify-center bg-gray-100" : ""}>
            {children}
          </main>
          {!isAdminPage && !isAuthPage && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}