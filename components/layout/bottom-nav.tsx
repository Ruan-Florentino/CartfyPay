"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, DollarSign, User, PlayCircle, Download, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMode } from "@/lib/mode-context";
import { motion, AnimatePresence } from "motion/react";

export function BottomNav() {
  const pathname = usePathname();
  const { mode } = useMode();

  const vendedorNav = [
    { name: "Início", href: "/", icon: Home },
    { name: "Produtos", href: "/produtos", icon: Package },
    { name: "Checkout", href: "/checkout", icon: ShoppingCart },
    { name: "Vendas", href: "/vendas", icon: DollarSign },
    { name: "Comunidade", href: "/comunidade", icon: Users },
    { name: "Perfil", href: "/perfil", icon: User },
  ];

  const alunoNav = [
    { name: "Início", href: "/", icon: Home },
    { name: "Cursos", href: "/cursos", icon: PlayCircle },
    { name: "Downloads", href: "/downloads", icon: Download },
    { name: "Comunidade", href: "/comunidade", icon: Users },
    { name: "Perfil", href: "/perfil", icon: User },
  ];

  const navItems = mode === "vendedor" ? vendedorNav : alunoNav;

  // Hide bottom nav on specific screens like login or player
  if (pathname === "/login" || pathname.includes("/player")) {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 flex justify-center pb-[env(safe-area-inset-bottom)] px-2 mb-4">
      <div className="w-full max-w-[400px] bg-[#111118]/80 backdrop-blur-2xl border border-white/10 px-4 py-3 flex justify-between items-center rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
        <AnimatePresence mode="popLayout">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center gap-1 group relative"
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -inset-2 bg-gradient-to-tr from-[#FF6A00]/20 to-[#6C2BFF]/20 rounded-full blur-md -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <motion.div
                  animate={{ 
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -8 : 0,
                    backgroundColor: isActive ? "#FF6A00" : "transparent",
                    color: isActive ? "#FFFFFF" : "#71717A"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cn(
                    "p-2 rounded-full transition-colors duration-300",
                    isActive
                      ? "shadow-[0_0_15px_rgba(255,106,0,0.4)]"
                      : "group-hover:text-zinc-300"
                  )}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                <motion.span
                  animate={{
                    opacity: isActive ? 1 : 0,
                    y: isActive ? 0 : 8,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cn(
                    "text-[10px] font-bold absolute -bottom-4",
                    isActive ? "text-white" : "text-zinc-500"
                  )}
                >
                  {item.name}
                </motion.span>
              </Link>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
