import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CheckoutSection {
  id: string;
  type: 'header' | 'product' | 'benefits' | 'testimonials' | 'guarantee' | 'timer' | 'payment' | 'faq' | 'bonus' | 'urgency' | 'social_proof';
  enabled: boolean;
}

export interface CheckoutConfig {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  
  theme: 'standard' | 'stories' | 'chat' | 'reels' | 'gamified';
  
  title: string;
  subtitle: string;
  description: string;
  logo: string;
  
  guarantee: number;
  timer: number;
  spotsCounter: number;
  
  testimonials: boolean;
  orderBump: boolean;
  upsell: boolean;
  layout: 'mobile' | 'desktop';
  price: number;
  
  productImage: string;
  backgroundImage: string;
  backgroundOptions: {
    size: 'cover' | 'contain' | 'auto';
    position: 'center' | 'top' | 'bottom';
    blur: number;
    overlay: number;
  };
  backgroundGradient: string;
  backgroundVideo: string;
  backgroundParallax: boolean;
  
  layoutType: 'centered' | 'fullscreen' | 'minimalist' | 'apple' | 'landing';
  
  headline: string;
  subheadline: string;
  ctaText: string;
  promoBanner: {
    enabled: boolean;
    text: string;
    color: string;
  };
  
  timerSize: 'normal' | 'large' | 'giant';
  liveSocialProof: boolean;
  purchaseNotifications: boolean;
  bestSellerBadge: boolean;
  
  progressBar: boolean;
  confettiOnBuy: boolean;
  pulsingButton: boolean;
  animatedCountdown: boolean;
  
  pixQrCode: boolean;
  cardInstallments: number;
  boletoCopy: boolean;
  couponCode: string;
  
  animatedGuarantee: boolean;
  
  videoUrl: string;
  
  sections: CheckoutSection[];
  
  headerTitle: string;
  headerImage: string;
  
  buttonText: string;
  buttonColor: string;
  buttonGradient: string;
  buttonSize: 'small' | 'medium' | 'large' | 'giant';
  buttonBorder: string;
  
  benefitsList: { icon: string; text: string }[];
  bonusList: { title: string; description: string; value: number }[];
  faqList: { question: string; answer: string }[];
  testimonialsList: { photo: string; name: string; text: string; stars: number }[];
}

interface CheckoutStore {
  checkoutConfig: CheckoutConfig;
  updateConfig: (newConfig: Partial<CheckoutConfig>) => void;
}

const defaultConfig: CheckoutConfig = {
  primaryColor: "#FF5F00",
  backgroundColor: "#0B0B0F",
  textColor: "#FFFFFF",
  borderColor: "rgba(255,255,255,0.1)",
  
  theme: 'standard',
  
  title: "Curso de Marketing Digital Pro",
  subtitle: "Aprenda do zero ao avançado",
  description: "Domine as estratégias mais avançadas de tráfego pago e vendas online.",
  logo: "https://cartfy.app/logo.png",
  
  guarantee: 7,
  timer: 15,
  spotsCounter: 12,
  
  testimonials: true,
  orderBump: true,
  upsell: false,
  layout: 'mobile',
  price: 197.00,
  
  productImage: "https://picsum.photos/seed/course/800/600",
  backgroundImage: "",
  backgroundOptions: {
    size: 'cover',
    position: 'center',
    blur: 0,
    overlay: 0.5
  },
  backgroundGradient: "",
  backgroundVideo: "",
  backgroundParallax: false,
  
  layoutType: 'centered',
  
  headline: "OFERTA ESPECIAL POR TEMPO LIMITADO",
  subheadline: "Garanta sua vaga com 50% de desconto hoje!",
  ctaText: "QUERO MEU ACESSO AGORA",
  promoBanner: {
    enabled: false,
    text: "🔥 254 pessoas estão vendo este produto agora!",
    color: "#FF5F00"
  },
  
  timerSize: 'normal',
  liveSocialProof: true,
  purchaseNotifications: true,
  bestSellerBadge: true,
  
  progressBar: true,
  confettiOnBuy: true,
  pulsingButton: true,
  animatedCountdown: true,
  
  pixQrCode: true,
  cardInstallments: 12,
  boletoCopy: true,
  couponCode: "",
  
  animatedGuarantee: true,
  
  videoUrl: "",
  
  sections: [
    { id: 'header', type: 'header', enabled: true },
    { id: 'product', type: 'product', enabled: true },
    { id: 'timer', type: 'timer', enabled: true },
    { id: 'benefits', type: 'benefits', enabled: true },
    { id: 'bonus', type: 'bonus', enabled: true },
    { id: 'social_proof', type: 'social_proof', enabled: true },
    { id: 'payment', type: 'payment', enabled: true },
    { id: 'guarantee', type: 'guarantee', enabled: true },
    { id: 'testimonials', type: 'testimonials', enabled: true },
    { id: 'faq', type: 'faq', enabled: true },
  ],
  
  headerTitle: "Checkout Seguro",
  headerImage: "",
  
  buttonText: "FINALIZAR COMPRA",
  buttonColor: "#FF5F00",
  buttonGradient: "linear-gradient(90deg, #FF5F00 0%, #FF8A00 100%)",
  buttonSize: "giant",
  buttonBorder: "none",
  
  benefitsList: [
    { icon: "check", text: "Acesso vitalício ao curso" },
    { icon: "star", text: "Suporte premium 24/7" },
    { icon: "users", text: "Comunidade exclusiva de alunos" },
    { icon: "award", text: "Certificado de conclusão" }
  ],
  bonusList: [
    { title: "Mentoria em grupo mensal", description: "Encontros ao vivo para tirar dúvidas", value: 997 },
    { title: "Templates prontos para uso", description: "Copie e cole nossas campanhas", value: 497 },
    { title: "Planilha de gestão financeira", description: "Controle seus lucros facilmente", value: 197 }
  ],
  faqList: [
    { question: "Como vou receber o acesso?", answer: "Você receberá os dados de acesso no seu e-mail imediatamente após a confirmação do pagamento." },
    { question: "Tem garantia?", answer: "Sim! Você tem 7 dias de garantia incondicional. Se não gostar, devolvemos 100% do seu dinheiro." },
    { question: "Quais as formas de pagamento?", answer: "Aceitamos PIX, Cartão de Crédito em até 12x e Boleto Bancário." }
  ],
  testimonialsList: [
    { photo: "https://i.pravatar.cc/150?img=32", name: "João Silva", text: "Conteúdo incrível, superou todas as minhas expectativas. O suporte é excelente e os resultados vieram rápido!", stars: 5 },
    { photo: "https://i.pravatar.cc/150?img=44", name: "Maria Oliveira", text: "Melhor investimento que já fiz. A didática é perfeita e as estratégias realmente funcionam na prática.", stars: 5 }
  ]
};

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      checkoutConfig: defaultConfig,
      updateConfig: (newConfig) =>
        set((state) => ({
          checkoutConfig: { ...state.checkoutConfig, ...newConfig },
        })),
    }),
    {
      name: 'cartfy-checkout-config',
    }
  )
);
