'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { cosineSimilarity } from '@/utils/embeddings';

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
  const [videos, setVideos] = useState<Video[]>([]);
  const { userId } = useAuth();

  useEffect(() => {
    async function loadPersonalizedFeed() {
      try {
        // First check if user exists in Supabase
        if (userId) {
          const { data: userExists } = await supabase
            .from('users')
            .select('id, interests')  // Also get interests for logging
            .eq('id', userId)
            .single();

          // If user doesn't exist yet (not onboarded), don't try to personalize
          if (!userExists) {
            console.log('📢 Loading default feed (user not onboarded yet)');
            const { data: defaultVideos } = await supabase
              .from('videos')
              .select('*');
            setVideos(defaultVideos || []);
            return;
          }
          console.log('👤 User interests:', userExists.interests);
        }

        // Get all videos with their embeddings
        const { data: videosData, error: videosError } = await supabase
          .from('videos')
          .select('*');

        if (videosError) throw videosError;
        console.log('Videos from Supabase:', videosData);

        if (!userId || !videosData) {
          console.log('📢 Loading default feed (no user or videos)');
          setVideos(videosData || []);
          return;
        }

        // Get user's interests embedding
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('interests_embedding')
          .eq('id', userId)
          .single();

        if (userError) throw userError;
        console.log('User interests:', userData);

        if (!userData?.interests_embedding) {
          console.log('📢 Loading default feed (no user interests embedding)');
          setVideos(videosData);
          return;
        }

        console.log('🎯 Generating personalized feed...');

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

        // Sort by similarity (highest first)
        const sortedVideos = videosWithScores.sort((a, b) => 
          (b.similarity || 0) - (a.similarity || 0)
        );

        console.log('🎬 Videos ranked by similarity:');
        sortedVideos.forEach(video => {
          console.log(`   ${video.title || video.id}: ${(video.similarity || 0).toFixed(3)} similarity`);
        });

        setVideos(sortedVideos);
      } catch (error) {
        console.error('❌ Error loading personalized feed:', error);
        const { data } = await supabase.from('videos').select('*');
        console.log('📢 Falling back to default feed');
        setVideos(data || []);
      }
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