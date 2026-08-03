import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import ClientProviders from "@/components/providers/ClientProviders";
import TransitionProvider from "@/components/providers/TransitionProvider";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Saran — Full Stack Developer & Creative Technologist",
  description:
    "I build digital experiences that turn ideas into stories people remember. Frontend engineer, creative technologist, storyteller.",
  openGraph: {
    title: "Saran — Full Stack Developer & Creative Technologist",
    description:
      "I build digital experiences that turn ideas into stories people remember.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-[var(--color-canvas)] text-[var(--color-ink)]"
      >
        <div className="grain-overlay" aria-hidden="true" />
        <ClientProviders>
          <TransitionProvider>
            <Header />
            <main className="relative z-[1] flex-1">{children}</main>
            <Footer />
          </TransitionProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
