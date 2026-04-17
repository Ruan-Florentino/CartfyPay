"use client";

import { motion, AnimatePresence } from "motion/react";
import { useMode } from "@/lib/mode-context";
import { DashboardVendedor } from "@/components/dashboard-vendedor";
import HomeAluno from "@/components/home-aluno";

export default function Home() {
  const { mode } = useMode();
  
  return (
    <div className="relative w-full overflow-hidden min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: mode === "vendedor" ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: mode === "vendedor" ? -20 : 20 }}
          transition={{ duration: 0.25 }}
        >
          {mode === "vendedor" ? <DashboardVendedor /> : <HomeAluno />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
