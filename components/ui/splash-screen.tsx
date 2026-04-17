import { motion } from "motion/react";
import { Logo } from "@/components/ui/logo";

export function SplashScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B0B0F]"
    >
      <Logo className="w-20 h-20 mb-6 animate-pulse" />
      <h1 className="text-2xl font-bold tracking-[-0.02em] text-white mb-2">Cartfy</h1>
      <p className="text-zinc-500 text-sm font-medium">Carregando...</p>
    </motion.div>
  );
}
