// This is the profile page that displays the user's profile information
// It uses the useProfile hook to fetch the user's profile information from the database
'use client';
import { useUserVideos, useProfile } from '@/app/profile/userProfile';
// import { useUserVideos } from '@/app/profile/userVideos';

export default function ProfilePage() {
  const { profile, loading: profileLoading } = useProfile();
  const { videos, loading: videosLoading } = useUserVideos();

  if (profileLoading || videosLoading) return <div>Loading...</div>;
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
  );
} 