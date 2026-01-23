import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://dylanswart.co.za'),
  title: "Dylan Swart - Web Developer Portfolio",
  description: "Full-stack web developer portfolio showcasing modern web applications built with React, TypeScript, and Next.js. Specializing in 3D web experiences, AI integration, and responsive design.",
  keywords: ["web developer", "portfolio", "react", "typescript", "next.js", "3D web", "full stack developer", "Dylan Swart", "South Africa developer"],
  authors: [{ name: "Dylan Swart" }],
  creator: "Dylan Swart",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/favicon.svg" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dylanswart.co.za",
    title: "Dylan Swart - Web Developer Portfolio",
    description: "Full-stack web developer specializing in React, TypeScript, Next.js, and 3D web experiences.",
    siteName: "Dylan Swart Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dylan Swart - Web Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dylan Swart - Web Developer Portfolio",
    description: "Full-stack web developer specializing in React, TypeScript, Next.js, and 3D web experiences.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
