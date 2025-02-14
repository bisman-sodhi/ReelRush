'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { cosineSimilarity } from '@/utils/embeddings';
import videoData from '../data/videoData.json';
import { generateIncrementalId } from '../utils/idGenerator';

// create video object
interface Video {
  id: string;
  url: string;
  description?: string; // embedding
  text_description?: string;
  similarity?: number;
  created_at?: string;
}

// create video list
interface VideoContextType {
  videos: Video[];
  addVideo: (video: Video, addToStart?: boolean) => void;
}

// create video context
const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<Video[]>(
    videoData.videos.map(video => ({
      ...video,
      url: video.src,
      description: '',
      text_description: ''
    }))
  );
  const { userId } = useAuth();

  useEffect(() => {
    async function loadPersonalizedFeed() {
      // Get all videos with their embeddings
      const { data: videosData } = await supabase
        .from('videos')
        .select('*');

      console.log('Videos from Supabase:', videosData);

      if (!userId || !videosData) {
        setVideos(videosData || []);
        return;
      }

      // Get user's interests embedding
      const { data: userData } = await supabase
        .from('users')
        .select('interests_embedding')
        .eq('id', userId)
        .single();

      console.log('User interests:', userData);

      if (!userData?.interests_embedding) {
        setVideos(videosData);
        return;
      }

      // Calculate similarity scores
      const userEmbedding = userData.interests_embedding
        .replace(/[\[\]]/g, '')
        .split(',')
        .map(Number);

      const videosWithScores = videosData.map(video => ({
        ...video,
        similarity: cosineSimilarity(
          userEmbedding,
          video.description.replace(/[\[\]]/g, '').split(',').map(Number)
        )
      }));

      // Sort by similarity
      const sortedVideos = videosWithScores.sort((a, b) => 
        (b.similarity || 0) - (a.similarity || 0)
      );

      console.log('Videos sorted by similarity:', sortedVideos);
      setVideos(sortedVideos);
    }

    loadPersonalizedFeed();
  }, [userId]);

  const addVideo = (video: Video, addToStart: boolean = false) => {
    setVideos(prev => 
      addToStart ? [video, ...prev] : [...prev, video]
    );
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