"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Mode = "vendedor" | "aluno";

interface ModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
  primaryColor: string;
  primaryClass: string;
  gradientFrom: string;
  gradientTo: string;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("vendedor");
  
  const primaryColor = mode === "vendedor" ? "#ff6a00" : "#7c3aed";
  const primaryClass = mode === "vendedor" ? "orange" : "purple";
  const gradientFrom = "#ff6a00";
  const gradientTo = "#7c3aed";

  return (
    <ModeContext.Provider value={{ mode, setMode, primaryColor, primaryClass, gradientFrom, gradientTo }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) throw new Error("useMode must be used within ModeProvider");
  return context;
}
