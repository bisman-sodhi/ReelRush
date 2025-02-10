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

  // Send to upload API endpoint
  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!data.url) {
    throw new Error('Upload failed: No URL returned');
  }

  return { url: data.url, description: data.description };
};

// Hook for video upload
export function useVideoUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { addVideo } = useVideos();
  const { userId } = useAuth();

  const handleVideoUpload = async (file: File) => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("File selected:", file.name, file.type, file.size);
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!data.url) {
        throw new Error('Upload failed - no URL returned');
      }

      // Save to Supabase
      if (userId) {
        await supabase
          .from('videos')
          .insert({
            user_id: userId,
            url: data.url
          });
      }

      addVideo({ src: data.url });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, handleVideoUpload };
} 