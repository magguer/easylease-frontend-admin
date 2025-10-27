import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AdminLayout } from "@/components/AdminLayout";
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
  title: "EasyLease Admin - Panel de Administración",
  description: "Panel de administración para gestionar listings, leads y partners de EasyLease",
  keywords: "admin, panel, easylease, administración",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <AdminLayout>
          {children}
        </AdminLayout>
      </body>
    </html>
  );
}
