"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface PlayerContextType {
  isMiniPlayerVisible: boolean;
  showMiniPlayer: () => void;
  hideMiniPlayer: () => void;
  currentLesson: {
    courseTitle: string;
    lessonTitle: string;
    progress: number;
    thumbnail: string;
  } | null;
  setCurrentLesson: (lesson: any) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [isMiniPlayerVisible, setIsMiniPlayerVisible] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<{
    courseTitle: string;
    lessonTitle: string;
    progress: number;
    thumbnail: string;
  } | null>({
    courseTitle: "Mestre em Vendas Online",
    lessonTitle: "O funil de vendas",
    progress: 45,
    thumbnail: "https://picsum.photos/seed/video/800/450"
  });

  const showMiniPlayer = useCallback(() => setIsMiniPlayerVisible(true), []);
  const hideMiniPlayer = useCallback(() => setIsMiniPlayerVisible(false), []);

  return (
    <PlayerContext.Provider value={{ isMiniPlayerVisible, showMiniPlayer, hideMiniPlayer, currentLesson, setCurrentLesson }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
