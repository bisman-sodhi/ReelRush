'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  username: string;
  interests: string[];
}

export default function ProfilePage() {
  const { userId } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('username, interests')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl text-black font-bold mb-6">Profile</h1>
      
      {/* Username */}
      <div className="mb-6">
        <h2 className="text-xl text-black font-semibold mb-2">Username</h2>
        <p className="text-lg text-black">@{profile.username}</p>
      </div>

      {/* Interests */}
      <div>
        <h2 className="text-xl text-black font-semibold mb-4">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((interest) => (
            <div
              key={interest}
              className="px-3 py-1 bg-gray-100 text-black rounded-full text-sm"
            >
              {interest}
            </div>
          ))}
        </div>
      </div>
      
      {/* Upload Video */}
      <div className="mt-6">
        <h2 className="text-xl text-black font-semibold mb-4">Upload Video</h2>
          <p className="text-sm text-black">Upload count: {}</p>
      </div>
    </div>
  );
} 