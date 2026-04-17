"use client";

import { motion } from "motion/react";
import { Search, Award, Star, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";

const MarketplaceCard = ({ course }: { course: any }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/5 backdrop-blur-xl p-4 rounded-[2rem] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] hover:border-white/20 relative overflow-hidden group transition-all"
    >
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4 shadow-inner">
        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-[-0.02em] text-white border border-white/10 uppercase tracking-wider">
          {course.category}
        </div>
        <button 
          onClick={() => setIsFavorited(!isFavorited)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 transition-all hover:scale-110 ${isFavorited ? 'text-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]' : 'text-white hover:text-pink-500'}`}
        >
          <Heart size={16} fill={isFavorited ? "currentColor" : "none"} strokeWidth={1.5} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-bold tracking-[-0.02em] text-white text-lg leading-tight group-hover:text-[#7C3AED] transition-colors line-clamp-1">{course.title}</h3>
          <p className="text-zinc-400 text-xs font-bold flex items-center gap-1 mt-1">
            <Award size={12} className="text-[#7C3AED]" strokeWidth={2} /> {course.producer}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-zinc-300 text-xs font-bold bg-white/5 px-2 py-1 rounded-lg border border-white/10">
            <Star size={14} className="text-amber-400" fill="currentColor" /> {course.rating}
            <span className="text-zinc-500 font-medium">({course.sales})</span>
          </div>
          <p className="text-white font-bold tracking-[-0.02em] text-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">R$ {course.price}</p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white py-3.5 rounded-2xl text-sm font-bold tracking-[-0.02em] shadow-[0_10px_30px_rgba(124,58,237,0.4)] transition-all flex items-center justify-center gap-2 animate-gradient"
          style={{ backgroundSize: '200% 200%' }}
        >
          <ShoppingCart size={18} strokeWidth={2} /> COMPRAR AGORA
        </motion.button>
      </div>
    </motion.div>
  );
};

export function ProdutosAlunoScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const categories = ["Todos", "Marketing", "Vendas", "Dropshipping", "Marketing Digital", "Desenvolvimento Pessoal", "Negócios"];

  const marketplaceCourses = [
    { id: 1, title: "Curso Marketing Digital", producer: "João Silva", price: "197,00", sales: "1.2k", rating: 4.8, thumbnail: "https://picsum.photos/seed/marketing/400/300", category: "Marketing" },
    { id: 2, title: "Mestre das Vendas", producer: "Carlos Eduardo", price: "97,00", sales: "850", rating: 4.9, thumbnail: "https://picsum.photos/seed/vendas/400/300", category: "Vendas" },
    { id: 3, title: "Dropshipping do Zero", producer: "Ana Clara", price: "297,00", sales: "2.1k", rating: 4.7, thumbnail: "https://picsum.photos/seed/drop/400/300", category: "E-commerce" },
    { id: 4, title: "Copywriting de Elite", producer: "Pedro Santos", price: "147,00", sales: "540", rating: 5.0, thumbnail: "https://picsum.photos/seed/copy/400/300", category: "Copywriting" },
  ];

  const filteredMarketplace = marketplaceCourses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (selectedCategory === "Todos" || c.category === selectedCategory)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen pb-32">
      <div className="p-6 pt-12 flex justify-between items-center sticky top-0 bg-black/40 backdrop-blur-2xl z-40 border-b border-white/10 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.02em] tracking-tight text-white">Marketplace</h1>
          <p className="text-zinc-400 text-sm mt-1 font-medium">Encontre os melhores cursos</p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-6 space-y-6"
      >
        <motion.div variants={itemVariants} className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#7C3AED] transition-colors" size={20} strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Buscar no marketplace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#7C3AED]/50 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all text-base shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-6 px-6 snap-x">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`snap-start shrink-0 px-6 py-2.5 rounded-xl text-xs font-bold tracking-[-0.02em] uppercase tracking-widest transition-all border backdrop-blur-md ${
                selectedCategory === cat 
                  ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-[0_5px_15px_rgba(124,58,237,0.4)] scale-105' 
                  : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:scale-105'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          {filteredMarketplace.map((course) => (
            <MarketplaceCard key={course.id} course={course} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
