"use client";

import { useMode } from "@/lib/mode-context";
import { motion } from "motion/react";

export function TopHeader() {
  const { mode, setMode } = useMode();

  return (
    <div className="px-6 pt-10 pb-2 flex justify-center items-center z-50 relative bg-[#0B0B0F]/80 backdrop-blur-xl border-b border-white/5 sticky top-0">
      <div className="bg-[#111118]/80 backdrop-blur-md p-1.5 rounded-full flex items-center border border-white/10 relative w-64 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <motion.div 
          className="absolute inset-y-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-white/10"
          initial={false}
          animate={{
            left: mode === "vendedor" ? "6px" : "calc(50%)"
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
        <button 
          onClick={() => setMode("vendedor")}
          className={`relative z-10 flex-1 py-2.5 rounded-full text-[11px] font-black tracking-widest transition-colors duration-300 ${mode === "vendedor" ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          VENDEDOR
        </button>
        <button 
          onClick={() => setMode("aluno")}
          className={`relative z-10 flex-1 py-2.5 rounded-full text-[11px] font-black tracking-widest transition-colors duration-300 ${mode === "aluno" ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          ALUNO
        </button>
      </div>
    </div>
  );
}
