"use client";

import { useMode } from "@/lib/mode-context";
import { DashboardVendedor } from "@/components/dashboard-vendedor";
import HomeAluno from "@/components/home-aluno";
import { AnimatePresence, motion } from "motion/react";

export default function Home() {
  const { mode } = useMode();
  
  return (
    <div className="relative w-full overflow-hidden min-h-screen">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: mode === "vendedor" ? -50 : 50, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: mode === "vendedor" ? 50 : -50, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full h-full"
        >
          {mode === "vendedor" ? <DashboardVendedor /> : <HomeAluno />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
