"use client";

import { motion, AnimatePresence } from "motion/react";
import { Play, ChevronLeft, Search, Filter, CheckCircle2, BookOpen, Clock, Star, Heart, Sparkles, TrendingUp, Zap, Crown } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useMode } from "@/lib/mode-context";
import { useRouter } from "next/navigation";

export default function MembersArea() {
  const { mode } = useMode();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("Todos");
  
  useEffect(() => {
    if (mode === 'vendedor') {
      router.push('/');
    }
  }, [mode, router]);

  const [searchQuery, setSearchQuery] = useState("");

  const filters = ["Todos", "Em andamento", "Concluídos", "Favoritos"];

  const courses = [
    {
      id: 1,
      title: "Mestre em Vendas Online",
      instructor: "João Silva",
      progress: 75,
      image: "https://picsum.photos/seed/curso1/400/200",
      modules: 12,
      completed: 9,
      duration: "18h 30m",
      rating: 4.9,
      badge: "Popular",
      isFavorite: true,
      status: "Em andamento"
    },
    {
      id: 2,
      title: "Gatilhos Mentais Avançados",
      instructor: "Ana Costa",
      progress: 100,
      image: "https://picsum.photos/seed/curso3/400/200",
      modules: 5,
      completed: 5,
      duration: "6h 15m",
      rating: 5.0,
      badge: "Premium",
      isFavorite: false,
      status: "Concluídos"
    },
    {
      id: 3,
      title: "Mentoria VIP - Escala",
      instructor: "João Silva",
      progress: 10,
      image: "https://picsum.photos/seed/curso2/400/200",
      modules: 20,
      completed: 2,
      duration: "45h 00m",
      rating: 4.8,
      badge: "Novo",
      isFavorite: true,
      status: "Em andamento"
    },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesFilter = activeFilter === "Todos" || 
                          (activeFilter === "Favoritos" && course.isFavorite) ||
                          course.status === activeFilter;
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = course.title.toLowerCase().includes(searchLower) ||
                          course.instructor.toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'Novo': return <Sparkles size={12} className="text-blue-400" />;
      case 'Popular': return <TrendingUp size={12} className="text-pink-400" />;
      case 'Premium': return <Crown size={12} className="text-[#FFD700]" />;
      case 'Atualizado': return <Zap size={12} className="text-emerald-400" />;
      default: return null;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Novo': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Popular': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'Premium': return 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30';
      case 'Atualizado': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-white/10 text-white border-white/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] pb-32 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-gradient-to-b from-[#6C2BFF]/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="p-6 pt-12 flex items-center justify-between sticky top-0 bg-black/40 backdrop-blur-2xl z-40 border-b border-white/10 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.02em] tracking-tight text-white">Meus Cursos</h1>
          <p className="text-zinc-400 text-sm mt-1 font-medium">Continue aprendendo</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all text-[#FF5F00] hover:shadow-[0_0_20px_rgba(255,95,0,0.15)]"
        >
          <Filter size={24} strokeWidth={1.5} />
        </motion.button>
      </div>

      <div className="p-6 space-y-6">
        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5F00]/20 to-[#6C2BFF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#FF5F00] transition-colors" size={20} strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Buscar curso, professor, módulo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF5F00]/50 focus:shadow-[0_0_20px_rgba(255,95,0,0.15)] transition-all text-base shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6 snap-x"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`snap-start shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all border backdrop-blur-md ${
                activeFilter === filter 
                  ? 'bg-gradient-to-r from-[#FF5F00] to-[#FF8C00] text-white border-[#FF8C00]/50 shadow-[0_4px_15px_rgba(255,95,0,0.3)] scale-105' 
                  : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:scale-105'
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Course List */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <Link href={`/cursos/${course.id}`} className="block">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden group hover:border-white/20 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative"
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"></div>

                    {/* Thumbnail */}
                    <div className="relative h-56 w-full overflow-hidden">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-[#111118]/40 to-transparent"></div>
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <div className="w-16 h-16 bg-gradient-to-tr from-[#FF5F00] to-[#FF8C00] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,106,0,0.6)] pl-1 transform group-hover:scale-110 transition-transform duration-300 animate-gradient" style={{ backgroundSize: '200% 200%' }}>
                          <Play size={28} className="text-white" fill="currentColor" strokeWidth={1.5} />
                        </div>
                      </div>

                      {/* Badges Top Left */}
                      <div className="absolute top-4 left-4 flex gap-2 z-20">
                        {course.badge && (
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-[-0.02em] uppercase backdrop-blur-md border flex items-center gap-1 shadow-inner ${getBadgeColor(course.badge)}`}>
                            {getBadgeIcon(course.badge)} {course.badge}
                          </span>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className={`absolute top-4 right-4 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center border transition-colors z-30 shadow-inner ${
                        course.isFavorite 
                          ? 'bg-pink-500/20 border-pink-500/30 text-pink-500' 
                          : 'bg-black/40 border-white/10 text-white hover:bg-white/10'
                      }`}>
                        <Heart size={14} fill={course.isFavorite ? "currentColor" : "none"} strokeWidth={1.5} />
                      </button>

                      {/* Stats Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
                        <div className="flex gap-2">
                          <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10 flex items-center gap-1 shadow-inner">
                            <Clock size={12} className="text-[#FF5F00]" strokeWidth={2} /> {course.duration}
                          </span>
                          <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10 flex items-center gap-1 shadow-inner">
                            <Star size={12} className="text-[#FFD700]" fill="currentColor" strokeWidth={1.5} /> {course.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 relative z-20 bg-transparent">
                      <h3 className="font-bold tracking-[-0.02em] text-xl text-white mb-1 line-clamp-1 group-hover:text-[#FF5F00] transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">{course.title}</h3>
                      <p className="text-zinc-400 text-sm mb-5 font-medium flex items-center gap-1.5">
                        <BookOpen size={14} strokeWidth={1.5} /> {course.instructor}
                      </p>

                      {/* Progress Bar */}
                      <div className="space-y-2.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-zinc-400 bg-white/5 px-2 py-1 rounded-md border border-white/5 shadow-inner">{course.completed} de {course.modules} módulos</span>
                          <span className={`px-2 py-1 rounded-md flex items-center gap-1 border shadow-inner ${course.progress === 100 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-[#6C2BFF] bg-[#6C2BFF]/10 border-[#6C2BFF]/20"}`}>
                            {course.progress === 100 && <CheckCircle2 size={12} strokeWidth={2} />}
                            {course.progress === 100 ? "Concluído" : "Em andamento"}
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-black/50 rounded-full overflow-hidden border border-white/10 p-[1px] shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                            className={`h-full rounded-full relative animate-gradient ${
                              course.progress === 100 ? "bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-gradient-to-r from-[#6C2BFF] to-[#FF5F00] shadow-[0_0_10px_rgba(108,43,255,0.5)]"
                            }`}
                            style={{ backgroundSize: '200% 200%' }}
                          >
                            <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 blur-[2px]"></div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className={`w-full mt-6 font-bold tracking-[-0.02em] text-base py-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${
                        course.progress === 100 
                          ? "bg-white/5 text-white group-hover:bg-white/10 border border-white/10 shadow-inner" 
                          : "bg-gradient-to-r from-[#6C2BFF] to-purple-500 text-white shadow-[0_10px_30px_rgba(108,43,255,0.3)] group-hover:shadow-[0_10px_40px_rgba(108,43,255,0.5)] animate-gradient"
                      }`} style={course.progress !== 100 ? { backgroundSize: '200% 200%' } : {}}>
                        <Play size={20} fill="currentColor" strokeWidth={1.5} />
                        {course.progress === 0 ? "Começar Agora" : course.progress === 100 ? "Assistir Novamente" : "Continuar Assistindo"}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredCourses.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <Search size={32} className="text-zinc-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold tracking-[-0.02em] text-white mb-2">Nenhum curso encontrado</h3>
              <p className="text-zinc-400 text-sm">Tente buscar por outros termos ou limpar os filtros.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
