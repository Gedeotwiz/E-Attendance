import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduAttend",
  description: "Professional attendance management system",
   icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}