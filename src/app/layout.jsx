// app/layout.js
"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { useContext } from "react";
import "./globals.css";
import Navbar from "@/components/layouts/NavbarGuest";
import Footer from "@/components/layouts/Footer";
import { AuthProvider, default as AuthContext } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function LayoutContent({ children }) {
  const pathname = usePathname();
  const { loading } = useContext(AuthContext);

  const isAdminPage = pathname?.startsWith("/admin");
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {!isAdminPage && !isAuthPage && <Navbar />}

        <main>
          {loading && !isAdminPage && !isAuthPage ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            children
          )}
        </main>

        {!isAdminPage && !isAuthPage && loading && <Footer />}
      </body>
    </html>
  );
}

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}
