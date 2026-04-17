"use client";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCheckout } from "@/contexts/checkout-context";

export function CheckoutBenefits() {
  const { config } = useCheckout();

  return (
    <Card className="mb-6 bg-white/5 border-white/10 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 rounded-full bg-[#FF5F00]" />
        <h3 className="text-sm font-bold tracking-[-0.02em] text-white uppercase tracking-widest">O que você vai receber</h3>
      </div>
      <ul className="space-y-4">
        {(config.benefitsList || []).map((benefit: any, index: number) => (
          <li key={index} className="flex items-start gap-3 group">
            <div className="bg-emerald-500/10 text-emerald-500 p-1 rounded-lg border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              <Check size={14} />
            </div>
            <span className="text-zinc-300 text-sm font-medium leading-tight">{benefit.text}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
