"use client"
import { createContext, useContext, useState } from "react"

export type Section = {
  id: string
  type: 'header' | 'product' | 'benefits' | 'testimonials' | 'guarantee' | 'timer' | 'payment' | 'faq' | 'bonus' | 'urgency' | 'social_proof'
  enabled: boolean
}

const CheckoutContext = createContext<any>(null)

export function CheckoutProvider({ children, initialConfig }: { children: React.ReactNode, initialConfig?: any }) {
  const [config, setConfig] = useState(initialConfig || {
    backgroundImage: "",
    backgroundColor: "#000000",
    primaryColor: "#FF5F00",
    headline: "Checkout Seguro",
    subheadline: "Sua compra está protegida e criptografada",
    buttonText: "FINALIZAR COMPRA AGORA",
    productTitle: "Curso Cartfy Premium",
    productDescription: "Acesso vitalício ao melhor conteúdo de vendas e checkout do Brasil.",
    productImage: "https://picsum.photos/seed/cartfy/800/600",
    price: 197.00,
    timerDuration: 600, // 10 minutos
    orderBump: {
      enabled: false,
      title: "Adicionar Mentoria VIP",
      description: "Acelere seus resultados com 1h de mentoria exclusiva.",
      price: 97.00
    },
    upsell: {
      enabled: false,
      title: "Upsell Exclusivo",
      description: "Aproveite esta oferta única antes de finalizar sua compra.",
      price: 197.00,
      videoId: ""
    },
    pixels: {
      facebook: "",
      google: ""
    },
    benefits: [
      "✔ Acesso vitalício",
      "✔ Suporte premium",
      "✔ Atualizações constantes",
      "✔ Certificado incluso"
    ],
    testimonials: [
      {
        id: 't1',
        name: "Lucas Silva",
        text: "O melhor checkout que já usei. A conversão subiu 30% na primeira semana!",
        photo: "https://i.pravatar.cc/150?img=1",
        stars: 5
      },
      {
        id: 't2',
        name: "Ana Oliveira",
        text: "Design impecável e muito fácil de configurar. Recomendo a todos!",
        photo: "https://i.pravatar.cc/150?img=5",
        stars: 5
      }
    ],
    sections: [
      { id: '1', type: 'header', enabled: true },
      { id: '2', type: 'product', enabled: true },
      { id: '3', type: 'timer', enabled: true },
      { id: '4', type: 'benefits', enabled: true },
      { id: '5', type: 'testimonials', enabled: true },
      { id: '6', type: 'guarantee', enabled: true },
      { id: '7', type: 'payment', enabled: true },
    ] as Section[]
  })

  const updateConfig = (newConfig: any) => {
    setConfig((prev: any) => ({ ...prev, ...newConfig }));
  };

  const addSection = (type: Section['type']) => {
    const newSection: Section = {
      id: `${type}-${Date.now()}`,
      type,
      enabled: true
    };
    setConfig((prev: any) => ({ ...prev, sections: [...prev.sections, newSection] }));
  };

  const removeSection = (id: string) => {
    setConfig((prev: any) => ({ ...prev, sections: prev.sections.filter((s: Section) => s.id !== id) }));
  };

  const toggleSection = (id: string) => {
    setConfig((prev: any) => ({
      ...prev,
      sections: prev.sections.map((s: Section) => s.id === id ? { ...s, enabled: !s.enabled } : s)
    }));
  };

  const moveSection = (oldIndex: number, newIndex: number) => {
    const { arrayMove } = require("@dnd-kit/sortable");
    setConfig((prev: any) => ({
      ...prev,
      sections: arrayMove(prev.sections, oldIndex, newIndex)
    }));
  };

  return (
    <CheckoutContext.Provider value={{ config, setConfig, updateConfig, addSection, removeSection, toggleSection, moveSection }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export const useCheckout = () => useContext(CheckoutContext)
