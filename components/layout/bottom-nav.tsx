"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, DollarSign, User, PlayCircle, Download, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMode } from "@/lib/mode-context";
import { motion, AnimatePresence } from "motion/react";

const vendedorNav = [
  { name: "Home", href: "/", icon: Home },
  { name: "Produtos", href: "/produtos", icon: Package },
  { name: "Checkout", href: "/checkout", icon: ShoppingCart, isCentral: true },
  { name: "Vendas", href: "/vendas", icon: DollarSign },
  { name: "Perfil", href: "/perfil", icon: User },
];

const alunoNav = [
  { name: "Home", href: "/", icon: Home },
  { name: "Cursos", href: "/cursos", icon: PlayCircle },
  { name: "Downloads", href: "/downloads", icon: Download, isCentral: true },
  { name: "Comunidade", href: "/comunidade", icon: Users },
  { name: "Perfil", href: "/perfil", icon: User },
];

function NavItems({ items, mode }: { items: typeof vendedorNav, mode: string }) {
  const pathname = usePathname();
  const { primaryColor, gradientFrom, gradientTo } = useMode();
  
  return (
    <div key={mode} className="w-[90%] max-w-md h-[72px] bg-white/5 backdrop-blur-xl border border-white/10 px-4 flex justify-between items-center rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative">
      <AnimatePresence mode="popLayout">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const isCentral = item.isCentral;

          if (isCentral) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative flex flex-col items-center justify-center w-20 h-20 -mt-10 group z-10"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
                  className={cn(
                    "flex items-center justify-center w-16 h-16 rounded-2xl shadow-[0_0_20px_rgba(255,106,0,0.5)] transition-all duration-300 border border-white/20 animate-gradient",
                    isActive ? "opacity-100" : "opacity-90 hover:opacity-100"
                  )}
                >
                  <Icon size={28} color="#FFFFFF" strokeWidth={1.5} />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center w-14 h-full relative group"
            >
              <motion.div
                animate={{ 
                  y: isActive ? -12 : 0,
                  scale: isActive ? 1.15 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300",
                  isActive
                    ? "bg-white/10 shadow-inner"
                    : "bg-transparent opacity-50 group-hover:opacity-100"
                )}
              >
                <Icon size={24} color={isActive ? primaryColor : "#FFFFFF"} strokeWidth={1.5} />
              </motion.div>
              
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="text-[10px] font-bold absolute bottom-1.5 tracking-wide"
                    style={{ color: primaryColor }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function VendedorNavigator() {
  return <NavItems items={vendedorNav} mode="vendedor" />;
}

function AlunoNavigator() {
  return <NavItems items={alunoNav} mode="aluno" />;
}

export function BottomNav() {
  const pathname = usePathname();
  const { mode } = useMode();

  // Hide bottom nav on specific screens like login or player
  if (pathname === "/login" || pathname.includes("/player")) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex justify-center w-full pb-[env(safe-area-inset-bottom)]">
      {mode === "vendedor" ? <VendedorNavigator key="vendedor" /> : <AlunoNavigator key="aluno" />}
    </div>
  );
}
