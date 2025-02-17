// This is the profile page that displays the user's profile information
// It uses the useProfile hook to fetch the user's profile information from the database
'use client';
import { useUserVideos, useProfile } from '@/app/profile/userProfile';
// import { useUserVideos } from '@/app/profile/userVideos';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { InterestEditor } from '@/components/InterestEditor';
import { VideoProvider } from '@/context/VideoContext';

export default function ProfilePage() {
  const { profile, loading: profileLoading } = useProfile();
  const { videos, loading: videosLoading } = useUserVideos();
  const { userId } = useAuth();
  const [userInterests, setUserInterests] = useState<string[]>([]);
  
  useEffect(() => {
    async function loadUserInterests() {
      if (!userId) return;
      
      const { data } = await supabase
        .from('users')
        .select('interests')
        .eq('id', userId)
        .single();
        
      if (data?.interests) {
        setUserInterests(data.interests);
      }
    }
    
    loadUserInterests();
  }, [userId]);

  const handleInterestsUpdate = () => {
    window.location.reload();
  };

  if (profileLoading || videosLoading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="p-8">
        <h1 className="text-3xl text-black font-bold mb-6">Profile</h1>
        
        {/* Username */}
        <div className="mb-6">
          <h2 className="text-xl text-black font-semibold mb-2">Username</h2>
          <p className="text-lg text-black">@{profile.username}</p>
        </div>

        {/* Interests with Edit Functionality */}
        <div className="mb-6">
          <InterestEditor 
            currentInterests={userInterests}
            onUpdate={handleInterestsUpdate}
          />
        </div>
        
        {/* Upload Video */}
        <div className="mt-6">
          <h2 className="text-xl text-black font-semibold mb-4">Upload Video</h2>
          <p className="text-sm text-black">Upload count: {profile.upload_count}</p>
        </div>

        {/* Videos Grid */}
        <div className="mt-8">
          <h2 className="text-xl text-black font-semibold mb-4">My Videos</h2>
          <div className="grid grid-cols-3 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="aspect-[9/16] relative bg-gray-100 rounded-lg overflow-hidden">
                <video 
                  src={video.url}
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  playsInline
                  onMouseOver={e => e.currentTarget.play()}
                  onMouseOut={e => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 