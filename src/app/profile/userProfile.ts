// This is the useProfile hook that fetches the user's profile information from the database
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  username: string;
  interests: string[];
  upload_count: number;
}

interface UserVideo {
  id: string;
  url: string;
  created_at: string;
  title?: string;
  description?: string;
}

export function useProfile() {
  const { userId } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username, interests, upload_count')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();

    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`
        },
        fetchProfile
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId, fetchProfile]);

  return { profile, loading, fetchProfile };
}

export function useUserVideos() {
  const { userId } = useAuth();
  const [videos, setVideos] = useState<UserVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserVideos = useCallback(async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserVideos();

    const channel = supabase
      .channel('videos_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'videos',
          filter: `user_id=eq.${userId}`
        },
        fetchUserVideos
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId, fetchUserVideos]);

  return { videos, loading, fetchUserVideos };
} 