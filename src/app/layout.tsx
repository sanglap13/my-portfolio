import type { Metadata } from "next";
import "./globals.css";
import AmbientBackground from "@/components/AmbientBackground";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Sanglap Mridha | Software Developer",
  description: "Portfolio of Sanglap Mridha. A passionate software developer with a knack for building communities and fostering a healthy environment to learn and grow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans text-white antialiased bg-theme-bg">
        <CustomCursor />
        <AmbientBackground />
        {children}
        <Navbar />
      </body>
    </html>
  );
}
