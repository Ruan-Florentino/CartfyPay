"use client";

import { motion } from "motion/react";
import { Download, FileText, FileSpreadsheet, FileArchive, Search, FolderOpen, ArrowDownToLine, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function Downloads() {
  const [downloading, setDownloading] = useState<number | null>(null);

  const downloads = [
    { id: 1, title: "Planilha de Precificação", type: "excel", size: "2.4 MB", course: "Mestre em Vendas", date: "Há 2 dias", downloaded: false },
    { id: 2, title: "Template de Copywriting", type: "pdf", size: "1.1 MB", course: "Mestre em Vendas", date: "Há 5 dias", downloaded: true },
    { id: 3, title: "E-book Gatilhos Mentais", type: "pdf", size: "5.8 MB", course: "Gatilhos Mentais", date: "12 Mar", downloaded: false },
    { id: 4, title: "Pack de Criativos", type: "zip", size: "124 MB", course: "Mestre em Vendas", date: "05 Mar", downloaded: true },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "pdf": return <FileText size={24} className="text-red-500" />;
      case "excel": return <FileSpreadsheet size={24} className="text-emerald-500" />;
      case "zip": return <FileArchive size={24} className="text-amber-500" />;
      default: return <FileText size={24} className="text-blue-500" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "pdf": return "bg-red-500/10 border-red-500/20 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]";
      case "excel": return "bg-emerald-500/10 border-emerald-500/20 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]";
      case "zip": return "bg-amber-500/10 border-amber-500/20 shadow-[inset_0_0_10px_rgba(245,158,11,0.1)]";
      default: return "bg-blue-500/10 border-blue-500/20 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]";
    }
  };

  const handleDownload = (id: number) => {
    setDownloading(id);
    setTimeout(() => setDownloading(null), 2000);
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

      <div className="p-6 pt-12 flex justify-between items-center sticky top-0 bg-[#0B0B0F]/80 backdrop-blur-xl z-40 border-b border-white/5 shadow-sm">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Downloads</h1>
          <p className="text-zinc-400 text-sm mt-1 font-medium">Materiais complementares dos seus cursos.</p>
        </div>
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6C2BFF]/20 to-purple-500/20 border border-[#6C2BFF]/30 flex items-center justify-center shadow-[0_0_15px_rgba(108,43,255,0.3)]"
        >
          <FolderOpen size={24} className="text-[#6C2BFF]" />
        </motion.div>
      </div>

      <div className="p-6 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#6C2BFF]/20 to-[#FF6A00]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#6C2BFF] transition-colors" size={20} />
            <input
              type="text"
              placeholder="Buscar arquivos..."
              className="w-full bg-[#111118] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#6C2BFF]/50 focus:ring-1 focus:ring-[#6C2BFF]/50 transition-all text-base shadow-inner"
            />
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {downloads.map((file) => (
            <motion.div
              key={file.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#111118] p-4 rounded-3xl border border-white/5 flex items-center justify-between group shadow-lg hover:border-white/10 transition-all relative overflow-hidden cursor-pointer"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

              <div className="flex items-center gap-4 flex-1 min-w-0 relative z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border ${getIconBg(file.type)}`}>
                  {getIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-[#6C2BFF] transition-colors">{file.title}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-zinc-400 text-xs font-medium truncate bg-white/5 px-2 py-0.5 rounded-md">{file.course}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700 shrink-0"></span>
                    <span className="text-zinc-500 text-xs font-bold shrink-0">{file.size}</span>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 shrink-0">
                {file.downloaded ? (
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <CheckCircle2 size={20} />
                  </div>
                ) : (
                  <motion.button 
                    onClick={(e) => { e.stopPropagation(); handleDownload(file.id); }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#6C2BFF] to-purple-500 flex items-center justify-center text-white shadow-[0_5px_20px_rgba(108,43,255,0.4)] hover:shadow-[0_5px_25px_rgba(108,43,255,0.6)] transition-shadow relative overflow-hidden"
                  >
                    {downloading === file.id ? (
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <ArrowDownToLine size={20} />
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
