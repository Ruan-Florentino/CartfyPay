"use client";

import { motion } from "motion/react";
import { Mail, Lock, ArrowRight, Apple } from "lucide-react";
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] flex flex-col justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#FF6A00]/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#6C2BFF]/20 rounded-full blur-[100px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto space-y-8"
      >
        {/* Logo */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#FF6A00] to-[#FF8C00] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(255,106,0,0.4)]">
            <span className="text-white font-black text-3xl tracking-tighter">C</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Cartfy</h1>
          <p className="text-zinc-400 text-sm">A plataforma premium para seus infoprodutos.</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-300 ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full bg-[#111118] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6A00] transition-colors text-base shadow-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-300 ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#111118] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6A00] transition-colors text-base shadow-lg"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button className="text-[#FF6A00] text-sm font-semibold hover:underline">
              Esqueceu a senha?
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-4">
          <Link href="/">
            <button className="w-full bg-gradient-to-r from-[#FF6A00] to-[#FF8C00] text-white font-bold text-lg py-4 rounded-2xl shadow-[0_8px_30px_rgba(255,106,0,0.4)] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              Entrar na conta <ArrowRight size={20} />
            </button>
          </Link>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-zinc-500 text-xs font-medium uppercase tracking-wider">Ou continue com</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="bg-[#111118] border border-white/10 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold text-white hover:bg-zinc-900 transition-colors shadow-lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className="bg-[#111118] border border-white/10 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold text-white hover:bg-zinc-900 transition-colors shadow-lg">
              <Apple size={20} fill="currentColor" />
              Apple
            </button>
          </div>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-8">
          Ainda não tem uma conta? <Link href="#" className="text-[#FF6A00] font-bold hover:underline">Criar conta</Link>
        </p>
      </motion.div>
    </div>
  );
}
