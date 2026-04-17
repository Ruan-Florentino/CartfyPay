"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/auth-context";
import { Loader2, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface VideoPlayerProps {
  videoId: string;
  courseId: string;
  storagePath: string; // The path in Firebase Storage
}

export function VideoPlayer({ videoId, courseId, storagePath }: VideoPlayerProps) {
  const { user } = useAuth();
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch Signed URL from our backend
  useEffect(() => {
    const fetchSignedUrl = async () => {
      try {
        // In a real app, you would call an API route that uses firebase-admin to generate a signed URL
        // e.g., const response = await fetch(`/api/video/signed-url?path=${encodeURIComponent(storagePath)}`);
        // const data = await response.json();
        // setSignedUrl(data.url);
        
        // For demonstration, we simulate the API call
        setTimeout(() => {
          setSignedUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Erro ao carregar vídeo.");
        setLoading(false);
      }
    };

    fetchSignedUrl();
  }, [storagePath]);

  // Load saved progress
  useEffect(() => {
    const loadProgress = async () => {
      if (!user || !videoRef.current) return;
      try {
        const progressRef = doc(db, `users/${user.uid}/progress`, `${courseId}_${videoId}`);
        const snap = await getDoc(progressRef);
        if (snap.exists() && snap.data().currentTime) {
          videoRef.current.currentTime = snap.data().currentTime;
        }
      } catch (err) {
        console.error("Erro ao carregar progresso", err);
      }
    };

    if (signedUrl) {
      loadProgress();
    }
  }, [signedUrl, user, courseId, videoId]);

  // Save progress periodically
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !user) return;

    const saveProgress = async () => {
      try {
        const progressRef = doc(db, `users/${user.uid}/progress`, `${courseId}_${videoId}`);
        await setDoc(progressRef, {
          currentTime: video.currentTime,
          duration: video.duration,
          completed: video.currentTime / video.duration > 0.9, // Mark as completed if 90% watched
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error("Erro ao salvar progresso", err);
      }
    };

    const interval = setInterval(saveProgress, 10000); // Save every 10 seconds

    const handlePause = () => saveProgress();
    video.addEventListener('pause', handlePause);

    return () => {
      clearInterval(interval);
      video.removeEventListener('pause', handlePause);
    };
  }, [user, courseId, videoId, signedUrl]);

  if (loading) {
    return (
      <div className="w-full aspect-video bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/10">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error || !signedUrl) {
    return (
      <div className="w-full aspect-video bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/10 text-zinc-500">
        {error || "Vídeo indisponível"}
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group border border-white/10 shadow-2xl">
      <video
        ref={videoRef}
        src={signedUrl}
        className="w-full h-full object-contain"
        controls
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()} // Prevent right-click to save
      />
    </div>
  );
}
