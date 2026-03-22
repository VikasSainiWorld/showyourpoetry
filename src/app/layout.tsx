import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "ShowYourPoetry — Where Poetry Finds Its Voice",
  description:
    "Speak your poetry in any language and share it with the world. Record, transcribe, and publish your poems with AI-powered voice technology.",
  keywords: ["poetry", "voice recording", "multilingual", "poems", "creative writing"],
  openGraph: {
    title: "ShowYourPoetry — Where Poetry Finds Its Voice",
    description:
      "Speak your poetry in any language and share it with the world.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-midnight text-parchment min-h-screen">
        {children}
      </body>
    </html>
  );
}
