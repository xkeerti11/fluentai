import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "FluentAI — AI English Coach for Hindi Speakers",
    template: "%s | FluentAI",
  },
  description:
    "Apni awaaz se seekho English. AI-powered voice tutor that corrects grammar, builds vocabulary, and makes you fluent. Free forever.",
  keywords: ["English learning", "AI tutor", "Hindi speakers", "grammar correction", "vocabulary"],
  authors: [{ name: "FluentAI" }],
  openGraph: {
    title: "FluentAI — AI English Coach for Hindi Speakers",
    description: "Apni awaaz se seekho English. Free AI voice tutor.",
    type: "website",
    locale: "hi_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "FluentAI",
    description: "AI English Speaking Coach for Hindi Speakers",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#0F172A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className={`${inter.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="h-full antialiased" style={{ fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)' }}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1E293B",
              color: "#F1F5F9",
              border: "1px solid #334155",
              fontFamily: "Inter, sans-serif",
            },
          }}
          richColors
        />
      </body>
    </html>
  );
}
