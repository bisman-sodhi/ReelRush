'use client';

import { useState } from 'react';
import { useVideos } from '@/context/VideoContext';
import { useAuth } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';

// Upload utility function
export const uploadVideo = async (file: File) => {
  if (!file.type.startsWith('video/')) {
    throw new Error('Please upload a video file');
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!data.url) {
    throw new Error('Upload failed: No URL returned');
  }

  return data.url;
};

// Hook for video upload
export function useVideoUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { addVideo } = useVideos();
  const { userId } = useAuth();

  const handleVideoUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadVideo(file);
      
      if (userId) {
        // First, save video
        const { error: videoError } = await supabase
          .from('videos')
          .insert({ 
            user_id: userId,
            url: url
          });

        if (videoError) throw videoError;

        // Then, increment count
        const { error: countError } = await supabase.rpc('increment_upload_count', {
          user_id: userId
        });

        if (countError) throw countError;

        // Add to context (will appear at top of feed)
        addVideo({ src: url });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, handleVideoUpload };
} 