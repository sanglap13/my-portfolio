import type { Metadata } from "next";
import "./globals.css";

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
      <body className="font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
