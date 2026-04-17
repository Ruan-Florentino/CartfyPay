"use client";

import { motion } from "motion/react";
import { Users, Link as LinkIcon, DollarSign, ChevronRight, Trophy, ArrowUpRight, Search, Copy, CheckCircle2, ChevronLeft, Package, Percent } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Afiliados() {
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      if (!user) return;
      try {
        // Fetch checkouts created by this user
        const q = query(collection(db, "checkouts"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        const prods: any[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.config) {
            prods.push({ id: doc.id, ...data.config });
          }
        });
        setProdutos(prods);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, [user]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // In a real app, this would be fetched from Firestore
  const ranking: any[] = [];
  const totalAfiliados = 0;
  const comissoesPagas = 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] pb-32 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-gradient-to-b from-[#FF5F00]/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="p-6 pt-12 flex justify-between items-center sticky top-0 bg-[#0B0B0F]/80 backdrop-blur-xl z-40 border-b border-white/5 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/perfil">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-[#111118] rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <ChevronLeft size={24} className="text-zinc-300" />
            </motion.div>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-[-0.02em] tracking-tight text-white">Afiliados</h1>
            <p className="text-zinc-400 text-sm mt-1 font-medium">Gerencie seus parceiros</p>
          </div>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 bg-[#111118] rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Users size={24} className="text-zinc-300" />
        </motion.button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-6 space-y-8"
      >
        {/* Resumo */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-[#6C2BFF]/20 to-[#6C2BFF]/5 p-5 rounded-3xl border border-[#6C2BFF]/20 relative overflow-hidden group shadow-[0_10px_30px_rgba(108,43,255,0.1)]"
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#6C2BFF]/20 rounded-full blur-2xl group-hover:bg-[#6C2BFF]/30 transition-colors"></div>
          <p className="text-[#6C2BFF] text-xs font-bold mb-1 uppercase tracking-wider">Total Afiliados</p>
          <p className="text-2xl font-bold tracking-[-0.02em] text-white">{totalAfiliados}</p>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 p-5 rounded-3xl border border-emerald-500/20 relative overflow-hidden group shadow-[0_10px_30px_rgba(16,185,129,0.1)]"
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-colors"></div>
          <p className="text-emerald-500 text-xs font-bold mb-1 uppercase tracking-wider">Comissões Pagas</p>
          <p className="text-2xl font-bold tracking-[-0.02em] text-white">R$ {comissoesPagas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </motion.div>
      </motion.div>

      {/* Links de Convite por Produto */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#FF5F00]/10 rounded-xl border border-[#FF5F00]/20">
            <Package size={20} className="text-[#FF5F00]" />
          </div>
          <h3 className="font-bold tracking-[-0.02em] text-xl text-white">Seus Produtos (Links para Afiliados)</h3>
        </div>

        {loading ? (
          <div className="text-zinc-500 text-sm">Carregando produtos...</div>
        ) : produtos.length === 0 ? (
          <div className="bg-[#111118] p-8 rounded-3xl border border-white/5 text-center">
            <Package size={48} className="text-zinc-600 mx-auto mb-4" />
            <h4 className="text-white font-bold text-lg mb-2">Nenhum produto encontrado</h4>
            <p className="text-zinc-500 text-sm mb-4">Crie um produto no Checkout Builder para gerar links de afiliados.</p>
            <Link href="/checkout" className="px-6 py-3 bg-[#FF5F00] text-white rounded-xl font-bold inline-block hover:opacity-90 transition-opacity">
              Criar Produto
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {produtos.map((produto) => {
              const affiliateLink = `https://cartfy.com/c/${produto.id}?ref=${user?.uid}`;
              return (
                <div key={produto.id} className="bg-[#111118] p-5 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group hover:border-white/10 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white text-lg">{produto.productTitle}</h4>
                      <p className="text-zinc-500 text-sm">Preço: R$ {produto.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-[#0B0B0F] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-400 truncate max-w-[200px] md:max-w-[300px] font-mono">
                        {affiliateLink}
                      </div>
                      <button 
                        onClick={() => handleCopy(affiliateLink)}
                        className="p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors border border-white/10"
                        title="Copiar Link de Afiliado"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Ranking */}
      <motion.div variants={itemVariants}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20">
              <Trophy size={20} className="text-[#FFD700]" />
            </div>
            <h3 className="font-bold tracking-[-0.02em] text-xl text-white">Ranking Top 10</h3>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#6C2BFF] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Buscar afiliado..." 
              className="bg-[#111118] border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#6C2BFF]/50 focus:ring-1 focus:ring-[#6C2BFF]/50 transition-all w-40 shadow-lg"
            />
          </div>
        </div>

        <div className="space-y-3">
          {ranking.length === 0 ? (
            <div className="bg-[#111118] p-8 rounded-3xl border border-white/5 text-center">
              <Users size={48} className="text-zinc-600 mx-auto mb-4" />
              <h4 className="text-white font-bold text-lg mb-2">Nenhum afiliado ainda</h4>
              <p className="text-zinc-500 text-sm">Compartilhe seu link de convite para começar a recrutar afiliados.</p>
            </div>
          ) : (
            ranking.map((afiliado, index) => (
              <motion.div 
                key={afiliado.id} 
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="bg-[#111118] p-4 rounded-3xl border border-white/5 flex items-center gap-4 shadow-xl relative overflow-hidden group cursor-pointer hover:border-white/10 transition-colors"
              >
                {index < 3 && (
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${index === 0 ? 'bg-gradient-to-b from-[#FFD700] to-[#FFD700]/50' : index === 1 ? 'bg-gradient-to-b from-[#C0C0C0] to-[#C0C0C0]/50' : 'bg-gradient-to-b from-[#CD7F32] to-[#CD7F32]/50'}`}></div>
                )}
                
                <div className="w-8 text-center font-bold tracking-[-0.02em] text-zinc-500 text-xl pl-2">
                  {index + 1}º
                </div>
                
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 shrink-0 shadow-inner relative">
                  <img src={afiliado.avatar} alt={afiliado.nome} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-white text-base truncate group-hover:text-[#6C2BFF] transition-colors">{afiliado.nome}</h4>
                    {afiliado.badge && (
                      <span className={`text-[10px] font-bold tracking-[-0.02em] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        afiliado.badge === 'Ouro' ? 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 shadow-[0_0_10px_rgba(255,215,0,0.1)]' :
                        afiliado.badge === 'Prata' ? 'bg-[#C0C0C0]/10 text-[#C0C0C0] border border-[#C0C0C0]/20 shadow-[0_0_10px_rgba(192,192,192,0.1)]' :
                        'bg-[#CD7F32]/10 text-[#CD7F32] border border-[#CD7F32]/20 shadow-[0_0_10px_rgba(205,127,50,0.1)]'
                      }`}>
                        {afiliado.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-500 text-xs font-medium">{afiliado.vendas} vendas realizadas</p>
                </div>
                
                <div className="text-right shrink-0">
                  <p className="font-bold tracking-[-0.02em] text-base text-emerald-500">{afiliado.comissao}</p>
                  <button className="text-[#6C2BFF] text-[10px] font-bold mt-1 hover:underline flex items-center justify-end gap-0.5 w-full">
                    Ver detalhes <ChevronRight size={10} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
      </motion.div>
    </div>
  );
}
