"use client";

import { create } from 'zustand';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface ToastOptions {
  duration?: number;
}

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (message: string, type: ToastType, options?: ToastOptions) => void;
  removeToast: (id: string) => void;
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  loading: (message: string, options?: ToastOptions) => void;
  dismiss: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useToast = create<ToastStore>((set, get) => ({
  toasts: [],
  addToast: (message, type, options = {}) => {
    const id = generateId();
    const duration = options.duration ?? (type === 'loading' ? 999999 : 3000);
    
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }]
    }));

    if (duration !== 999999) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),
  success: (message, options) => get().addToast(message, 'success', options),
  error: (message, options) => get().addToast(message, 'error', options),
  warning: (message, options) => get().addToast(message, 'warning', options),
  info: (message, options) => get().addToast(message, 'info', options),
  loading: (message, options) => get().addToast(message, 'loading', options),
  dismiss: () => set({ toasts: [] }),
}));

const icons = {
  success: <CheckCircle2 className="text-[#10B981]" size={20} />,
  error: <XCircle className="text-[#EF4444]" size={20} />,
  warning: <AlertTriangle className="text-[#F59E0B]" size={20} />,
  info: <Info className="text-[#3B82F6]" size={20} />,
  loading: <Loader2 className="text-white animate-spin" size={20} />,
};

export function ToastProvider() {
  const { toasts, removeToast } = useToast();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div 
      className={`fixed z-[9999] pointer-events-none flex flex-col gap-3 p-4 items-center sm:items-end ${
        isMobile ? 'bottom-0 left-0 right-0 mb-safe-bottom' : 'top-0 right-0'
      }`}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: isMobile ? 50 : -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            drag={isMobile ? "y" : "x"}
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={(_, info) => {
              if (isMobile && info.offset.y > 50) removeToast(toast.id);
              if (!isMobile && info.offset.x > 50) removeToast(toast.id);
            }}
            className="pointer-events-auto bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl p-4 flex items-center gap-3 w-[90vw] sm:w-auto min-w-[300px] max-w-sm relative overflow-hidden group"
          >
            <div className="flex-shrink-0">
              {icons[toast.type]}
            </div>
            
            <p className="text-white text-sm font-medium flex-1 mr-4">
              {toast.message}
            </p>

            <button 
              onClick={() => removeToast(toast.id)}
              className="text-zinc-500 hover:text-white transition-colors p-1"
            >
              <X size={16} />
            </button>

            {/* Progress Bar */}
            {toast.type !== 'loading' && (
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: toast.duration / 1000, ease: "linear" }}
                className={`absolute bottom-0 left-0 right-0 h-1 origin-left ${
                  toast.type === 'success' ? 'bg-[#10B981]' : 
                  toast.type === 'error' ? 'bg-[#EF4444]' : 
                  toast.type === 'warning' ? 'bg-[#F59E0B]' : 
                  'bg-[#3B82F6]'
                }`}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
