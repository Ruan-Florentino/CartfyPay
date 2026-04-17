import { motion } from "motion/react";

export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <motion.img
      src="/logo.png"
      alt="Cartfy Logo"
      className={`${className} rounded-xl drop-shadow-[0_0_10px_rgba(255,106,0,0.6)]`}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    />
  );
}
