'use client';

import Video from 'next-video';
import dogVideo from '/videos/dog1.MP4';

export default function VideoPlayer() {
  return (
    <div className="w-full max-w-2xl">
      <Video src={dogVideo} />
    </div>
  );
} 