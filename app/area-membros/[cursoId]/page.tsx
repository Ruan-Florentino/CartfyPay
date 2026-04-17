"use client";

import { use } from "react";
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Play, CheckCircle2, Lock, ChevronLeft, ChevronRight, MessageSquare, Download, Award, Menu, X, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function AreaMembros({ params }: { params: Promise<{ cursoId: string }> }) {
  const unwrappedParams = use(params);
  const cursoId = unwrappedParams.cursoId;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLesson, setActiveLesson] = useState(1); // 1-indexed lesson ID
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [progressData, setProgressData] = useState<Record<number, { completed: boolean; currentTime: number }>>({});

  const course = {
    title: "Método Vendas Automáticas",
    progress: 35,
    modules: [
      {
        id: 1,
        title: "Módulo 1: A Fundação",
        lessons: [
          { id: 1, title: "Boas-vindas e Mindset", duration: "12:45", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
          { id: 2, title: "Como a plataforma funciona", duration: "08:20", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
          { id: 3, title: "Definindo seu nicho lucrativo", duration: "25:10", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
        ]
      },
      {
        id: 2,
        title: "Módulo 2: Criando o Produto",
        lessons: [
          { id: 4, title: "Estrutura da oferta irresistível", duration: "18:30", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
          { id: 5, title: "Gerando conteúdo com IA", duration: "32:15", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
        ]
      }
    ]
  };

  const currentLessonData = course.modules.flatMap(m => m.lessons).find(l => l.id === activeLesson) || course.modules[0].lessons[0];

  // Load progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "courseProgress", `${user.uid}_${cursoId}`);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setProgressData(snap.data().lessons || {});
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };
    fetchProgress();
  }, [user, cursoId]);

  // Load video current time on active lesson change
  useEffect(() => {
    if (videoRef.current) {
      const savedProgress = progressData[activeLesson];
      if (savedProgress && savedProgress.currentTime) {
        videoRef.current.currentTime = savedProgress.currentTime;
      } else {
        videoRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      videoRef.current.pause();
    }
  }, [activeLesson, progressData]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      // Automatically save progress every 5 seconds (simplification)
      if (Math.floor(videoRef.current.currentTime) % 5 === 0) {
        saveProgressLocally(videoRef.current.currentTime, false);
      }
      // Check if near end to mark completed
      if (duration > 0 && videoRef.current.currentTime / duration > 0.9) {
         saveProgressLocally(videoRef.current.currentTime, true);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const saveProgressLocally = (time: number, isCompleted: boolean) => {
    const isAlreadyCompleted = progressData[activeLesson]?.completed;
    const newProgress = {
      ...progressData,
      [activeLesson]: {
        currentTime: time,
        completed: isAlreadyCompleted || isCompleted
      }
    };
    setProgressData(newProgress);
    
    // Throttle firestore updates in production, but here we'll update directly for the demo
    saveToFirestore(newProgress);
  };

  const saveToFirestore = async (pData: any) => {
    if (!user) return;
    try {
      const docRef = doc(db, "courseProgress", `${user.uid}_${cursoId}`);
      await setDoc(docRef, {
        userId: user.uid,
        courseId: cursoId,
        lessons: pData,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Compute calculated progress
  const completedLessonsCount = Object.values(progressData).filter(v => v.completed).length;
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const calculatedProgress = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white flex overflow-hidden">
      {/* Sidebar Mobile Overlay */}
      {!sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: sidebarOpen ? 320 : 0,
          opacity: sidebarOpen ? 1 : 0,
          x: sidebarOpen ? 0 : -320
        }}
        className="fixed md:relative z-50 h-screen bg-[#111118] border-r border-white/5 flex flex-col shrink-0 overflow-hidden"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="font-black text-lg truncate">{course.title}</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#6C2BFF] rounded-full transition-all duration-500" style={{ width: `${calculatedProgress}%` }} />
              </div>
              <span className="text-xs font-bold text-[#6C2BFF]">{calculatedProgress}%</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {course.modules.map((module) => (
            <div key={module.id} className="space-y-2">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-2">{module.title}</h3>
              <div className="space-y-1">
                {module.lessons.map((lesson) => {
                  const isActive = currentLessonData.id === lesson.id;
                  const isCompleted = progressData[lesson.id]?.completed;
                  // For demo, previous lesson completion logic:
                  const prevLessonCompleted = lesson.id === 1 || progressData[lesson.id - 1]?.completed;
                  const isLocked = !prevLessonCompleted && lesson.id > 1;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => !isLocked && setActiveLesson(lesson.id)}
                      disabled={isLocked}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        isActive 
                          ? 'bg-[#6C2BFF]/10 border border-[#6C2BFF]/20 text-white' 
                          : isLocked 
                            ? 'opacity-50 cursor-not-allowed text-zinc-500' 
                            : 'hover:bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 size={18} className="text-[#6C2BFF]" />
                        ) : isLocked ? (
                          <Lock size={18} className="text-zinc-600" />
                        ) : isActive ? (
                          <Play size={18} className="text-[#6C2BFF] fill-[#6C2BFF]" />
                        ) : (
                          <div className="w-[18px] h-[18px] rounded-full border-2 border-zinc-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isActive ? 'font-bold' : ''}`}>{lesson.title}</p>
                        <p className="text-[10px] mt-0.5">{lesson.duration}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 bg-[#0B0B0F]/80 backdrop-blur-xl flex items-center justify-between px-4 shrink-0 z-10 transition-transform">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                <Menu size={20} />
              </button>
            )}
            <Link href="/dashboard" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
              <ChevronLeft size={16} /> Voltar
            </Link>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors">
            <Award size={16} /> Certificado
          </button>
        </header>

        {/* Video Area */}
        <div className="flex-1 overflow-y-auto bg-[#0B0B0F]">
          <div className="w-full bg-black relative" onMouseMove={handleMouseMove} onMouseLeave={() => isPlaying && setShowControls(false)}>
            {/* Real Video Player */}
            <div className="aspect-video max-w-6xl mx-auto flex items-center justify-center relative overflow-hidden group">
              <video
                ref={videoRef}
                src={currentLessonData.video}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
              />
              
              {/* Play Overlay (Big Button) */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none transition-opacity">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 rounded-full bg-[#6C2BFF]/80 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(108,43,255,0.5)] border border-white/20"
                  >
                    <Play size={32} className="text-white fill-white ml-2" />
                  </motion.div>
                </div>
              )}

              {/* Controls */}
              <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 flex flex-col gap-2 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                {/* Progress Bar */}
                <div className="w-full flex items-center gap-2 px-2">
                   <span className="text-[10px] font-medium min-w-[36px]">{formatTime(currentTime)}</span>
                   <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#6C2BFF] [&::-webkit-slider-thumb]:rounded-full cursor-pointer focus:outline-none"
                    style={{ backgroundSize: `${(currentTime / duration) * 100}% 100%`, backgroundImage: `linear-gradient(to right, #6C2BFF, #6C2BFF)` }}
                  />
                  <span className="text-[10px] font-medium min-w-[36px]">{formatTime(duration)}</span>
                </div>
                
                {/* Bottom Controls */}
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-4">
                    <button onClick={togglePlay} className="text-white hover:text-[#6C2BFF] transition-colors">
                      {isPlaying ? <Pause size={20} /> : <Play size={20} className="fill-current" />}
                    </button>
                    <div className="flex items-center gap-2 group/volume">
                      <button onClick={toggleMute} className="text-white hover:text-[#6C2BFF] transition-colors">
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-white">
                      <button onClick={toggleFullScreen} className="hover:text-[#6C2BFF] transition-colors">
                        <Maximize size={18} />
                      </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Info */}
          <div className="p-6 md:p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">{currentLessonData.title}</h1>
                <p className="text-zinc-400 text-sm">Módulo 1 • Aula {currentLessonData.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => activeLesson > 1 && setActiveLesson(activeLesson - 1)}
                  disabled={activeLesson === 1}
                  className="px-4 py-2 rounded-xl border border-white/10 text-sm font-bold hover:bg-white/5 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft size={16} /> Anterior
                </button>
                <button 
                  onClick={() => activeLesson < Object.keys(course.modules.flatMap(m => m.lessons)).length && setActiveLesson(activeLesson + 1)}
                  className="px-4 py-2 rounded-xl bg-[#6C2BFF] text-white text-sm font-bold hover:bg-[#6C2BFF]/90 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(108,43,255,0.3)]"
                >
                  Próxima <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/10 flex gap-6 mb-6">
              <button className="pb-4 border-b-2 border-[#6C2BFF] text-white font-bold text-sm">
                Visão Geral
              </button>
              <button className="pb-4 border-b-2 border-transparent text-zinc-500 hover:text-zinc-300 font-bold text-sm flex items-center gap-2">
                Materiais <Download size={14} />
              </button>
              <button className="pb-4 border-b-2 border-transparent text-zinc-500 hover:text-zinc-300 font-bold text-sm flex items-center gap-2">
                Comentários (12) <MessageSquare size={14} />
              </button>
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none">
              <p className="text-zinc-300 leading-relaxed">
                Nesta aula, vamos aprender os fundamentos essenciais para construir uma oferta que vende todos os dias. 
                Preste muita atenção nos conceitos de ancoragem de preço e criação de urgência real.
              </p>
              <div className="mt-8 p-6 bg-[#111118] border border-white/5 rounded-2xl">
                <h4 className="font-bold mb-4 flex items-center gap-2"><Download size={18} className="text-[#6C2BFF]" /> Materiais Complementares</h4>
                <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-500 font-bold text-xs">PDF</div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Resumo da Aula + Exercícios</p>
                      <p className="text-xs text-zinc-500">2.4 MB</p>
                    </div>
                  </div>
                  <Download size={18} className="text-zinc-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
