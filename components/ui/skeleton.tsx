import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circle' | 'card' | 'button' | 'image';
}

export function Skeleton({ 
  className, 
  variant = 'text', 
  ...props 
}: SkeletonProps) {
  const baseClasses = "relative overflow-hidden bg-white/5 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent isolate";
  
  const variantClasses = {
    text: "h-4 w-full rounded-md",
    circle: "rounded-full w-12 h-12",
    card: "w-full rounded-2xl min-h-[200px]",
    button: "w-full h-12 rounded-xl",
    image: "w-full aspect-video rounded-xl",
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("glass-card p-4 rounded-2xl flex flex-col gap-4 w-full", className)}>
      <Skeleton variant="image" />
      <div className="space-y-2 w-full">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
      <div className="mt-2">
        <Skeleton variant="button" />
      </div>
    </div>
  );
}

export function SkeletonTransaction({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 w-full bg-white/5 p-3 rounded-2xl border border-white/5", className)}>
      <Skeleton variant="circle" className="w-10 h-10 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2 opacity-50" />
      </div>
      <Skeleton variant="text" className="w-16 h-6 rounded-full shrink-0" />
    </div>
  );
}

export function SkeletonCourse({ className }: { className?: string }) {
  return (
    <div className={cn("glass-card rounded-[32px] p-2 flex flex-col gap-3 w-full", className)}>
      <Skeleton variant="image" className="rounded-[24px]" />
      <div className="px-4 pb-4 pt-2 space-y-4">
        <div className="space-y-2">
          <Skeleton variant="text" className="w-4/5" />
          <Skeleton variant="text" className="w-1/2 opacity-50" />
        </div>
        <div className="flex gap-2">
          <Skeleton variant="button" className="h-10 flex-1" />
          <Skeleton variant="button" className="h-10 w-10 shrink-0 rounded-full" />
        </div>
      </div>
    </div>
  );
}
