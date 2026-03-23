"use client";

import { motion, AnimatePresence } from "motion/react";
import { Play, X, Maximize2 } from "lucide-react";
import { usePlayer } from "@/contexts/player-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function MiniPlayer() {
  const { isMiniPlayerVisible, hideMiniPlayer, currentLesson, showMiniPlayer } = usePlayer();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/cursos/")) {
      hideMiniPlayer();
    } else if (currentLesson) {
      showMiniPlayer();
    }
  }, [pathname, currentLesson, hideMiniPlayer, showMiniPlayer]);

  if (!currentLesson) return null;

  return (
    <AnimatePresence>
      {isMiniPlayerVisible && !pathname.startsWith("/cursos/") && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute bottom-24 right-4 z-50 w-72 bg-[#111118] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="relative aspect-video w-full bg-black group">
            <img 
              src={currentLesson.thumbnail} 
              alt="Thumbnail" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Link href="/cursos/1">
                <button className="w-12 h-12 bg-[#FF6A00] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,106,0,0.6)] pl-1 hover:scale-110 transition-transform">
                  <Play size={20} className="text-white" fill="currentColor" />
                </button>
              </Link>
            </div>
            <button 
              onClick={hideMiniPlayer}
              className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors"
            >
              <X size={14} />
            </button>
            <Link href="/cursos/1">
              <button 
                className="absolute top-2 left-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors"
              >
                <Maximize2 size={12} />
              </button>
            </Link>
          </div>
          <div className="p-3">
            <h4 className="text-white font-bold text-sm truncate">{currentLesson.lessonTitle}</h4>
            <p className="text-zinc-500 text-xs truncate mt-0.5">{currentLesson.courseTitle}</p>
            
            <div className="mt-3 flex items-center gap-2">
              <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${currentLesson.progress}%` }}
                  className="h-full bg-[#FF6A00]"
                />
              </div>
              <span className="text-[10px] font-bold text-zinc-400">{currentLesson.progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
