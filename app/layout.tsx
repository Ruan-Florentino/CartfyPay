import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/bottom-nav";
import { TopHeader } from "@/components/layout/top-header";
import { ModeProvider } from "@/lib/mode-context";
import { PlayerProvider } from "@/contexts/player-context";
import { MiniPlayer } from "@/components/mini-player";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0B0B0F",
};

export const metadata: Metadata = {
  title: "Cartfy",
  description: "App de vendas e checkout",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cartfy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} font-sans bg-black text-white antialiased`}>
        <ModeProvider>
          <PlayerProvider>
            <div className="flex min-h-screen justify-center items-center bg-zinc-950 sm:p-4">
              <div className="relative w-full max-w-[420px] h-[100dvh] sm:h-[850px] bg-[#0B0B0F] sm:rounded-[2.5rem] sm:border-[8px] sm:border-zinc-900 overflow-hidden shadow-2xl flex flex-col">
                <TopHeader />
                <main className="flex-1 overflow-y-auto no-scrollbar relative pb-32">
                  {children}
                </main>
                <MiniPlayer />
                <BottomNav />
              </div>
            </div>
          </PlayerProvider>
        </ModeProvider>
      </body>
    </html>
  );
}
