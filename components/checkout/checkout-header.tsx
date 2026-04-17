"use client";
import { useState, useEffect } from "react";
import { ShieldCheck, Clock } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useCheckout } from "@/contexts/checkout-context";

export function CheckoutHeader() {
  const { config } = useCheckout();
  const [timeLeft, setTimeLeft] = useState(config.timerDuration || 600);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev: number) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/10 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5F00] to-[#FF8F00] flex items-center justify-center shadow-lg shadow-[#FF5F00]/20">
          <Logo className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold tracking-[-0.02em] text-white text-xs uppercase tracking-wider">Checkout Seguro</h2>
          <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold">
            <ShieldCheck size={10} /> Ambiente Criptografado
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-red-500/10 text-red-500 px-3 py-1.5 rounded-full border border-red-500/20 font-bold tracking-[-0.02em] text-xs animate-pulse">
        <Clock size={14} /> {formatTime(timeLeft)}
      </div>
    </div>
  );
}
