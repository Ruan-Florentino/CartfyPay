import { cn } from "@/lib/utils";

export function Input({ className, primaryColor = "#FF5F00", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { primaryColor?: string }) {
  return (
    <input 
      className={cn(
        "w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white outline-none focus:border-transparent focus:ring-2 transition-all placeholder:text-zinc-600 font-medium",
        className
      )}
      style={{ '--tw-ring-color': primaryColor } as any}
      {...props}
    />
  );
}
