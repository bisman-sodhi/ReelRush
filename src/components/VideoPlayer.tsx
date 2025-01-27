'use client';

import Video from 'next-video';
import getStarted from '/videos/get-started.mp4';
import dog1 from '/videos/dog1.MP4';

export default function VideoPlayer() {
  return (
    <div className="w-full max-w-2xl">
      {/* <Video 
        src="/videos/dog1.MP4"
        controls
      /> */}
      <Video src={getStarted} />
      <Video src={dog1} />
      <Video src="https://niafmdtam5fgm1cs.public.blob.vercel-storage.com/dog2-JoxcUSf5oo9P47PoJrJfUeYr6oxAPp.MP4" />
    </div>
  );
} 