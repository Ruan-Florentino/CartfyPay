"use client";

import { motion, AnimatePresence, useDragControls } from "motion/react";
import { ReactNode, useEffect, useState } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  snapPoints?: string[]; // E.g. ['50%', '95%']
  title?: string;
  children: ReactNode;
  height?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  snapPoints = ['50%', '95%'],
  title,
  children,
  height = 'max-h-[90vh]'
}: BottomSheetProps) {
  const [activeSnap, setActiveSnap] = useState(snapPoints[snapPoints.length - 1]);
  const dragControls = useDragControls();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%", transition: { duration: 0.25, ease: "easeOut" } }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={`fixed bottom-0 left-0 right-0 z-[101] bg-[#111118] border-t border-white/10 rounded-t-[32px] shadow-2xl flex flex-col ${height} safe-bottom`}
          >
            {/* Drag Handle */}
            <div 
              className="w-full flex justify-center py-4 cursor-grab active:cursor-grabbing touch-none shrink-0"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>

            {title && (
              <div className="px-6 pb-4 flex items-center justify-between border-b border-white/5 shrink-0">
                <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
