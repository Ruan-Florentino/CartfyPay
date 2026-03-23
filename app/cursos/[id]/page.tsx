"use client";

import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Play, Download, MessageSquare, ChevronRight, Lock, CheckCircle2, Star, Clock, FileText, MoreVertical, Share2, Send } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CoursePlayer() {
  const course = {
    title: "Mestre em Vendas Online",
    progress: 45,
    modules: [
      {
        id: 1,
        title: "Módulo 1: Fundamentos",
        duration: "56m",
        lessons: [
          { id: 101, title: "Aula 1: A mentalidade do vendedor", duration: "15:20", completed: true, locked: false, active: false },
          { id: 102, title: "Aula 2: Entendendo o seu cliente", duration: "22:45", completed: true, locked: false, active: false },
          { id: 103, title: "Aula 3: O funil de vendas", duration: "18:10", completed: false, locked: false, active: true },
        ]
      },
      {
        id: 2,
        title: "Módulo 2: Tráfego Pago",
        duration: "1h 20m",
        lessons: [
          { id: 201, title: "Aula 1: Introdução ao Facebook Ads", duration: "25:00", completed: false, locked: true, active: false },
          { id: 202, title: "Aula 2: Criando sua primeira campanha", duration: "30:15", completed: false, locked: true, active: false },
        ]
      },
      {
        id: 3,
        title: "Módulo 3: Copywriting",
        duration: "45m",
        lessons: [
          { id: 301, title: "Aula 1: Estrutura de uma copy matadora", duration: "20:00", completed: false, locked: true, active: false },
        ]
      }
    ]
  };

  const [activeModule, setActiveModule] = useState<number | null>(course.modules.find(m => m.lessons.some(l => l.active))?.id || 1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showFixedContinue, setShowFixedContinue] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowFixedContinue(true);
      } else {
        setShowFixedContinue(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#0B0B0F] min-h-screen pb-32 relative">
      {/* Video Player Area */}
      <div className="relative w-full aspect-video bg-black sticky top-0 z-40 shadow-2xl overflow-hidden group">
        <img 
          src="https://picsum.photos/seed/video/800/450" 
          alt="Video thumbnail" 
          className={`w-full h-full object-cover transition-all duration-700 ${isPlaying ? 'opacity-100 scale-105' : 'opacity-60 scale-100 group-hover:scale-105'}`} 
        />
        
        {/* Play Button Overlay */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-100 transition-opacity duration-300"
            >
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPlaying(true)}
                className="w-20 h-20 bg-gradient-to-tr from-[#FF6A00] to-[#FF8C00] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,106,0,0.6)] pl-2 transform transition-transform duration-300 group-hover:scale-110"
              >
                <Play size={36} className="text-white" fill="currentColor" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Top Bar over video */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex justify-between items-start z-50">
          <Link href="/cursos">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-white shadow-lg"
            >
              <ChevronLeft size={24} />
            </motion.div>
          </Link>
          <div className="flex gap-3">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-white shadow-lg"
            >
              <Share2 size={18} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 text-white shadow-lg"
            >
              <MoreVertical size={18} />
            </motion.button>
          </div>
        </div>

        {/* Video Progress Bar (Fake) */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "45%" }}
              transition={{ duration: 10, ease: "linear" }}
              className="h-full bg-[#FF6A00] relative"
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,106,0,0.8)]"></div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="p-6 relative">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-gradient-to-b from-[#FF6A00]/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#FF6A00]/10 text-[#FF6A00] px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#FF6A00]/20">Módulo 1</span>
            <span className="bg-[#6C2BFF]/10 text-[#6C2BFF] px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#6C2BFF]/20">Aula 3</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-3 leading-tight">O funil de vendas</h1>
          <p className="text-zinc-400 text-sm leading-relaxed font-medium">Nesta aula você vai aprender como estruturar um funil de vendas de alta conversão para o seu produto digital, maximizando seus lucros e reduzindo o custo de aquisição.</p>
        </motion.div>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 mb-10"
        >
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-[#111118] border border-white/10 py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-white shadow-lg hover:bg-white/5 transition-colors"
          >
            <FileText size={18} className="text-[#6C2BFF]" />
            Material
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-[1.5] bg-gradient-to-r from-[#FF6A00] to-[#FF8C00] py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-black text-white shadow-[0_10px_30px_rgba(255,106,0,0.4)] hover:shadow-[0_10px_40px_rgba(255,106,0,0.6)] transition-shadow"
          >
            Próxima Aula <ChevronRight size={18} />
          </motion.button>
        </motion.div>

        {/* Course Evaluation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#111118] p-5 rounded-3xl border border-white/5 shadow-lg mb-10"
        >
          <h3 className="font-black text-lg text-white mb-3">Avalie esta aula</h3>
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star 
                  size={28} 
                  className={`${(hoverRating || rating) >= star ? 'text-[#FFD700]' : 'text-zinc-600'} transition-colors`} 
                  fill={(hoverRating || rating) >= star ? "currentColor" : "none"} 
                />
              </button>
            ))}
          </div>
          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Deixe um comentário (opcional)..."
              className="w-full bg-[#0B0B0F] border border-white/10 rounded-2xl py-3 px-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF6A00]/50 focus:ring-1 focus:ring-[#FF6A00]/50 transition-all text-sm resize-none h-24"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-3 right-3 w-8 h-8 bg-[#FF6A00] rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,106,0,0.5)]"
            >
              <Send size={14} className="text-white ml-0.5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Modules List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-xl text-white">Conteúdo do Curso</h3>
            <span className="text-sm font-bold text-zinc-500">{course.progress}% concluído</span>
          </div>
          
          {course.modules.map((module, index) => (
            <motion.div 
              key={module.id} 
              initial={false}
              animate={{ 
                backgroundColor: activeModule === module.id ? "rgba(17, 17, 24, 1)" : "rgba(17, 17, 24, 0.5)",
                borderColor: activeModule === module.id ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)"
              }}
              className="rounded-3xl border overflow-hidden shadow-lg transition-colors"
            >
              <button 
                onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
                className="w-full p-5 flex justify-between items-center hover:bg-white/5 transition-colors"
              >
                <div className="text-left flex-1">
                  <h4 className="font-black text-white text-base mb-1">{module.title}</h4>
                  <div className="flex items-center gap-3 text-zinc-500 text-xs font-bold">
                    <span className="flex items-center gap-1"><Play size={10} /> {module.lessons.length} aulas</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {module.duration}</span>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: activeModule === module.id ? 90 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${activeModule === module.id ? 'bg-white/10 text-white' : 'bg-transparent text-zinc-500'}`}
                >
                  <ChevronRight size={18} />
                </motion.div>
              </button>
              
              {/* Lessons Accordion */}
              <AnimatePresence initial={false}>
                {activeModule === module.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden bg-[#0B0B0F]/80"
                  >
                    <div className="p-3 space-y-2">
                      {module.lessons.map((lesson) => (
                        <motion.div 
                          key={lesson.id} 
                          whileHover={!lesson.locked ? { scale: 1.02, x: 4 } : {}}
                          whileTap={!lesson.locked ? { scale: 0.98 } : {}}
                          className={`p-4 rounded-2xl flex items-center gap-4 transition-all ${
                            lesson.active 
                              ? 'bg-gradient-to-r from-[#6C2BFF]/20 to-transparent border border-[#6C2BFF]/30 shadow-[inset_4px_0_0_#6C2BFF]' 
                              : 'hover:bg-white/5 border border-transparent'
                          } ${lesson.locked ? 'opacity-50 grayscale' : 'cursor-pointer'}`}
                        >
                          <div className="shrink-0 relative">
                            {lesson.completed ? (
                              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                <CheckCircle2 size={16} className="text-emerald-400" />
                              </div>
                            ) : lesson.locked ? (
                              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                <Lock size={14} className="text-zinc-500" />
                              </div>
                            ) : lesson.active ? (
                              <div className="w-8 h-8 rounded-full bg-[#6C2BFF]/20 flex items-center justify-center border border-[#6C2BFF]/50">
                                <div className="w-3 h-3 bg-[#6C2BFF] rounded-full animate-pulse shadow-[0_0_10px_#6C2BFF]"></div>
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full border-2 border-zinc-700 flex items-center justify-center">
                                <Play size={10} className="text-zinc-600 ml-0.5" fill="currentColor" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold truncate ${lesson.active ? 'text-white' : 'text-zinc-300'}`}>
                              {lesson.title}
                            </p>
                            <p className="text-zinc-500 text-xs mt-1 font-medium flex items-center gap-1">
                              <Clock size={10} /> {lesson.duration}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Fixed Continue Button */}
      <AnimatePresence>
        {showFixedContinue && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-24 left-4 right-4 z-50"
          >
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#FF6A00] to-[#FF8C00] py-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-black text-white shadow-[0_10px_30px_rgba(255,106,0,0.5)] border border-[#FF6A00]/50 backdrop-blur-md"
            >
              <Play size={18} fill="currentColor" />
              Continuar: O funil de vendas
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
