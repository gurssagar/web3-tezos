import type { Metadata } from "next";
import "./globals.css";
import {ThemeClient} from "@/components/ThemeClient";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"  suppressHydrationWarning>
      <body>
      <ThemeClient>{children}</ThemeClient>
      </body>
    </html>
  );
}
