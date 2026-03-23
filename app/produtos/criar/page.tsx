"use client";

import { motion } from "motion/react";
import { ChevronLeft, Package, DollarSign, Image as ImageIcon, AlignLeft, Users, Percent, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CriarProduto() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const steps = [
    { id: 1, title: "Básico", icon: Package },
    { id: 2, title: "Preço", icon: DollarSign },
    { id: 3, title: "Detalhes", icon: AlignLeft },
    { id: 4, title: "Afiliados", icon: Users },
  ];

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="bg-[#0B0B0F] min-h-screen pb-32">
      {/* Header */}
      <div className="p-6 pt-8 flex items-center justify-between sticky top-0 bg-[#0B0B0F]/90 backdrop-blur-md z-40 border-b border-white/5">
        <div className="flex items-center gap-4">
          <Link href="/produtos" className="p-3 bg-[#111118] rounded-2xl border border-white/5 shadow-lg">
            <ChevronLeft size={20} className="text-zinc-300" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight">Criar Produto</h1>
        </div>
        <div className="text-sm font-bold text-[#FF6A00] bg-[#FF6A00]/10 px-3 py-1.5 rounded-full border border-[#FF6A00]/20">
          {step} / {totalSteps}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Progress Steps */}
        <div className="flex justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -z-10 -translate-y-1/2"></div>
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-[#FF6A00] to-[#6C2BFF] -z-10 -translate-y-1/2 transition-all duration-500"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
          
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isCompleted = step > s.id;
            
            return (
              <div key={s.id} className="flex flex-col items-center gap-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-br from-[#FF6A00] to-[#FF8C00] text-white shadow-[0_0_15px_rgba(255,106,0,0.4)] scale-110' 
                      : isCompleted 
                        ? 'bg-[#6C2BFF] text-white' 
                        : 'bg-[#111118] border border-white/10 text-zinc-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                </div>
                <span className={`text-[10px] font-bold ${isActive ? 'text-[#FF6A00]' : isCompleted ? 'text-zinc-300' : 'text-zinc-600'}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-[#111118] p-6 rounded-3xl border border-white/5 shadow-xl"
        >
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Informações Básicas</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Nome do Produto</label>
                <input 
                  type="text" 
                  placeholder="Ex: Curso Mestre em Vendas" 
                  className="w-full bg-[#0B0B0F] border border-white/10 rounded-2xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6A00] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Tipo de Produto</label>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-gradient-to-br from-[#FF6A00]/20 to-transparent border border-[#FF6A00] p-4 rounded-2xl text-white font-bold text-sm text-center">
                    Curso Online
                  </button>
                  <button className="bg-[#0B0B0F] border border-white/10 p-4 rounded-2xl text-zinc-400 font-bold text-sm text-center hover:border-white/20 transition-colors">
                    E-book
                  </button>
                  <button className="bg-[#0B0B0F] border border-white/10 p-4 rounded-2xl text-zinc-400 font-bold text-sm text-center hover:border-white/20 transition-colors">
                    Mentoria
                  </button>
                  <button className="bg-[#0B0B0F] border border-white/10 p-4 rounded-2xl text-zinc-400 font-bold text-sm text-center hover:border-white/20 transition-colors">
                    Assinatura
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Precificação</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Preço (R$)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                  <input 
                    type="text" 
                    placeholder="0,00" 
                    className="w-full bg-[#0B0B0F] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6A00] transition-colors text-lg font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Garantia</label>
                <select className="w-full bg-[#0B0B0F] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#FF6A00] transition-colors appearance-none">
                  <option>7 dias</option>
                  <option>15 dias</option>
                  <option>30 dias</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Detalhes</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Imagem da Capa</label>
                <div className="w-full h-40 bg-[#0B0B0F] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#FF6A00]/50 transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-[#111118] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ImageIcon size={24} className="text-zinc-500 group-hover:text-[#FF6A00]" />
                  </div>
                  <span className="text-sm font-medium text-zinc-500">Toque para fazer upload</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Descrição</label>
                <textarea 
                  rows={4}
                  placeholder="Descreva o seu produto..." 
                  className="w-full bg-[#0B0B0F] border border-white/10 rounded-2xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6A00] transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Programa de Afiliados</h2>
              
              <div className="flex items-center justify-between p-4 bg-[#0B0B0F] border border-white/10 rounded-2xl">
                <div>
                  <h3 className="font-bold text-white text-sm">Habilitar Afiliados</h3>
                  <p className="text-zinc-500 text-xs mt-1">Permitir que outros vendam seu produto.</p>
                </div>
                <button className="w-12 h-7 bg-[#FF6A00] rounded-full p-1 transition-colors relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-1 top-1 shadow-md"></div>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Comissão (%)</label>
                <div className="relative">
                  <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                  <input 
                    type="number" 
                    placeholder="50" 
                    className="w-full bg-[#0B0B0F] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6A00] transition-colors text-lg font-bold"
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2">O afiliado receberá R$ 248,50 por venda.</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
          {step > 1 && (
            <button 
              onClick={prevStep}
              className="flex-1 bg-[#111118] border border-white/10 py-4 rounded-2xl font-bold text-white hover:bg-zinc-900 transition-colors shadow-lg"
            >
              Voltar
            </button>
          )}
          <button 
            onClick={step === totalSteps ? () => window.location.href = '/produtos' : nextStep}
            className="flex-[2] bg-gradient-to-r from-[#FF6A00] to-[#FF8C00] py-4 rounded-2xl font-bold text-white shadow-[0_8px_20px_rgba(255,106,0,0.3)] hover:opacity-90 transition-opacity"
          >
            {step === totalSteps ? "Finalizar Criação" : "Avançar"}
          </button>
        </div>
      </div>
    </div>
  );
}
