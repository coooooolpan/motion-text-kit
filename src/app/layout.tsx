import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "@/motion-text-kit/styles.css";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontHeading = Inter({
  variable: "--font-heading",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const fontPixelSquare = localFont({
  src: "../../node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Square.woff2",
  variable: "--font-geist-pixel-square",
  weight: "500",
  fallback: ["Geist Mono", "ui-monospace", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://motion-text-kit.vercel.app"),
  title: "Motion Text Kit",
  description: "Reusable React text motion components powered by CSS.",
  openGraph: {
    title: "Motion Text Kit",
    description: "Reusable React text motion components powered by CSS.",
    siteName: "Motion Text Kit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Motion Text Kit",
    description: "Reusable React text motion components powered by CSS.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontHeading.variable} ${fontMono.variable} ${fontPixelSquare.variable} h-full antialiased`}
    >
      <body className="relative min-h-full">
        <div className="isolate relative flex min-h-svh flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
