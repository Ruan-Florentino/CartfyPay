"use client";

import { useMode } from "@/lib/mode-context";
import { motion, AnimatePresence } from "motion/react";
import { TopHeader } from "@/components/layout/top-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { MiniPlayer } from "@/components/mini-player";
import { usePathname } from "next/navigation";

export function ModeWrapper({ children }: { children: React.ReactNode }) {
  const { mode, gradientFrom, gradientTo } = useMode();
  const pathname = usePathname();

  if (pathname.startsWith("/checkout")) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full relative z-10"
          >
            {children}
          </motion.div>
        </AnimatePresence>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex flex-col">
      <TopHeader />
      <main className="flex-1 overflow-y-auto no-scrollbar relative z-10 pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === 'vendedor' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === 'vendedor' ? 20 : -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <MiniPlayer />
      <BottomNav />
    </div>
  );
}
