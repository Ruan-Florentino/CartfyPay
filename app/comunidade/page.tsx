"use client";

import { motion } from "motion/react";
import { MessageSquare, Heart, Share2, MoreHorizontal, Image as ImageIcon, Send, Sparkles, Flame, Trophy, Award, Pin, Trash2, Edit2, BellRing, Users } from "lucide-react";
import { useState } from "react";
import { useMode } from "@/lib/mode-context";
import { useCommunity } from "@/contexts/community-context";

export default function Comunidade() {
  const { mode } = useMode();
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<{ postId: string, commentId: string, author: string } | null>(null);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [isNotice, setIsNotice] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [newPostVideo, setNewPostVideo] = useState("");
  const [newPostLink, setNewPostLink] = useState("");
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const { posts, addPost, deletePost, editPost, togglePin, likePost, addComment, likeComment, replyComment } = useCommunity();

  const handleEdit = (post: any) => {
    setEditingPostId(post.id);
    setEditContent(post.content);
  };

  const handleSaveEdit = (id: string) => {
    if (!editContent.trim()) return;
    editPost(id, editContent);
    setEditingPostId(null);
    setEditContent("");
  };

  const handleLike = (id: string) => {
    if (likedPosts.includes(id)) {
      setLikedPosts(likedPosts.filter(postId => postId !== id));
    } else {
      setLikedPosts([...likedPosts, id]);
      likePost(id);
    }
  };

  const handlePublishComment = (postId: string) => {
    if (!newCommentContent.trim()) return;
    
    if (replyingTo && replyingTo.postId === postId) {
      replyComment(postId, replyingTo.commentId, {
        author: mode === 'vendedor' ? "Professor" : "Aluno",
        avatar: "https://i.pravatar.cc/150?img=11",
        content: newCommentContent,
      });
      setReplyingTo(null);
    } else {
      addComment(postId, {
        author: mode === 'vendedor' ? "Professor" : "Aluno",
        avatar: "https://i.pravatar.cc/150?img=11",
        content: newCommentContent,
      });
    }
    setNewCommentContent("");
  };

  const handlePublish = () => {
    if (!newPostContent.trim()) return;
    addPost({
      author: mode === 'vendedor' ? "Professor" : "Aluno",
      role: mode === 'vendedor' ? "Professor" : "Aluno",
      avatar: "https://i.pravatar.cc/150?img=11",
      title: newPostTitle.trim() || undefined,
      content: newPostContent,
      hasImage: !!newPostImage.trim(),
      image: newPostImage.trim() || undefined,
      video: newPostVideo.trim() || undefined,
      link: newPostLink.trim() || undefined,
      badges: mode === 'vendedor' ? ["Autor"] : [],
      isPinned: false,
      isNotice: isNotice,
    });
    setNewPostContent("");
    setNewPostTitle("");
    setNewPostImage("");
    setNewPostVideo("");
    setNewPostLink("");
    setIsNotice(false);
    setShowExtraFields(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] pb-32 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-gradient-to-b from-[#6C2BFF]/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      <div className="p-6 pt-12 flex justify-between items-center sticky top-0 bg-[#0B0B0F]/80 backdrop-blur-2xl z-40 border-b border-white/5 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.02em] tracking-tight text-white">Comunidade</h1>
          <p className="text-zinc-400 text-sm mt-1 font-medium">
            {mode === "vendedor" ? "Gerencie a comunidade dos seus alunos." : "Interaja com outros alunos e professores."}
          </p>
        </div>
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6C2BFF]/20 to-purple-500/20 border border-[#6C2BFF]/30 flex items-center justify-center shadow-[0_0_15px_rgba(108,43,255,0.3)]"
        >
          <Users size={24} className="text-[#6C2BFF]" />
        </motion.div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Create Post - Only for Vendedor or specific rules */}
        {mode === "vendedor" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111118]/80 backdrop-blur-xl p-5 rounded-[28px] border border-white/10 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#FF5F00]/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#FF5F00]/30 shadow-[0_0_15px_rgba(255,95,0,0.2)]">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-3">
                  {showExtraFields && (
                    <input
                      type="text"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder="Título do post (opcional)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-zinc-500 text-sm focus:border-[#FF5F00]/50 outline-none transition-colors"
                    />
                  )}
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Compartilhe um aviso ou conteúdo com seus alunos..."
                    className="w-full bg-transparent border-none outline-none text-white placeholder:text-zinc-500 text-base resize-none min-h-[60px] pt-2"
                  />
                  {showExtraFields && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newPostImage}
                        onChange={(e) => setNewPostImage(e.target.value)}
                        placeholder="URL da Imagem (opcional)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-zinc-500 text-sm focus:border-[#FF5F00]/50 outline-none transition-colors"
                      />
                      <input
                        type="text"
                        value={newPostVideo}
                        onChange={(e) => setNewPostVideo(e.target.value)}
                        placeholder="URL do Vídeo (opcional)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-zinc-500 text-sm focus:border-[#FF5F00]/50 outline-none transition-colors"
                      />
                      <input
                        type="text"
                        value={newPostLink}
                        onChange={(e) => setNewPostLink(e.target.value)}
                        placeholder="Link Externo (opcional)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-zinc-500 text-sm focus:border-[#FF5F00]/50 outline-none transition-colors"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowExtraFields(!showExtraFields)}
                    className={`transition-colors p-2.5 rounded-2xl flex items-center gap-2 group/btn ${showExtraFields ? 'text-[#FF5F00] bg-[#FF5F00]/10' : 'text-zinc-400 hover:text-[#FF5F00] hover:bg-[#FF5F00]/10'}`}
                  >
                    <ImageIcon size={20} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setIsNotice(!isNotice)}
                    className={`transition-colors p-2.5 rounded-2xl flex items-center gap-2 group/btn ${isNotice ? 'text-yellow-500 bg-yellow-500/10' : 'text-zinc-400 hover:text-yellow-500 hover:bg-yellow-500/10'}`}
                  >
                    <BellRing size={20} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
                <motion.button 
                  onClick={handlePublish}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-[#FF5F00] to-[#FF8C00] text-white px-6 py-2.5 rounded-2xl text-sm font-bold shadow-[0_5px_20px_rgba(255,95,0,0.4)] hover:shadow-[0_5px_25px_rgba(255,95,0,0.6)] transition-all flex items-center gap-2"
                >
                  <span>Publicar</span>
                  <Send size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Feed */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {posts.map((post) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              className={`bg-[#111118]/80 backdrop-blur-xl p-5 sm:p-6 rounded-[28px] border ${post.isPinned ? 'border-[#FF5F00]/30' : 'border-white/10'} shadow-xl hover:border-white/20 transition-colors relative overflow-hidden group`}
            >
              {/* Pinned Indicator */}
              {post.isPinned && (
                <div className="absolute top-0 right-0 bg-[#FF5F00]/20 text-[#FF5F00] text-[10px] font-bold px-3 py-1 rounded-bl-2xl flex items-center gap-1">
                  <Pin size={12} /> Fixado
                </div>
              )}

              {/* Notice Indicator */}
              {post.isNotice && (
                <div className="absolute top-0 left-0 bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-3 py-1 rounded-br-2xl flex items-center gap-1">
                  <BellRing size={12} /> Aviso
                </div>
              )}

              {/* Post Header */}
              <div className={`flex justify-between items-start mb-4 relative z-10 ${post.isPinned || post.isNotice ? 'mt-4' : ''}`}>
                <div className="flex gap-3 items-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white/10">
                      <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" />
                    </div>
                    {post.role === 'Professor' && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-tr from-[#FF5F00] to-[#FF8C00] rounded-full flex items-center justify-center border-2 border-[#111118] shadow-lg">
                        <Award size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-white text-sm sm:text-base">{post.author}</h4>
                      {post.badges.map((badge, i) => (
                        <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-zinc-300 border border-white/10 flex items-center gap-1">
                          {badge === 'Primeira Venda' && <Flame size={10} className="text-orange-500" />}
                          {badge === 'Top Contribuidor' && <Trophy size={10} className="text-yellow-500" />}
                          {badge}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-xs mt-0.5 font-medium">
                      <span className={post.role === 'Professor' ? 'text-[#FF5F00]' : ''}>{post.role}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                </div>
                
                {/* Seller Actions */}
                {mode === "vendedor" && post.role === "Professor" ? (
                  <div className="flex gap-1">
                    <button onClick={() => togglePin(post.id)} className="text-zinc-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                      <Pin size={16} />
                    </button>
                    <button onClick={() => handleEdit(post)} className="text-zinc-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deletePost(post.id)} className="text-zinc-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-500/10">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <button className="text-zinc-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                    <MoreHorizontal size={20} />
                  </button>
                )}
              </div>

              {/* Post Content */}
              {editingPostId === post.id ? (
                <div className="mb-4 relative z-10">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-zinc-500 text-sm resize-none min-h-[80px] focus:border-[#FF5F00]/50 outline-none transition-colors"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => setEditingPostId(null)} className="text-zinc-400 hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                      Cancelar
                    </button>
                    <button onClick={() => handleSaveEdit(post.id)} className="bg-[#FF5F00] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#e65500] transition-colors">
                      Salvar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-4 relative z-10">
                  {post.title && (
                    <h3 className="text-white font-bold text-lg mb-2">{post.title}</h3>
                  )}
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {post.content}
                  </p>
                </div>
              )}

              {post.hasImage && post.image && (
                <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden mb-4 border border-white/5 shadow-inner relative z-10 group/img">
                  <img src={post.image} alt="Post attachment" className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700" />
                </div>
              )}

              {post.video && (
                <div className="w-full aspect-video rounded-2xl overflow-hidden mb-4 border border-white/5 shadow-inner relative z-10">
                  <iframe 
                    src={post.video} 
                    className="w-full h-full" 
                    allowFullScreen 
                    title="Post video"
                  ></iframe>
                </div>
              )}

              {post.link && (
                <a 
                  href={post.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 mb-4 transition-colors relative z-10"
                >
                  <div className="flex items-center gap-2 text-[#6C2BFF]">
                    <Sparkles size={16} />
                    <span className="text-sm font-medium truncate">{post.link}</span>
                  </div>
                </a>
              )}

              {/* Post Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-white/5 relative z-10">
                <motion.button 
                  onClick={() => handleLike(post.id)}
                  whileTap={{ scale: 0.9 }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${likedPosts.includes(post.id) ? 'bg-pink-500/10 text-pink-500' : 'text-zinc-400 hover:bg-white/5 hover:text-pink-500'}`}
                >
                  <Heart size={18} className={likedPosts.includes(post.id) ? 'fill-pink-500' : ''} />
                  <span className="text-xs font-bold">{post.likes}</span>
                </motion.button>
                <motion.button 
                  onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                  whileTap={{ scale: 0.9 }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${expandedPostId === post.id ? 'bg-[#6C2BFF]/10 text-[#6C2BFF]' : 'text-zinc-400 hover:bg-[#6C2BFF]/10 hover:text-[#6C2BFF]'}`}
                >
                  <MessageSquare size={18} />
                  <span className="text-xs font-bold">{post.comments.length}</span>
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition-all ml-auto"
                >
                  <Share2 size={18} />
                </motion.button>
              </div>

              {/* Comments Section */}
              {expandedPostId === post.id && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 pt-4 border-t border-white/5 relative z-10"
                >
                  {/* Comments List */}
                  <div className="space-y-4 mb-4">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="space-y-2">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10">
                            <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 bg-white/5 rounded-2xl p-3 border border-white/5">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-white text-sm">{comment.author}</span>
                              <span className="text-zinc-500 text-[10px]">{comment.time}</span>
                            </div>
                            <p className="text-zinc-300 text-sm">{comment.content}</p>
                            <div className="flex gap-3 mt-2">
                              <button onClick={() => likeComment(post.id, comment.id)} className="text-zinc-500 hover:text-pink-500 text-xs font-bold flex items-center gap-1 transition-colors">
                                <Heart size={12} /> {comment.likes > 0 && comment.likes}
                              </button>
                              <button onClick={() => setReplyingTo({ postId: post.id, commentId: comment.id, author: comment.author })} className="text-zinc-500 hover:text-white text-xs font-bold transition-colors">
                                Responder
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="pl-11 space-y-3 mt-2">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-white/10">
                                  <img src={reply.avatar} alt={reply.author} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 bg-white/5 rounded-2xl p-3 border border-white/5">
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-white text-xs">{reply.author}</span>
                                    <span className="text-zinc-500 text-[10px]">{reply.time}</span>
                                  </div>
                                  <p className="text-zinc-300 text-xs">{reply.content}</p>
                                  <div className="flex gap-3 mt-2">
                                    <button onClick={() => likeComment(post.id, reply.id)} className="text-zinc-500 hover:text-pink-500 text-[10px] font-bold flex items-center gap-1 transition-colors">
                                      <Heart size={10} /> {reply.likes > 0 && reply.likes}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Comment Input */}
                  <div className="flex gap-3 items-end">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10 mb-1">
                      <img src="https://i.pravatar.cc/150?img=11" alt="Me" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 relative">
                      {replyingTo && replyingTo.postId === post.id && (
                        <div className="absolute -top-6 left-2 text-xs text-[#6C2BFF] flex items-center gap-2">
                          <span>Respondendo a <span className="font-bold">{replyingTo.author}</span></span>
                          <button onClick={() => setReplyingTo(null)} className="text-zinc-500 hover:text-white">✕</button>
                        </div>
                      )}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-1 flex items-center focus-within:border-[#6C2BFF]/50 transition-colors">
                        <input
                          type="text"
                          value={newCommentContent}
                          onChange={(e) => setNewCommentContent(e.target.value)}
                          placeholder={replyingTo && replyingTo.postId === post.id ? `Responder a ${replyingTo.author}...` : "Escreva um comentário..."}
                          className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-zinc-500 text-sm px-3 py-2"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handlePublishComment(post.id);
                          }}
                        />
                        <button 
                          onClick={() => handlePublishComment(post.id)}
                          className="bg-[#6C2BFF] text-white p-2 rounded-xl hover:bg-[#5b24d8] transition-colors"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
