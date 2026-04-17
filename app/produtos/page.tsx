"use client";

import { useMode } from "@/lib/mode-context";
import { ProdutosVendedorScreen } from "@/components/produtos-vendedor-screen";
import { ProdutosAlunoScreen } from "@/components/produtos-aluno-screen";

export default function Products() {
  const { mode } = useMode();

  return (
    <div className="min-h-screen bg-[#0B0B0F] relative">
      <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-gradient-to-b ${mode === 'vendedor' ? 'from-[#FF5F00]/10' : 'from-[#6C2BFF]/10'} to-transparent blur-3xl -z-10 pointer-events-none`}></div>
      
      {mode === 'vendedor' ? (
        <ProdutosVendedorScreen />
      ) : (
        <ProdutosAlunoScreen />
      )}
    </div>
  );
}
