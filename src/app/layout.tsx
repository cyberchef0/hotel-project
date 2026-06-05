export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "RobsanHotel | Premium Luxury Accommodation",
  description:
    "Experience unparalleled luxury at RobsanHotel. Browse our exquisite rooms, book your perfect stay, and create unforgettable memories.",
  keywords: "luxury hotel, hotel booking, premium rooms, vacation, travel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
