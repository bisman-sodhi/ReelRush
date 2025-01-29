'use client';

import { createContext, useContext, useState } from 'react';
import videoData from '../data/videoData.json';
import { generateIncrementalId } from '../utils/idGenerator';

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
  const [videos, setVideos] = useState<Video[]>(videoData.videos);

  const addVideo = (video: { src: string }) => {
    const newVideo = {
      id: generateIncrementalId(),
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