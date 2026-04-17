"use client"
import { useState } from "react"
import { useCheckout, Section } from "@/contexts/checkout-context"
import { Card } from "@/components/ui/card"
import { motion } from "motion/react"
import { CheckoutExperience } from "./checkout/checkout-experience"
import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Settings, 
  Layout, 
  Palette, 
  Type, 
  Plus, 
  Trash2, 
  GripVertical, 
  Eye, 
  Copy, 
  ExternalLink, 
  CheckCircle2,
  Image as ImageIcon,
  Clock,
  ShieldCheck,
  Lock,
  Wand2,
  Loader2
} from "lucide-react";

export default function CheckoutBuilder() {
  const { config, updateConfig, addSection, removeSection, toggleSection, moveSection } = useCheckout();
  const [activeTab, setActiveTab] = useState("layout");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const { user } = useAuth();
  
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [isAdDialogOpen, setIsAdDialogOpen] = useState(false);
  const [adCopy, setAdCopy] = useState<string | null>(null);
  const [isGeneratingAd, setIsGeneratingAd] = useState(false);

  const handleGenerateAi = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      
      if (!response.ok) throw new Error('Failed to generate');
      
      const data = await response.json();
      
      // Update the config with the generated data
      updateConfig({
        ...config,
        ...data.config
      });
      
      setIsAiDialogOpen(false);
      setAiPrompt("");
      setActiveTab("content"); // Switch to content tab to see changes
    } catch (error) {
      console.error("Error generating with AI:", error);
      alert("Erro ao gerar produto com IA. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAd = async () => {
    setIsGeneratingAd(true);
    try {
      const response = await fetch('/api/generate-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config })
      });
      
      if (!response.ok) throw new Error('Failed to generate ad');
      
      const data = await response.json();
      setAdCopy(data.adCopy);
    } catch (error) {
      console.error("Error generating ad:", error);
      alert("Erro ao gerar anúncio com IA. Tente novamente.");
    } finally {
      setIsGeneratingAd(false);
    }
  };

  const generateLink = async () => {
    if (!user) {
      alert('Você precisa estar logado para gerar um checkout.');
      return;
    }

    const id = Math.random().toString(36).substring(7);
    
    try {
      await setDoc(doc(db, 'checkouts', id), {
        userId: user.uid,
        config: config
      });

      const link = `${window.location.origin}/c/${id}`;
      setGeneratedLink(link);
    } catch (error: any) {
      console.error('Erro ao gerar link:', error);
      alert(`Erro ao gerar link: ${error?.message || 'Tente novamente.'}`);
    }
  };

  const copyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
    }
  };

  const sectionTypes: Section['type'][] = ['header', 'product', 'benefits', 'testimonials', 'guarantee', 'timer', 'payment', 'faq', 'bonus', 'urgency', 'social_proof'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar Controls */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="bg-[#111] border-white/5 overflow-hidden">
          <div className="flex border-b border-white/5">
            {[
              { id: 'layout', icon: Layout, label: 'Estrutura' },
              { id: 'style', icon: Palette, label: 'Estilo' },
              { id: 'content', icon: Type, label: 'Conteúdo' },
              { id: 'integrations', icon: Settings, label: 'Integrações' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${
                  activeTab === tab.id ? "bg-[#FF5F00]/10 text-[#FF5F00]" : "text-zinc-500 hover:text-white"
                }`}
              >
                <tab.icon size={18} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
            {activeTab === 'layout' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold tracking-[-0.02em] text-sm uppercase tracking-widest">Seções do Checkout</h3>
                  <div className="flex gap-2">
                    <select 
                      onChange={(e) => addSection(e.target.value as any)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-1 text-[10px] text-zinc-400 outline-none"
                      defaultValue=""
                    >
                      <option value="" disabled>Adicionar...</option>
                      {sectionTypes.map(t => <option key={t} value={t} className="bg-[#111]">{t}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {config.sections.map((section: any, index: number) => (
                    <div key={section.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 group">
                      <div className="cursor-grab text-zinc-600 group-hover:text-zinc-400">
                        <GripVertical size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-white capitalize">{section.type.replace('_', ' ')}</p>
                      </div>
                      <button 
                        onClick={() => toggleSection(section.id)}
                        className={`p-1.5 rounded-lg transition-colors ${section.enabled ? "text-emerald-500 bg-emerald-500/10" : "text-zinc-600 bg-white/5"}`}
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => removeSection(section.id)}
                        className="p-1.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'style' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-white font-bold tracking-[-0.02em] text-sm uppercase tracking-widest">Cores e Fundo</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Cor Primária</label>
                      <div className="flex gap-3">
                        <input 
                          type="color" 
                          value={config.primaryColor} 
                          onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                          className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={config.primaryColor} 
                          onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Cor de Fundo</label>
                      <input 
                        type="color" 
                        value={config.backgroundColor} 
                        onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                        className="w-full h-10 rounded-xl bg-transparent border-none cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Imagem de Fundo (URL)</label>
                      <div className="relative">
                        <input 
                          placeholder="https://exemplo.com/imagem.jpg" 
                          value={config.backgroundImage}
                          onChange={(e) => updateConfig({ backgroundImage: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white pl-10"
                        />
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-white font-bold tracking-[-0.02em] text-sm uppercase tracking-widest">Textos Principais</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Headline</label>
                      <input 
                        value={config.headline}
                        onChange={(e) => updateConfig({ headline: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Subheadline</label>
                      <textarea 
                        value={config.subheadline}
                        onChange={(e) => updateConfig({ subheadline: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white h-20 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Texto do Botão</label>
                      <input 
                        value={config.buttonText}
                        onChange={(e) => updateConfig({ buttonText: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <h3 className="text-white font-bold tracking-[-0.02em] text-sm uppercase tracking-widest">Produto</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Nome do Produto</label>
                      <input 
                        value={config.productTitle}
                        onChange={(e) => updateConfig({ productTitle: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Preço</label>
                      <input 
                        type="number"
                        value={config.price}
                        onChange={(e) => updateConfig({ price: parseFloat(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold tracking-[-0.02em] text-sm uppercase tracking-widest">Order Bump</h3>
                    <button 
                      onClick={() => updateConfig({ orderBump: { ...config.orderBump, enabled: !config.orderBump?.enabled } })}
                      className={`w-10 h-5 rounded-full relative transition-colors ${config.orderBump?.enabled ? 'bg-[#FF5F00]' : 'bg-white/10'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${config.orderBump?.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  
                  {config.orderBump?.enabled && (
                    <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Título</label>
                        <input 
                          value={config.orderBump.title}
                          onChange={(e) => updateConfig({ orderBump: { ...config.orderBump, title: e.target.value } })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Descrição</label>
                        <input 
                          value={config.orderBump.description}
                          onChange={(e) => updateConfig({ orderBump: { ...config.orderBump, description: e.target.value } })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Preço</label>
                        <input 
                          type="number"
                          value={config.orderBump.price}
                          onChange={(e) => updateConfig({ orderBump: { ...config.orderBump, price: parseFloat(e.target.value) } })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold tracking-[-0.02em] text-sm uppercase tracking-widest">Upsell (Pós-compra)</h3>
                    <button 
                      onClick={() => updateConfig({ upsell: { ...config.upsell, enabled: !config.upsell?.enabled } })}
                      className={`w-10 h-5 rounded-full relative transition-colors ${config.upsell?.enabled ? 'bg-[#FF5F00]' : 'bg-white/10'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${config.upsell?.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  
                  {config.upsell?.enabled && (
                    <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Título</label>
                        <input 
                          value={config.upsell.title || ""}
                          onChange={(e) => updateConfig({ upsell: { ...config.upsell, title: e.target.value } })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Descrição</label>
                        <input 
                          value={config.upsell.description || ""}
                          onChange={(e) => updateConfig({ upsell: { ...config.upsell, description: e.target.value } })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Preço</label>
                        <input 
                          type="number"
                          value={config.upsell.price || 0}
                          onChange={(e) => updateConfig({ upsell: { ...config.upsell, price: parseFloat(e.target.value) } })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">ID do Vídeo (YouTube/Vimeo)</label>
                        <input 
                          placeholder="Ex: dQw4w9WgXcQ"
                          value={config.upsell.videoId || ""}
                          onChange={(e) => updateConfig({ upsell: { ...config.upsell, videoId: e.target.value } })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-white font-bold tracking-[-0.02em] text-sm uppercase tracking-widest">Pixels de Rastreamento</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Facebook Pixel ID</label>
                      <input 
                        placeholder="Ex: 1234567890"
                        value={config.pixels?.facebook || ""}
                        onChange={(e) => updateConfig({ pixels: { ...config.pixels, facebook: e.target.value } })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Google Analytics (G-XXXXX)</label>
                      <input 
                        placeholder="Ex: G-123456789"
                        value={config.pixels?.google || ""}
                        onChange={(e) => updateConfig({ pixels: { ...config.pixels, google: e.target.value } })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-black/40 border-t border-white/5 space-y-3">
            <button 
              onClick={() => setIsAiDialogOpen(true)}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold tracking-[-0.02em] rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Wand2 size={20} />
              GERAR PRODUTO COM IA
            </button>
            <button 
              onClick={() => setIsAdDialogOpen(true)}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold tracking-[-0.02em] rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Wand2 size={20} />
              CRIAR ANÚNCIO (FACEBOOK/IG)
            </button>
            <button 
              onClick={generateLink}
              className="w-full py-4 bg-[#FF5F00] text-white font-bold tracking-[-0.02em] rounded-2xl shadow-xl shadow-[#FF5F00]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              CRIAR CHECKOUT
            </button>
          </div>
        </Card>

        {generatedLink && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card className="bg-emerald-500/10 border-emerald-500/20 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500 rounded-xl text-white">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Checkout Criado!</h4>
                  <p className="text-emerald-500/70 text-[10px] font-bold uppercase tracking-widest">Link pronto para uso</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={copyLink}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Copy size={14} /> Copiar
                </button>
                <a 
                  href={generatedLink} 
                  target="_blank" 
                  className="flex-1 py-3 bg-white text-black rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all"
                >
                  <ExternalLink size={14} /> Abrir
                </a>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Preview Area */}
      <div className="lg:col-span-8">
        <div className="sticky top-8">
          <div className="flex items-center justify-between mb-4 px-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Preview em Tempo Real</span>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
            </div>
          </div>
          
          <div className="rounded-[2.5rem] border-[8px] border-[#111] shadow-2xl overflow-hidden bg-black aspect-[9/19] max-h-[800px] mx-auto relative group">
            <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
              <CheckoutExperience />
            </div>
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#111] rounded-b-2xl z-[110]" />
          </div>
        </div>
      </div>

      <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
        <DialogContent className="bg-[#111] border-white/10 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Wand2 className="text-purple-500" />
              Gerador de Produto com IA
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Descreva o produto que você quer vender. A IA vai criar o nome, preço, copy e estruturar o checkout inteiro para você em segundos.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Ex: Quero vender um ebook sobre como emagrecer em 30 dias sem academia, focado em mães ocupadas."
              className="min-h-[120px] bg-black/50 border-white/10 text-white resize-none focus-visible:ring-purple-500"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsAiDialogOpen(false)} className="text-zinc-400 hover:text-white hover:bg-white/5">
              Cancelar
            </Button>
            <Button 
              onClick={handleGenerateAi} 
              disabled={!aiPrompt.trim() || isGenerating}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando Mágica...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Gerar Produto
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isAdDialogOpen} onOpenChange={setIsAdDialogOpen}>
        <DialogContent className="bg-[#111] border-white/10 text-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Wand2 className="text-emerald-500" />
              Gerador de Anúncios com IA
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              A IA vai analisar o seu produto atual ({config.productTitle}) e criar uma copy de alta conversão para Facebook e Instagram Ads.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {adCopy ? (
              <div className="space-y-4">
                <div className="bg-black/50 border border-white/10 rounded-xl p-4 max-h-[300px] overflow-y-auto">
                  <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans">{adCopy}</pre>
                </div>
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(adCopy);
                    alert("Copy copiada para a área de transferência!");
                  }}
                  className="w-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <Copy className="mr-2 h-4 w-4" /> Copiar Copy
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Wand2 size={32} className="text-emerald-500" />
                </div>
                <p className="text-center text-zinc-400 text-sm max-w-xs">
                  Clique no botão abaixo para gerar uma copy persuasiva baseada na sua headline e promessa.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsAdDialogOpen(false)} className="text-zinc-400 hover:text-white hover:bg-white/5">
              Fechar
            </Button>
            {!adCopy && (
              <Button 
                onClick={handleGenerateAd} 
                disabled={isGeneratingAd}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold"
              >
                {isGeneratingAd ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando Copy...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Gerar Anúncio
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
