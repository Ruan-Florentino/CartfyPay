"use client";
import { Card } from "@/components/ui/card";
import { useCheckout } from "@/contexts/checkout-context";

export function CheckoutProduct() {
  const { config } = useCheckout();

  return (
    <Card className="mb-6 overflow-hidden p-0 bg-white/5 border-white/10">
      <div className="relative aspect-video group overflow-hidden">
        <img 
          src={config.productImage || "https://picsum.photos/seed/product/800/400"} 
          alt={config.productTitle} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500 text-white text-[10px] font-bold tracking-[-0.02em] px-2 py-0.5 rounded uppercase tracking-tighter">Oferta Limitada</span>
            <span className="bg-[#FF5F00] text-white text-[10px] font-bold tracking-[-0.02em] px-2 py-0.5 rounded uppercase tracking-tighter">Mais Vendido</span>
          </div>
          <h1 className="text-xl font-bold tracking-[-0.02em] text-white leading-tight drop-shadow-lg">{config.productTitle || "Produto Premium"}</h1>
        </div>
      </div>
      <div className="p-5">
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">{config.productDescription || "Descrição incrível do seu produto aqui."}</p>
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Preço Especial</span>
            <div className="text-3xl font-bold tracking-[-0.02em] tracking-tighter" style={{ color: config.primaryColor }}>
              {config.price || "R$ 0,00"}
            </div>
          </div>
          <div className="text-right">
            <span className="text-zinc-500 text-[10px] line-through block">De R$ 497,00</span>
            <span className="text-emerald-500 text-xs font-bold tracking-[-0.02em]">Economize R$ 300,00</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
