"use client";

import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { Plus, Edit2, MoreVertical, Search, Pause, Play, BarChart2, X, Image as ImageIcon, DollarSign, Tag, ChevronRight, AlertCircle, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const SwipeableProduct = ({ product, onToggle, onEdit, onDelete }: { product: any, onToggle: (id: number) => void, onEdit: (product: any) => void, onDelete: (id: number) => void }) => {
  const x = useMotionValue(0);
  const [showMenu, setShowMenu] = useState(false);
  
  const bgLeft = useTransform(x, [0, 100], ["rgba(108, 43, 255, 0)", "rgba(108, 43, 255, 0.2)"]);
  const bgRight = useTransform(x, [0, -100], ["rgba(255, 106, 0, 0)", "rgba(255, 106, 0, 0.2)"]);
  
  const opacityLeft = useTransform(x, [20, 80], [0, 1]);
  const opacityRight = useTransform(x, [-20, -80], [0, 1]);
  
  const scaleLeft = useTransform(x, [0, 100], [0.5, 1.2]);
  const scaleRight = useTransform(x, [0, -100], [0.5, 1.2]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      onEdit(product);
    } else if (info.offset.x < -100) {
      onToggle(product.id);
    }
    x.set(0);
  };

  return (
    <motion.div
      layout
      className="relative mb-4 overflow-hidden rounded-3xl"
    >
      <div className="absolute inset-0 flex justify-between items-center px-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl">
        <motion.div 
          style={{ backgroundColor: bgLeft }}
          className="absolute left-0 top-0 bottom-0 w-1/2 flex items-center pl-8 rounded-l-3xl"
        >
          <motion.div style={{ opacity: opacityLeft, scale: scaleLeft }} className="flex flex-col items-center gap-1 text-[#6C2BFF]">
            <div className="w-12 h-12 rounded-full bg-[#6C2BFF]/20 flex items-center justify-center border border-[#6C2BFF]/30 shadow-[0_0_15px_rgba(108,43,255,0.3)]">
              <Edit2 size={24} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-bold tracking-[-0.02em] uppercase tracking-widest">Editar</span>
          </motion.div>
        </motion.div>

        <motion.div 
          style={{ backgroundColor: bgRight }}
          className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-end pr-8 rounded-r-3xl"
        >
          <motion.div style={{ opacity: opacityRight, scale: scaleRight }} className="flex flex-col items-center gap-1 text-[#FF5F00]">
            <div className="w-12 h-12 rounded-full bg-[#FF5F00]/20 flex items-center justify-center border border-[#FF5F00]/30 shadow-[0_0_15px_rgba(255,95,0,0.3)]">
              {product.status === 'Ativo' ? <Pause size={24} strokeWidth={1.5} /> : <Play size={24} strokeWidth={1.5} />}
            </div>
            <span className="text-[10px] font-bold tracking-[-0.02em] uppercase tracking-widest">
              {product.status === 'Ativo' ? 'Pausar' : 'Ativar'}
            </span>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        style={{ x }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 flex gap-4 items-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden group cursor-grab active:cursor-grabbing z-10 hover:border-white/20 transition-colors"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative shadow-inner border border-white/10">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
          
          {product.status === 'Pausado' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
              <div className="bg-white/10 p-2 rounded-full border border-white/20">
                <Pause size={20} className="text-white" fill="currentColor" strokeWidth={1.5} />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 py-1 pointer-events-none">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-white truncate pr-2 text-base group-hover:text-[#FF5F00] transition-colors">{product.name}</h3>
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="text-zinc-500 hover:text-white transition-colors p-1 -mr-1 rounded-full hover:bg-white/10 pointer-events-auto"
              >
                <MoreVertical size={18} strokeWidth={1.5} />
              </button>
              
              <AnimatePresence>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                    >
                      <button onClick={() => { onEdit(product); setShowMenu(false); }} className="w-full px-4 py-3 text-left text-sm font-bold text-zinc-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors">
                        <Edit2 size={16} className="text-[#6C2BFF]" strokeWidth={1.5} /> Editar Produto
                      </button>
                      <button onClick={() => { onToggle(product.id); setShowMenu(false); }} className="w-full px-4 py-3 text-left text-sm font-bold text-zinc-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors">
                        {product.status === 'Ativo' ? <Pause size={16} className="text-[#FF5F00]" strokeWidth={1.5} /> : <Play size={16} className="text-emerald-500" strokeWidth={1.5} />} 
                        {product.status === 'Ativo' ? 'Pausar Vendas' : 'Ativar Vendas'}
                      </button>
                      <Link href="/vendas" className="w-full px-4 py-3 text-left text-sm font-bold text-zinc-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors">
                        <BarChart2 size={16} className="text-blue-500" strokeWidth={1.5} /> Ver Vendas
                      </Link>
                      <button onClick={() => { window.open('/checkout', '_blank'); setShowMenu(false); }} className="w-full px-4 py-3 text-left text-sm font-bold text-zinc-300 hover:bg-white/10 hover:text-white flex items-center gap-3 transition-colors">
                        <ShoppingCart size={16} className="text-amber-500" strokeWidth={1.5} /> Abrir Checkout
                      </button>
                      <div className="h-px bg-white/10 mx-2 my-1" />
                      <button onClick={() => { onDelete(product.id); setShowMenu(false); }} className="w-full px-4 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors">
                        <X size={16} strokeWidth={1.5} /> Excluir Produto
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <p className="text-[#FF5F00] font-bold tracking-[-0.02em] text-xl drop-shadow-[0_0_8px_rgba(255,95,0,0.3)]">{product.price}</p>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Preço Final</span>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[-0.02em] uppercase tracking-wider">
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-zinc-300 shadow-inner">
              <BarChart2 size={12} className="text-emerald-400" strokeWidth={2} />
              {product.sales} vendas
            </span>
            <button 
              onClick={(e) => { e.stopPropagation(); onToggle(product.id); }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all border pointer-events-auto ${
                product.status === 'Ativo' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]' 
                  : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${product.status === 'Ativo' ? 'bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'bg-zinc-500'}`}></div>
              {product.status}
            </button>
          </div>
        </div>
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity">
          <ChevronRight size={16} className="text-zinc-400" strokeWidth={1.5} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export function ProdutosVendedorScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image: "" });
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [products, setProducts] = useState([
    { id: 1, name: "Curso Mestre em Vendas", price: "R$ 497,00", sales: 1240, image: "https://picsum.photos/seed/curso1/400/400", status: "Ativo" },
    { id: 2, name: "Mentoria VIP", price: "R$ 1.997,00", sales: 345, image: "https://picsum.photos/seed/curso2/400/400", status: "Ativo" },
    { id: 3, name: "E-book Gatilhos Mentais", price: "R$ 97,00", sales: 5890, image: "https://picsum.photos/seed/curso3/400/400", status: "Pausado" },
  ]);

  const toggleStatus = (id: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, status: p.status === "Ativo" ? "Pausado" : "Ativo" } : p));
  };

  const handleSaveProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { 
        ...p, 
        name: newProduct.name, 
        price: `R$ ${newProduct.price}`,
        image: newProduct.image
      } : p));
    } else {
      const product = {
        id: Date.now(),
        name: newProduct.name,
        price: `R$ ${newProduct.price}`,
        sales: 0,
        image: newProduct.image || `https://picsum.photos/seed/${Math.random()}/400/400`,
        status: "Ativo",
      };
      setProducts([product, ...products]);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
    setNewProduct({ name: "", price: "", image: "" });
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setNewProduct({ name: product.name, price: product.price.replace("R$ ", ""), image: product.image });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen pb-32">
      <div className="p-6 pt-12 flex justify-between items-center sticky top-0 bg-[#0B0B0F]/80 backdrop-blur-xl z-40 border-b border-white/5 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.02em] tracking-tight text-white">Produtos</h1>
          <p className="text-zinc-400 text-sm mt-1 font-medium">Gerencie seu catálogo</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setEditingProduct(null); setNewProduct({ name: "", price: "", image: "" }); setIsModalOpen(true); }}
          className="w-12 h-12 rounded-2xl shadow-[0_0_20px_rgba(255,95,0,0.4)] flex items-center justify-center text-white animate-gradient"
          style={{ background: `linear-gradient(135deg, #FF5F00, #FF8C00)` }}
        >
          <Plus size={24} strokeWidth={1.5} />
        </motion.button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-6 space-y-6"
      >
        <motion.div variants={itemVariants} className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#FF5F00] transition-colors" size={20} strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Buscar meus produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#FF5F00]/50 focus:shadow-[0_0_20px_rgba(255,95,0,0.15)] transition-all text-base shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          />
        </motion.div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <SwipeableProduct 
                  key={product.id} 
                  product={product} 
                  onToggle={toggleStatus} 
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              ))
            ) : (
              <motion.div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <AlertCircle size={40} className="text-zinc-600" />
                </div>
                <h3 className="text-white font-bold text-lg">Nenhum produto encontrado</h3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-2xl rounded-t-[3rem] border-t border-white/10 z-[70] p-8 pb-12 shadow-[0_-20px_80px_rgba(0,0,0,0.8)] max-w-[420px] mx-auto"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-8" />
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold tracking-[-0.02em] text-white">{editingProduct ? 'Editar Produto' : 'Criar Produto'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/10 shadow-inner">
                  <X size={24} className="text-zinc-400" strokeWidth={1.5} />
                </button>
              </div>
              <div className="space-y-6">
                <div className="w-full h-40 rounded-3xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/10 hover:border-[#FF5F00]/50 transition-all group relative overflow-hidden shadow-inner">
                  {newProduct.image ? (
                    <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon size={28} className="text-[#FF5F00] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                      <span className="text-xs font-bold tracking-[-0.02em] uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Adicionar Capa</span>
                    </>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-[-0.02em] uppercase tracking-widest text-zinc-400 ml-2">Nome do Produto</label>
                    <div className="relative group">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#FF5F00] transition-colors" size={20} strokeWidth={1.5} />
                      <input 
                        type="text" 
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Ex: Curso Mestre em Vendas" 
                        className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF5F00]/50 focus:shadow-[0_0_20px_rgba(255,95,0,0.15)] transition-all font-bold shadow-inner" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-[-0.02em] uppercase tracking-widest text-zinc-400 ml-2">Preço de Venda</label>
                    <div className="relative group">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#FF5F00] transition-colors" size={20} strokeWidth={1.5} />
                      <input 
                        type="text" 
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        placeholder="0,00" 
                        className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF5F00]/50 focus:shadow-[0_0_20px_rgba(255,95,0,0.15)] transition-all font-bold tracking-[-0.02em] text-xl shadow-inner" 
                      />
                    </div>
                  </div>
                </div>
                <motion.button 
                  onClick={handleSaveProduct}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#FF5F00] to-[#FF8C00] text-white font-bold tracking-[-0.02em] text-lg py-5 rounded-2xl shadow-[0_10px_30px_rgba(255,95,0,0.4)] transition-all mt-4 flex items-center justify-center gap-3 animate-gradient"
                  style={{ backgroundSize: '200% 200%' }}
                >
                  {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
                  <ChevronRight size={20} strokeWidth={2} />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
