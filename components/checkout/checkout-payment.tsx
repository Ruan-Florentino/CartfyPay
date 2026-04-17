"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/contexts/checkout-context";
import { motion, AnimatePresence } from "motion/react";
import { QrCode, CreditCard, FileText, Copy, Check, ShieldCheck, Lock, Loader2, AlertCircle, Plus } from "lucide-react";

export function CheckoutPayment() {
  const [method, setMethod] = useState("pix");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [orderBumpSelected, setOrderBumpSelected] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [upsellLoading, setUpsellLoading] = useState(false);
  const { config } = useCheckout();

  const [cardData, setCardData] = useState({
    number: '',
    holder_name: '',
    expiry: '',
    cvv: '',
    installments: 1
  });

  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    document: '',
    phone: ''
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalPrice = config.price + (orderBumpSelected && config.orderBump?.enabled ? config.orderBump.price : 0);

  const handleFinalize = async () => {
    if (!customerData.name || !customerData.email || !customerData.document) {
      setError("Por favor, preencha todos os dados pessoais.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let card_token = undefined;

      if (method === 'cartao') {
        const publicKey = process.env.NEXT_PUBLIC_PAGARME_PUBLIC_KEY;
        if (!publicKey) {
          throw new Error('Chave pública do Pagar.me não configurada');
        }

        const [exp_month, exp_year_short] = cardData.expiry.split('/');
        const exp_year = parseInt(`20${exp_year_short}`);

        const tokenResponse = await fetch(`https://api.pagar.me/core/v5/tokens?appId=${publicKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'card',
            card: {
              number: cardData.number.replace(/\s/g, ''),
              holder_name: cardData.holder_name,
              exp_month: parseInt(exp_month),
              exp_year: exp_year,
              cvv: cardData.cvv,
            }
          })
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
          throw new Error(tokenData.message || 'Erro ao validar cartão');
        }

        card_token = tokenData.id;
      }

      let utms = {};
      try {
        const storedUtms = localStorage.getItem('cartfy_utms');
        if (storedUtms) {
          utms = JSON.parse(storedUtms);
        }
      } catch (e) {
        console.error('Failed to parse UTMs', e);
      }

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          amount: totalPrice,
          customer: customerData,
          card_token: method === 'cartao' ? card_token : undefined,
          installments: method === 'cartao' ? cardData.installments : undefined,
          orderBump: orderBumpSelected && config.orderBump?.enabled ? config.orderBump : undefined,
          utms
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pagamento');
      }

      setPaymentData(data);
      
      // Fire Purchase Pixels
      if (config.pixels) {
        if (config.pixels.facebook && typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Purchase', {
            value: totalPrice,
            currency: 'BRL'
          });
        }
        if (config.pixels.google && typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'purchase', {
            transaction_id: data.id || Date.now().toString(),
            value: totalPrice,
            currency: 'BRL',
            items: [
              {
                item_id: config.productTitle,
                item_name: config.productTitle,
                price: config.price,
                quantity: 1
              },
              ...(orderBumpSelected && config.orderBump?.enabled ? [{
                item_id: config.orderBump.title,
                item_name: config.orderBump.title,
                price: config.orderBump.price,
                quantity: 1
              }] : [])
            ]
          });
        }
      }

      if (method === 'cartao' && data.status === 'paid') {
        if (config.upsell?.enabled) {
          setShowUpsell(true);
        } else {
          alert('Pagamento aprovado com sucesso!');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpsellAccept = async () => {
    setUpsellLoading(true);
    try {
      // In a real scenario, we would use the saved card token or customer ID for a 1-click buy.
      // For this demo, we simulate the 1-click buy success.
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Fire Upsell Purchase Pixel
      if (config.pixels) {
        if (config.pixels.facebook && typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Purchase', {
            value: config.upsell.price,
            currency: 'BRL'
          });
        }
      }

      alert('Upsell adicionado com sucesso! Compra finalizada.');
      setShowUpsell(false);
    } catch (error) {
      alert('Erro ao processar upsell.');
    } finally {
      setUpsellLoading(false);
    }
  };

  const handleUpsellDecline = () => {
    alert('Compra finalizada com sucesso!');
    setShowUpsell(false);
  };

  if (showUpsell && config.upsell) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
            <Check size={32} />
          </div>
          <h2 className="text-2xl font-black text-white">Sua compra foi aprovada!</h2>
          <p className="text-zinc-400">Mas espere, temos uma oferta exclusiva para você...</p>
        </div>

        <Card className="bg-white/5 border-white/10 p-6 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">{config.upsell.title}</h3>
            <p className="text-zinc-400 text-sm">{config.upsell.description}</p>
          </div>

          {config.upsell.videoId && (
            <div className="aspect-video rounded-xl overflow-hidden bg-black/50 border border-white/10">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${config.upsell.videoId}?autoplay=1&controls=0`} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          )}

          <div className="space-y-4 pt-4">
            <Button 
              onClick={handleUpsellAccept}
              disabled={upsellLoading}
              className="w-full py-6 text-lg font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20"
            >
              {upsellLoading ? <Loader2 className="animate-spin mr-2" /> : null}
              SIM, QUERO ADICIONAR POR APENAS R$ {config.upsell.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Button>
            <button 
              onClick={handleUpsellDecline}
              disabled={upsellLoading}
              className="w-full py-4 text-sm font-medium text-zinc-500 hover:text-white transition-colors underline"
            >
              Não, obrigado. Quero apenas o que já comprei.
            </button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {config.orderBump?.enabled && (
        <div className="bg-white/5 border-dashed border-2 border-[#FF5F00]/30 p-5 rounded-xl cursor-pointer hover:border-[#FF5F00]/60 transition-colors relative overflow-hidden group" onClick={() => setOrderBumpSelected(!orderBumpSelected)}>
          <div className={`absolute inset-0 bg-[#FF5F00]/5 transition-opacity ${orderBumpSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
          <div className="relative z-10 flex gap-4 items-start">
            <div className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 mt-1 transition-colors ${orderBumpSelected ? 'bg-[#FF5F00] border-[#FF5F00]' : 'border-zinc-500 bg-black/50'}`}>
              {orderBumpSelected && <Check size={14} className="text-white" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-red-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full animate-pulse">Oferta Única</span>
                <h4 className="text-white font-bold text-sm">{config.orderBump.title}</h4>
              </div>
              <p className="text-zinc-400 text-xs mb-2 leading-relaxed">{config.orderBump.description}</p>
              <p className="text-[#FF5F00] font-black text-sm">+ R$ {config.orderBump.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      )}

      <Card className="bg-white/5 border-white/10 p-5">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 rounded-full bg-[#FF5F00]" />
          <h3 className="text-sm font-bold tracking-[-0.02em] text-white uppercase tracking-widest">Seus Dados</h3>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-1">Nome Completo</label>
            <input 
              placeholder="Digite seu nome" 
              value={customerData.name}
              onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:border-[#FF5F00]/50 outline-none transition-all" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-1">E-mail</label>
            <input 
              type="email"
              placeholder="Digite seu melhor e-mail" 
              value={customerData.email}
              onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:border-[#FF5F00]/50 outline-none transition-all" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-1">CPF/CNPJ</label>
              <input 
                placeholder="Apenas números" 
                value={customerData.document}
                onChange={(e) => setCustomerData({ ...customerData, document: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:border-[#FF5F00]/50 outline-none transition-all" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-1">Telefone (WhatsApp)</label>
              <input 
                placeholder="(11) 99999-9999" 
                value={customerData.phone}
                onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:border-[#FF5F00]/50 outline-none transition-all" 
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 pt-6 border-t border-white/5">
          <div className="w-1 h-6 rounded-full bg-[#FF5F00]" />
          <h3 className="text-sm font-bold tracking-[-0.02em] text-white uppercase tracking-widest">Forma de Pagamento</h3>
        </div>

        <div className="flex gap-2 mb-8">
          {[
            { id: 'pix', icon: QrCode, label: 'Pix' },
            { id: 'cartao', icon: CreditCard, label: 'Cartão' },
            { id: 'boleto', icon: FileText, label: 'Boleto' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setMethod(m.id);
                setPaymentData(null);
                setError(null);
              }}
              className={`flex-1 py-3 rounded-2xl flex flex-col items-center gap-2 transition-all duration-300 border ${
                method === m.id 
                  ? "bg-[#FF5F00]/10 border-[#FF5F00] text-white" 
                  : "bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10"
              }`}
            >
              <m.icon size={20} className={method === m.id ? "text-[#FF5F00]" : ""} />
              <span className="text-[10px] font-bold tracking-[-0.02em] uppercase tracking-widest">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="min-h-[280px]">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {method === "pix" && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              {paymentData ? (
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-3xl w-48 h-48 mx-auto shadow-2xl shadow-emerald-500/10 relative group">
                    <img src={paymentData.qr_code_url} alt="QR Code" className="w-full h-full" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-center text-zinc-400 text-xs leading-relaxed">
                      Escaneie o QR Code acima ou copie o código abaixo para pagar via Pix.
                    </p>
                    <div className="relative">
                      <input 
                        readOnly 
                        value={paymentData.qr_code} 
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-4 text-[10px] text-zinc-500 font-mono truncate pr-12"
                      />
                      <button 
                        onClick={() => handleCopy(paymentData.qr_code)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#FF5F00] text-white rounded-xl shadow-lg shadow-[#FF5F00]/20 hover:scale-105 transition-transform"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <button 
                    onClick={handleFinalize}
                    disabled={loading}
                    className="px-8 py-4 bg-[#FF5F00] text-white rounded-2xl font-bold flex items-center gap-2 mx-auto hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <QrCode />}
                    GERAR QR CODE PIX
                  </button>
                </div>
              )}
              
              <div className="flex items-center justify-center gap-2 text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">
                <ShieldCheck size={12} /> Liberação imediata após o pagamento
              </div>
            </motion.div>
          )}

          {method === "cartao" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-1">Número do Cartão</label>
                <div className="relative">
                  <input 
                    placeholder="0000 0000 0000 0000" 
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:border-[#FF5F00]/50 outline-none transition-all" 
                  />
                  <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-1">Nome no Cartão</label>
                <input 
                  placeholder="Como impresso no cartão" 
                  value={cardData.holder_name}
                  onChange={(e) => setCardData({ ...cardData, holder_name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:border-[#FF5F00]/50 outline-none transition-all" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-1">Validade</label>
                  <input 
                    placeholder="MM/AA" 
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:border-[#FF5F00]/50 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-1">CVV</label>
                  <div className="relative">
                    <input 
                      placeholder="123" 
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:border-[#FF5F00]/50 outline-none transition-all" 
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-1">Parcelamento</label>
                <select 
                  value={cardData.installments}
                  onChange={(e) => setCardData({ ...cardData, installments: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:border-[#FF5F00]/50 outline-none transition-all appearance-none"
                >
                  <option value="1" className="bg-[#111]">1x de R$ {totalPrice.toFixed(2)} (Sem juros)</option>
                  <option value="2" className="bg-[#111]">2x de R$ {(totalPrice / 2).toFixed(2)}</option>
                  <option value="3" className="bg-[#111]">3x de R$ {(totalPrice / 3).toFixed(2)}</option>
                  <option value="12" className="bg-[#111]">12x de R$ {(totalPrice / 12 * 1.1).toFixed(2)}</option>
                </select>
              </div>

              <button 
                onClick={handleFinalize}
                disabled={loading}
                className="w-full py-4 bg-[#FF5F00] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : <CreditCard />}
                PAGAR R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </button>
            </motion.div>
          )}

          {method === "boleto" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center py-4">
              {paymentData ? (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                    <Check size={32} className="text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white font-bold">Boleto Gerado!</h4>
                    <p className="text-zinc-400 text-xs px-4">
                      O código de barras foi gerado com sucesso.
                    </p>
                    <div className="relative mt-4">
                      <input 
                        readOnly 
                        value={paymentData.barcode} 
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-4 text-[10px] text-zinc-500 font-mono truncate pr-12"
                      />
                      <button 
                        onClick={() => handleCopy(paymentData.barcode)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#FF5F00] text-white rounded-xl shadow-lg shadow-[#FF5F00]/20 hover:scale-105 transition-transform"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                    <a 
                      href={paymentData.pdf} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold hover:bg-white/10 transition-all mt-2"
                    >
                      VISUALIZAR PDF
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                    <FileText size={32} className="text-zinc-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white font-bold">Pagamento via Boleto</h4>
                    <p className="text-zinc-400 text-xs px-4">
                      O boleto será gerado após a finalização. O prazo de compensação é de até 3 dias úteis.
                    </p>
                  </div>
                  <button 
                    onClick={handleFinalize}
                    disabled={loading}
                    className="px-8 py-4 bg-[#FF5F00] text-white rounded-2xl font-bold flex items-center gap-2 mx-auto hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <FileText />}
                    GERAR BOLETO DE R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </button>
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
                    <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest">Atenção</p>
                    <p className="text-zinc-300 text-[10px] mt-1">A liberação do curso ocorre somente após a compensação bancária.</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <ShieldCheck size={14} />
            <span className="text-[9px] font-bold uppercase tracking-widest">Pagamento 100% Seguro</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5 text-zinc-500">
            <Lock size={14} />
            <span className="text-[9px] font-bold uppercase tracking-widest">Dados Criptografados</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
