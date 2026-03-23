"use client";

import { motion } from "motion/react";
import { MessageSquare, Heart, Share2, MoreHorizontal, Image as ImageIcon, Send, Sparkles, Flame, Trophy, Award, Pin, Trash2, Edit2, BellRing } from "lucide-react";
import { useState } from "react";
import { useMode } from "@/lib/mode-context";

export default function Comunidade() {
  const { mode } = useMode();
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [isNotice, setIsNotice] = useState(false);

  const posts = [
    {
      id: 1,
      author: "João Silva",
      role: "Professor",
      avatar: "https://i.pravatar.cc/150?img=11",
      time: "Há 2 horas",
      content: "Nova aula liberada no módulo de Tráfego Pago! Confiram as atualizações da plataforma de anúncios. Deixem nos comentários o que acharam da nova interface.",
      likes: 156,
      comments: 32,
      hasImage: true,
      image: "https://picsum.photos/seed/ads/800/400",
      badges: ["Autor"],
      isPinned: true,
      isNotice: true,
    },
    {
      id: 2,
      author: "Carlos Eduardo",
      role: "Aluno",
      avatar: "https://i.pravatar.cc/150?img=33",
      time: "Há 5 horas",
      content: "Pessoal, acabei de aplicar a estratégia do módulo 3 e já fiz minha primeira venda! Muito obrigado João pelo conteúdo incrível. Alguém mais teve resultados rápidos assim?",
      likes: 24,
      comments: 5,
      hasImage: false,
      badges: ["Primeira Venda"],
      isPinned: false,
      isNotice: false,
    },
    {
      id: 3,
      author: "Beatriz Lima",
      role: "Aluna",
      avatar: "https://i.pravatar.cc/150?img=44",
      time: "Ontem",
      content: "Alguém tem alguma dica para melhorar a conversão do checkout? Minha taxa de abandono está alta e não sei mais o que testar.",
      likes: 12,
      comments: 8,
      hasImage: false,
      badges: ["Top Contribuidor"],
      isPinned: false,
      isNotice: false,
    },
  ];

  const handleLike = (id: number) => {
    if (likedPosts.includes(id)) {
      setLikedPosts(likedPosts.filter(postId => postId !== id));
    } else {
      setLikedPosts([...likedPosts, id]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] pb-32 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-gradient-to-b from-[#6C2BFF]/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      <div className="p-6 pt-12 flex justify-between items-center sticky top-0 bg-[#0B0B0F]/80 backdrop-blur-2xl z-40 border-b border-white/5 shadow-sm">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Comunidade</h1>
          <p className="text-zinc-400 text-sm mt-1 font-medium">
            {mode === "vendedor" ? "Gerencie a comunidade dos seus alunos." : "Interaja com outros alunos e professores."}
          </p>
        </div>
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6C2BFF]/20 to-purple-500/20 border border-[#6C2BFF]/30 flex items-center justify-center shadow-[0_0_15px_rgba(108,43,255,0.3)]"
        >
          <Users size={24} className="text-[#6C2BFF]" />
        </motion.div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Create Post - Only for Vendedor or specific rules */}
        {mode === "vendedor" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111118]/80 backdrop-blur-xl p-5 rounded-[28px] border border-white/10 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#FF5F00]/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#FF5F00]/30 shadow-[0_0_15px_rgba(255,95,0,0.2)]">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <textarea
                  placeholder="Compartilhe um aviso ou conteúdo com seus alunos..."
                  className="w-full bg-transparent border-none outline-none text-white placeholder:text-zinc-500 text-base resize-none min-h-[60px] pt-2"
                />
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                <div className="flex gap-2">
                  <button className="text-zinc-400 hover:text-[#FF5F00] transition-colors p-2.5 rounded-2xl hover:bg-[#FF5F00]/10 flex items-center gap-2 group/btn">
                    <ImageIcon size={20} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setIsNotice(!isNotice)}
                    className={`transition-colors p-2.5 rounded-2xl flex items-center gap-2 group/btn ${isNotice ? 'text-yellow-500 bg-yellow-500/10' : 'text-zinc-400 hover:text-yellow-500 hover:bg-yellow-500/10'}`}
                  >
                    <BellRing size={20} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-[#FF5F00] to-[#FF8C00] text-white px-6 py-2.5 rounded-2xl text-sm font-bold shadow-[0_5px_20px_rgba(255,95,0,0.4)] hover:shadow-[0_5px_25px_rgba(255,95,0,0.6)] transition-all flex items-center gap-2"
                >
                  <span>Publicar</span>
                  <Send size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Feed */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {posts.map((post) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              className={`bg-[#111118]/80 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border ${post.isPinned ? 'border-[#FF5F00]/30' : 'border-white/10'} shadow-xl hover:border-white/20 transition-colors relative overflow-hidden group`}
            >
              {/* Pinned Indicator */}
              {post.isPinned && (
                <div className="absolute top-0 right-0 bg-[#FF5F00]/20 text-[#FF5F00] text-[10px] font-bold px-3 py-1 rounded-bl-2xl flex items-center gap-1">
                  <Pin size={12} /> Fixado
                </div>
              )}

              {/* Notice Indicator */}
              {post.isNotice && (
                <div className="absolute top-0 left-0 bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-3 py-1 rounded-br-2xl flex items-center gap-1">
                  <BellRing size={12} /> Aviso
                </div>
              )}

              {/* Post Header */}
              <div className={`flex justify-between items-start mb-4 relative z-10 ${post.isPinned || post.isNotice ? 'mt-4' : ''}`}>
                <div className="flex gap-3 items-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white/10">
                      <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" />
                    </div>
                    {post.role === 'Professor' && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-tr from-[#FF5F00] to-[#FF8C00] rounded-full flex items-center justify-center border-2 border-[#111118] shadow-lg">
                        <Award size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-white text-sm sm:text-base">{post.author}</h4>
                      {post.badges.map((badge, i) => (
                        <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-zinc-300 border border-white/10 flex items-center gap-1">
                          {badge === 'Primeira Venda' && <Flame size={10} className="text-orange-500" />}
                          {badge === 'Top Contribuidor' && <Trophy size={10} className="text-yellow-500" />}
                          {badge}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-xs mt-0.5 font-medium">
                      <span className={post.role === 'Professor' ? 'text-[#FF5F00]' : ''}>{post.role}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                </div>
                
                {/* Seller Actions */}
                {mode === "vendedor" && post.role === "Professor" ? (
                  <div className="flex gap-1">
                    <button className="text-zinc-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                      <Edit2 size={16} />
                    </button>
                    <button className="text-zinc-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-500/10">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <button className="text-zinc-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                    <MoreHorizontal size={20} />
                  </button>
                )}
              </div>

              {/* Post Content */}
              <p className="text-zinc-300 text-sm leading-relaxed mb-4 relative z-10">
                {post.content}
              </p>

              {post.hasImage && (
                <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden mb-4 border border-white/5 shadow-inner relative z-10 group/img">
                  <img src={post.image} alt="Post attachment" className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700" />
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-white/5 relative z-10">
                <motion.button 
                  onClick={() => handleLike(post.id)}
                  whileTap={{ scale: 0.9 }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${likedPosts.includes(post.id) ? 'bg-pink-500/10 text-pink-500' : 'text-zinc-400 hover:bg-white/5 hover:text-pink-500'}`}
                >
                  <Heart size={18} className={likedPosts.includes(post.id) ? 'fill-pink-500' : ''} />
                  <span className="text-xs font-bold">{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-zinc-400 hover:bg-[#6C2BFF]/10 hover:text-[#6C2BFF] transition-all"
                >
                  <MessageSquare size={18} />
                  <span className="text-xs font-bold">{post.comments}</span>
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition-all ml-auto"
                >
                  <Share2 size={18} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
