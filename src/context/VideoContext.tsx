'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import videoData from '../data/videoData.json';
import { generateIncrementalId } from '../utils/idGenerator';

// create video object
interface Video {
  id: string;
  src: string;
  created_at?: string;  // Make created_at optional
}

// create video list
interface VideoContextType {
  videos: Video[];
  addVideo: (video: Video, addToStart?: boolean) => void;
}

// create video context
const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<Video[]>(videoData.videos);

  const addVideo = useCallback((video: Video, addToStart: boolean = false) => {
    setVideos(prev => 
      addToStart ? [video, ...prev] : [...prev, video]
    );
  }, []);

  return (
    <VideoContext.Provider value={{ videos, addVideo }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideos() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideos must be used within a VideoProvider');
  }
  return context;
} 