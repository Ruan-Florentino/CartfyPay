"use client";

import { useMode } from "@/lib/mode-context";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

export function TopHeader() {
  const { mode, setMode, gradientFrom, gradientTo } = useMode();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        setScrolled(mainElement.scrollTop > 10);
      } else {
        setScrolled(window.scrollY > 10);
      }
    };

    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className={`px-6 pt-10 pb-4 flex flex-col items-center z-50 relative sticky top-0 transition-all duration-300 ${scrolled ? 'bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]' : 'bg-transparent border-b border-transparent'}`}>
      
      {/* Logo Area */}
      <div className="flex items-center gap-2 mb-4 group cursor-pointer">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,106,0,0.4)] animate-gradient relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}>
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <Sparkles size={20} className="text-white relative z-10" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, #ffffff, #a1a1aa)` }}>
          Cartfy
        </h1>
      </div>

      {/* Mode Switcher */}
      <div className="bg-white/5 backdrop-blur-md p-1.5 rounded-2xl flex items-center border border-white/10 relative w-64 shadow-lg">
        <motion.div 
          className="absolute inset-y-1.5 w-[calc(50%-6px)] rounded-xl shadow-lg border border-white/10 animate-gradient"
          style={{ background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})` }}
          initial={false}
          animate={{
            left: mode === "vendedor" ? "6px" : "calc(50%)"
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
        <button 
          onClick={() => setMode("vendedor")}
          className={`relative z-10 flex-1 py-2 rounded-xl text-[11px] font-bold tracking-widest transition-colors duration-300 ${mode === "vendedor" ? "text-white drop-shadow-md" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          VENDEDOR
        </button>
        <button 
          onClick={() => setMode("aluno")}
          className={`relative z-10 flex-1 py-2 rounded-xl text-[11px] font-bold tracking-widest transition-colors duration-300 ${mode === "aluno" ? "text-white drop-shadow-md" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          ALUNO
        </button>
      </div>
    </div>
  );
}
