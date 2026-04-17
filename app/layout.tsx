import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ModeProvider } from "@/lib/mode-context";
import { AuthProvider } from "@/contexts/auth-context";
import { PlayerProvider } from "@/contexts/player-context";
import { CommunityProvider } from "@/contexts/community-context";
import { NotificationProvider } from "@/contexts/notification-context";
import { ModeWrapper } from "@/components/layout/mode-wrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-heading" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
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
      <body className={`${inter.variable} ${plusJakartaSans.variable} font-sans bg-black text-white antialiased`}>
        <AuthProvider>
          <ModeProvider>
            <PlayerProvider>
              <NotificationProvider>
                <CommunityProvider>
                  <ModeWrapper>{children}</ModeWrapper>
                </CommunityProvider>
              </NotificationProvider>
            </PlayerProvider>
          </ModeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
