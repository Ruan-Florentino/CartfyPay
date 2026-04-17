"use client";

import { motion } from "motion/react";
import { ChevronLeft, Package, DollarSign, Image as ImageIcon, AlignLeft, Users, Percent, ShieldCheck, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/auth-context";
import { GoogleGenAI } from "@google/genai";

export default function CriarProduto() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    tipo: "Curso Online",
    preco: "",
    garantia: "7 dias",
    descricao: "",
    imagem: "",
    afiliadosHabilitado: false,
    comissao: ""
  });

  const steps = [
    { id: 1, title: "Básico", icon: Package },
    { id: 2, title: "Preço", icon: DollarSign },
    { id: 3, title: "Detalhes", icon: AlignLeft },
    { id: 4, title: "Afiliados", icon: Users },
  ];

  const generateWithAi = async () => {
    if (!aiPrompt) return;
    setLoadingAi(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const prompt = `
        Crie um produto digital focado em alta conversão. O nicho/ideia do usuário é: "${aiPrompt}".
        Você deve formatar a saída estritamente em um JSON sem formatação markdown (apenas chaves) no formato:
        {
          "nome": "Título Magnético do Produto",
          "tipo": "Um dos seguintes: Curso Online, E-book, Mentoria, Assinatura",
          "preco": "Valor numérico real em string, ex: 197,00",
          "garantia": "Um dos seguintes: 7 dias, 15 dias, 30 dias",
          "descricao": "Uma super copy foda descritiva do produto que gere urgência",
          "imagem": "URL simulada de capa gerada em https://picsum.photos/seed/PRODUTO/400/600 onde PRODUTO é uma palavra que represente o nicho",
          "afiliadosHabilitado": true,
          "comissao": "Porcentagem da comissão atrativa, número real em string, ex: 50"
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            temperature: 0.8,
            responseMimeType: "application/json"
        }
      });
      
      const json = JSON.parse(response.text || "{}");
      if (json.nome) {
         setFormData({
            nome: json.nome || formData.nome,
            tipo: json.tipo || formData.tipo,
            preco: json.preco || formData.preco,
            garantia: json.garantia || formData.garantia,
            descricao: json.descricao || formData.descricao,
            imagem: json.imagem || formData.imagem,
            afiliadosHabilitado: json.afiliadosHabilitado || formData.afiliadosHabilitado,
            comissao: json.comissao || formData.comissao
         });
         setStep(2); // Avança pra mostrar que preencheu
      }
    } catch (e) {
      console.error(e);
      alert("Falha ao gerar produto.");
    } finally {
      setLoadingAi(false);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSave = async () => {
    if (!user) {
      alert("Você precisa estar logado para criar um produto.");
      return;
    }

    setLoading(true);
    try {
      const produtosRef = collection(db, `users/${user.uid}/produtos`);
      const prodDoc = await addDoc(produtosRef, {
        ...formData,
        preco: parseFloat(formData.preco.replace(',', '.')) || 0,
        comissao: parseFloat(formData.comissao) || 0,
        createdAt: new Date().toISOString(),
        vendas: 0,
        receita: 0
      });
      
      // Criar a config de checkout atrelada!
      const checkoutRef = collection(db, `checkouts`);
      await addDoc(checkoutRef, {
        userId: user.uid,
        config: {
          productId: prodDoc.id,
          productTitle: formData.nome,
          productDescription: formData.descricao,
          productImage: formData.imagem,
          price: parseFloat(formData.preco.replace(',', '.')) || 0,
          pixels: {
            facebook: true,
            google: false
          },
          orderBump: {
            enabled: false,
            title: "Acesso Vitalício",
            description: "Garanta acesso para sempre a esse material com suporte",
            price: 47
          },
          sections: [
            { id: '1', type: 'header', enabled: true },
            { id: '2', type: 'product', enabled: true },
            { id: '4', type: 'benefits', enabled: true },
            { id: '5', type: 'testimonials', enabled: true },
            { id: '6', type: 'guarantee', enabled: true },
            { id: '7', type: 'payment', enabled: true }
          ]
        }
      });

      router.push('/produtos');
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
        <div className="text-sm font-bold text-[#FF5F00] bg-[#FF5F00]/10 px-3 py-1.5 rounded-full border border-[#FF5F00]/20">
          {step} / {totalSteps}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Progress Steps */}
        <div className="flex justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -z-10 -translate-y-1/2"></div>
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-[#FF5F00] to-[#6C2BFF] -z-10 -translate-y-1/2 transition-all duration-500"
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
                      ? 'bg-gradient-to-br from-[#FF5F00] to-[#FF8C00] text-white shadow-[0_0_15px_rgba(255,106,0,0.4)] scale-110' 
                      : isCompleted 
                        ? 'bg-[#6C2BFF] text-white' 
                        : 'bg-[#111118] border border-white/10 text-zinc-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                </div>
                <span className={`text-[10px] font-bold ${isActive ? 'text-[#FF5F00]' : isCompleted ? 'text-zinc-300' : 'text-zinc-600'}`}>
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
              <div className="bg-gradient-to-br from-[#6C2BFF]/20 to-[#FF5F00]/20 p-5 rounded-2xl border border-white/10 mb-6">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-[#FF5F00]" /> 
                  Gerar com Inteligência Artificial
                </h3>
                <p className="text-xs text-zinc-400 mb-4">
                  Descreva qual será o seu produto e deixe a IA cuidar do resto (Copy, Estrutura, Preço).
                </p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ex: Um curso sobre vender bolo no pote pelo Instagram"
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6C2BFF]"
                  />
                  <button 
                    onClick={generateWithAi}
                    disabled={loadingAi || !aiPrompt}
                    className="bg-[#6C2BFF] hover:bg-[#5a24d6] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {loadingAi ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    <span className="hidden sm:inline">Gerar Automático</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-white/10 flex-1"></div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Ou preencha manualmente</span>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>

              <h2 className="text-xl font-bold text-white mb-6">Informações Básicas</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Nome do Produto</label>
                <input 
                  type="text" 
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: Curso Mestre em Vendas" 
                  className="w-full bg-[#0B0B0F] border border-white/10 rounded-2xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF5F00] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Tipo de Produto</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Curso Online', 'E-book', 'Mentoria', 'Assinatura'].map(tipo => (
                    <button 
                      key={tipo}
                      onClick={() => setFormData({...formData, tipo})}
                      className={formData.tipo === tipo 
                        ? "bg-gradient-to-br from-[#FF5F00]/20 to-transparent border border-[#FF5F00] p-4 rounded-2xl text-white font-bold text-sm text-center"
                        : "bg-[#0B0B0F] border border-white/10 p-4 rounded-2xl text-zinc-400 font-bold text-sm text-center hover:border-white/20 transition-colors"
                      }
                    >
                      {tipo}
                    </button>
                  ))}
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
                    value={formData.preco}
                    onChange={(e) => setFormData({...formData, preco: e.target.value})}
                    placeholder="0,00" 
                    className="w-full bg-[#0B0B0F] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF5F00] transition-colors text-lg font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Garantia</label>
                <select 
                  value={formData.garantia}
                  onChange={(e) => setFormData({...formData, garantia: e.target.value})}
                  className="w-full bg-[#0B0B0F] border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#FF5F00] transition-colors appearance-none"
                >
                  <option value="7 dias">7 dias</option>
                  <option value="15 dias">15 dias</option>
                  <option value="30 dias">30 dias</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Detalhes</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Imagem da Capa (URL)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                  <input 
                    type="text" 
                    value={formData.imagem}
                    onChange={(e) => setFormData({...formData, imagem: e.target.value})}
                    placeholder="https://..." 
                    className="w-full bg-[#0B0B0F] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF5F00] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">Descrição</label>
                <textarea 
                  rows={4}
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descreva o seu produto..." 
                  className="w-full bg-[#0B0B0F] border border-white/10 rounded-2xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF5F00] transition-colors resize-none"
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
                <button 
                  onClick={() => setFormData({...formData, afiliadosHabilitado: !formData.afiliadosHabilitado})}
                  className={`w-12 h-7 rounded-full p-1 transition-colors relative ${formData.afiliadosHabilitado ? 'bg-[#FF5F00]' : 'bg-zinc-700'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-md transition-all ${formData.afiliadosHabilitado ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>

              {formData.afiliadosHabilitado && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-300">Comissão (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input 
                      type="number" 
                      value={formData.comissao}
                      onChange={(e) => setFormData({...formData, comissao: e.target.value})}
                      placeholder="50" 
                      className="w-full bg-[#0B0B0F] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF5F00] transition-colors text-lg font-bold"
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">
                    O afiliado receberá R$ {((parseFloat(formData.preco.replace(',', '.')) || 0) * ((parseFloat(formData.comissao) || 0) / 100)).toFixed(2)} por venda.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
          {step > 1 && (
            <button 
              onClick={prevStep}
              disabled={loading}
              className="flex-1 bg-[#111118] border border-white/10 py-4 rounded-2xl font-bold text-white hover:bg-zinc-900 transition-colors shadow-lg disabled:opacity-50"
            >
              Voltar
            </button>
          )}
          <button 
            onClick={step === totalSteps ? handleSave : nextStep}
            disabled={loading}
            className="flex-[2] bg-gradient-to-r from-[#FF5F00] to-[#FF8C00] py-4 rounded-2xl font-bold text-white shadow-[0_8px_20px_rgba(255,106,0,0.3)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {step === totalSteps ? "Finalizar Criação" : "Avançar"}
          </button>
        </div>
      </div>
    </div>
  );
}
