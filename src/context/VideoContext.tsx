'use client';

import { createContext, useContext, useState } from 'react';

// create video object
interface Video {
  id: string;
  src: string;
}

// create video list
interface VideoContextType {
  videos: Video[];
  addVideo: (video: { src: string }) => void;
}

// create video context
const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<Video[]>([
    { 
      id: 'video-3', 
      src: 'https://niafmdtam5fgm1cs.public.blob.vercel-storage.com/dog2-JoxcUSf5oo9P47PoJrJfUeYr6oxAPp.MP4'
    },
    { 
      id: 'video-4', 
      src: 'https://niafmdtam5fgm1cs.public.blob.vercel-storage.com/dog3-FiGUVJn48jSel38f7XgYBsnu5a6gRb.mp4'
    },
  ]);

  const addVideo = (video: { src: string }) => {
    const newVideo = {
      id: `video-${Date.now()}`, // Generate unique ID
      src: video.src,
    };
    setVideos(prevVideos => [newVideo, ...prevVideos]);
  };

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