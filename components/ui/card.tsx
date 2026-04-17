import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={cn("bg-[#111118]/80 backdrop-blur-xl p-6 rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
