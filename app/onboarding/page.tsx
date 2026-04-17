"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ArrowRight, Smartphone, TrendingUp, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Onboarding() {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "Venda mais com a Cartfy",
      description: "A plataforma mais premium e conversiva para seus infoprodutos. Tudo na palma da sua mão.",
      icon: TrendingUp,
      color: "from-[#FF5F00] to-[#FF8C00]",
      glow: "shadow-[0_0_40px_rgba(255,106,0,0.5)]",
    },
    {
      title: "Checkout de Alta Conversão",
      description: "Crie checkouts irresistíveis com order bumps e upsells em poucos toques.",
      icon: Smartphone,
      color: "from-[#6C2BFF] to-[#8A2BE2]",
      glow: "shadow-[0_0_40px_rgba(108,43,255,0.5)]",
    },
    {
      title: "Área de Membros Premium",
      description: "Entregue a melhor experiência estilo Netflix para seus alunos.",
      icon: ShieldCheck,
      color: "from-emerald-500 to-teal-400",
      glow: "shadow-[0_0_40px_rgba(16,185,129,0.5)]",
    },
  ];

  const nextStep = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <motion.div 
          animate={{ 
            backgroundColor: step === 0 ? "rgba(255,106,0,0.1)" : step === 1 ? "rgba(108,43,255,0.1)" : "rgba(16,185,129,0.1)"
          }}
          transition={{ duration: 0.5 }}
          className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] rounded-full blur-[120px]"
        ></motion.div>
      </div>

      <div className="flex-1 flex flex-col justify-center p-6 mt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
            className="flex flex-col items-center text-center space-y-8"
          >
            <div className={`w-40 h-40 rounded-[2rem] bg-gradient-to-tr ${slides[step].color} ${slides[step].glow} flex items-center justify-center mb-8`}>
              {(() => {
                const Icon = slides[step].icon;
                return <Icon size={80} className="text-white" strokeWidth={1.5} />;
              })()}
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-[-0.02em] tracking-tight text-white leading-tight">
                {slides[step].title}
              </h1>
              <p className="text-zinc-400 text-base leading-relaxed max-w-[280px] mx-auto">
                {slides[step].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="p-6 pb-12 space-y-8">
        {/* Indicators */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <div 
              key={index} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === step ? `w-8 bg-gradient-to-r ${slides[step].color}` : 'w-2 bg-white/20'
              }`}
            ></div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {step < slides.length - 1 ? (
            <button 
              onClick={nextStep}
              className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg transition-all active:scale-[0.98] bg-gradient-to-r ${slides[step].color}`}
            >
              Continuar
            </button>
          ) : (
            <Link href="/login" className="w-full">
              <button className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg transition-all active:scale-[0.98] bg-gradient-to-r ${slides[step].color} flex items-center justify-center gap-2`}>
                Começar Agora <ArrowRight size={20} />
              </button>
            </Link>
          )}
          
          {step < slides.length - 1 && (
            <Link href="/login" className="w-full text-center py-4 text-zinc-500 font-semibold text-sm hover:text-white transition-colors">
              Pular
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
