import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#d4a017",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Show Your Poetry — Where Poetry Finds Its Voice",
  description:
    "Speak your poetry in any language and share it with the world. Record, transcribe, and publish your poems with AI-powered voice technology.",
  keywords: ["poetry", "voice recording", "multilingual", "poems", "creative writing"],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Show Your Poetry",
  },
  openGraph: {
    title: "Show Your Poetry — Where Poetry Finds Its Voice",
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
