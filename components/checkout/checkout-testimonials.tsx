"use client";
import { Star, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCheckout } from "@/contexts/checkout-context";

export function CheckoutTestimonials() {
  const { config } = useCheckout();

  return (
    <Card className="mb-6 bg-white/5 border-white/10 p-5">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 rounded-full bg-[#FF5F00]" />
        <h3 className="text-sm font-bold tracking-[-0.02em] text-white uppercase tracking-widest">O que dizem nossos alunos</h3>
      </div>
      <div className="space-y-6">
        {(config.testimonialsList || []).map((t: any, index: number) => (
          <div key={index} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF5F00]/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <img src={t.photo} alt={t.name} className="w-12 h-12 rounded-full border-2 border-[#FF5F00]/30" />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-black">
                    <Check size={8} />
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-bold tracking-[-0.02em] text-sm">{t.name}</h4>
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(t.stars || 5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                  </div>
                </div>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed italic">"{t.text}"</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center gap-4">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map(i => (
            <img key={i} src={`https://i.pravatar.cc/150?img=${i + 10}`} className="w-6 h-6 rounded-full border-2 border-black" alt="User" />
          ))}
        </div>
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">+ 1.240 alunos satisfeitos</span>
      </div>
    </Card>
  );
}
