"use client"
import { useCheckout, Section } from "@/contexts/checkout-context"

const SectionRenderer = ({ section }: { section: Section }) => {
  if (!section.enabled) return null
  
  switch (section.type) {
    case 'timer': return <div className="bg-red-500/20 p-3 rounded-xl text-white">Oferta expira em 14:32</div>
    case 'benefits': return <div className="bg-white/5 p-4 rounded-xl text-white">✔ Acesso vitalício ✔ Suporte premium</div>
    case 'testimonials': return <div className="bg-white/5 p-4 rounded-xl text-white">⭐⭐⭐⭐⭐ "Muito bom"</div>
    case 'guarantee': return <div className="bg-white/5 p-4 rounded-xl text-white">🛡️ Garantia de 7 dias</div>
    default: return null
  }
}

export default function CheckoutPreview() {
  const { config } = useCheckout()

  return (
    <div
      className="min-h-screen p-4"
      style={{
        backgroundColor: config.backgroundColor,
        backgroundImage: `url(${config.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-white">{config.headline}</h1>
        <p className="text-gray-400">{config.subheadline}</p>

        {config.sections.map((section: Section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}

        <button
          className="w-full p-4 rounded-xl text-white font-bold"
          style={{ background: config.primaryColor }}
        >
          {config.buttonText} — {config.price}
        </button>
      </div>
    </div>
  )
}
