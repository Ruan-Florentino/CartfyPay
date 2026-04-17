"use client";
import { motion, AnimatePresence } from "motion/react";
import { CheckoutHeader } from "./checkout-header";
import { CheckoutProduct } from "./checkout-product";
import { CheckoutBenefits } from "./checkout-benefits";
import { CheckoutTestimonials } from "./checkout-testimonials";
import { CheckoutPayment } from "./checkout-payment";
import { useCheckout } from "@/contexts/checkout-context";
import { useState, useEffect } from "react";

import { ShieldCheck, Lock, Star, CheckCircle2, Clock, Bell } from "lucide-react";

export function CheckoutExperience() {
  const { config } = useCheckout();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [showSocialProof, setShowSocialProof] = useState(false);
  const [socialProofData, setSocialProofData] = useState({ name: "", time: "" });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const names = ["João S.", "Maria C.", "Pedro H.", "Ana P.", "Lucas M.", "Juliana T."];
    const times = ["há 2 min", "há 5 min", "agora mesmo", "há 10 min", "há 1 min"];
    
    const showRandomProof = () => {
      const name = names[Math.floor(Math.random() * names.length)];
      const time = times[Math.floor(Math.random() * times.length)];
      setSocialProofData({ name, time });
      setShowSocialProof(true);
      
      setTimeout(() => {
        setShowSocialProof(false);
      }, 4000);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        showRandomProof();
      }
    }, 15000); // Check every 15s

    // Show first one after 5s
    setTimeout(showRandomProof, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderSection = (section: any) => {
    if (!section.enabled) return null;

    switch (section.type) {
      case 'header': return <CheckoutHeader key={section.id} />;
      case 'product': return <CheckoutProduct key={section.id} />;
      case 'benefits': return <CheckoutBenefits key={section.id} />;
      case 'testimonials': return <CheckoutTestimonials key={section.id} />;
      case 'payment': return <CheckoutPayment key={section.id} />;
      case 'guarantee': return (
        <motion.div 
          key={section.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 bg-white/5 border border-white/10 rounded-3xl p-6 text-center space-y-4"
        >
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
            <ShieldCheck size={32} className="text-amber-500" />
          </div>
          <div className="space-y-1">
            <h4 className="text-white font-bold tracking-[-0.02em] uppercase tracking-widest text-sm">Garantia Incondicional</h4>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Você tem 7 dias para testar o conteúdo. Se não gostar, devolvemos 100% do seu dinheiro sem perguntas.
            </p>
          </div>
        </motion.div>
      );
      case 'timer': return (
        <motion.div 
          key={section.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center flex flex-col items-center justify-center"
        >
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <Clock size={16} className="animate-pulse" />
            <p className="text-[10px] font-bold tracking-[-0.02em] uppercase tracking-[0.2em]">Oferta expira em</p>
          </div>
          <div className="text-4xl font-black tracking-[-0.02em] text-white tracking-tighter tabular-nums">
            {formatTime(timeLeft)}
          </div>
        </motion.div>
      );
      default: return null;
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-x-hidden selection:bg-[#FF5F00] selection:text-white"
      style={{ 
        backgroundColor: config.backgroundColor || "#000000",
        backgroundImage: config.backgroundImage ? `url(${config.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background Overlay */}
      {config.backgroundImage && <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />}

      <div className="relative z-10 max-w-lg mx-auto">
        <main className="p-4 pb-32 space-y-6">
          {/* Headline Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 space-y-2"
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] text-white tracking-tighter leading-none">
              {config.headline || "Checkout Seguro"}
            </h1>
            <p className="text-zinc-400 text-sm font-medium">
              {config.subheadline || "Sua compra está protegida e criptografada"}
            </p>
          </motion.div>

          {/* Dynamic Sections */}
          {config.sections.map((section: any) => renderSection(section))}

          {/* Trust Badges Footer */}
          <div className="py-8 text-center space-y-6">
            <div className="flex items-center justify-center gap-6 opacity-40 grayscale">
              <img src="https://logodownload.org/wp-content/uploads/2014/07/visa-logo-1.png" className="h-4 object-contain" alt="Visa" />
              <img src="https://logodownload.org/wp-content/uploads/2014/07/mastercard-logo-7.png" className="h-6 object-contain" alt="Mastercard" />
              <img src="https://logodownload.org/wp-content/uploads/2015/03/pix-logo-1.png" className="h-5 object-contain" alt="Pix" />
            </div>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
              Cartfy Tecnologia de Pagamentos © 2026
            </p>
          </div>
        </main>
      </div>
      
      {/* Fixed Buy Button for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-2xl border-t border-white/5 z-[100]">
        <div className="max-w-lg mx-auto">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-2xl font-bold tracking-[-0.02em] text-white text-base shadow-2xl shadow-[#FF5F00]/30 flex items-center justify-center gap-3 group relative overflow-hidden"
            style={{ backgroundColor: config.primaryColor || "#FF5F00" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <CheckCircle2 size={20} />
            {config.buttonText || "FINALIZAR COMPRA AGORA"}
          </motion.button>
          <div className="flex items-center justify-center gap-2 mt-2 text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
            <Lock size={10} /> Compra 100% Segura e Criptografada
          </div>
        </div>
      </div>

      {/* Social Proof Popup */}
      <AnimatePresence>
        {showSocialProof && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-28 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-[#111118] border border-white/10 rounded-2xl p-4 shadow-2xl z-[110] flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <CheckCircle2 size={20} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-white text-sm font-bold">
                {socialProofData.name} <span className="text-zinc-400 font-normal">comprou</span>
              </p>
              <p className="text-emerald-400 text-xs font-medium">{socialProofData.time}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
