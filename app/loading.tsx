"use client";

import { motion } from "motion/react";

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="w-48 h-8 bg-white/5 rounded-lg animate-pulse" />
          <div className="w-32 h-4 bg-white/5 rounded-lg animate-pulse" />
        </div>
        <div className="w-12 h-12 bg-white/5 rounded-full animate-pulse" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/5 p-5 rounded-[24px] border border-white/5 animate-pulse h-32" />
        ))}
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full h-24 bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    </motion.div>
  );
}
