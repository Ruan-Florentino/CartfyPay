"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  rightElement?: ReactNode;
  sticky?: boolean;
  gradient?: string;
}

export function PageHeader({ 
  title, 
  subtitle, 
  backHref, 
  rightElement, 
  sticky = true,
  gradient
}: PageHeaderProps) {
  return (
    <div 
      className={cn(
        "safe-top flex items-center justify-between p-6 z-40 relative",
        sticky && "sticky top-0 bg-[#0B0B0F]/80 backdrop-blur-xl border-b border-white/5",
        gradient && `bg-gradient-to-b ${gradient}`
      )}
    >
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4"
      >
        {backHref && (
          <Link 
            href={backHref} 
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
          {subtitle && (
            <p className="text-sm font-medium text-zinc-400 mt-1">{subtitle}</p>
          )}
        </div>
      </motion.div>
      
      {rightElement && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {rightElement}
        </motion.div>
      )}
    </div>
  );
}
