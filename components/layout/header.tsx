import { Logo } from "@/components/ui/logo";
import { useMode } from "@/lib/mode-context";
import { Bell } from "lucide-react";
import { useNotifications } from "@/contexts/notification-context";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function Header() {
  const { mode } = useMode();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <div className="flex items-center justify-between px-4 py-3 backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Logo className="w-8 h-8 rounded-xl shadow-md" />
        <h1 className="text-lg font-bold bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
          Cartfy
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
          >
            <Bell size={20} className="text-zinc-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF5F00] rounded-full border-2 border-black"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-bold text-white">Notificações</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs text-[#FF5F00] hover:underline">
                      Marcar todas como lidas
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 text-sm">
                      Nenhuma notificação no momento.
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div 
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${!notification.read ? 'bg-[#FF5F00]/5' : ''}`}
                      >
                        <p className={`text-sm ${!notification.read ? 'text-white font-medium' : 'text-zinc-400'}`}>
                          {notification.message}
                        </p>
                        <span className="text-xs text-zinc-500 mt-1 block">
                          {new Date(notification.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${mode === 'vendedor' ? 'bg-[#ff6a00]' : 'bg-[#7c3aed]'}`}>
          {mode === 'vendedor' ? 'VENDEDOR' : 'ALUNO'}
        </div>
      </div>
    </div>
  );
}
