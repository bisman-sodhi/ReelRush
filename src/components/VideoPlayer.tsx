'use client';

import NextVideo from 'next-video';
import dog1 from '/videos/dog1.MP4';
import dog2 from '/videos/dog2.MP4';
import VideoActions from './VideoActions';

const videos = [
  { id: 'video-1', src: dog1 },
  { id: 'video-2', src: dog2 },
];

export default function VideoPlayer() {
  return (
    <div className="w-full">
      {videos.map((video) => (
        <div 
          key={video.id}
          className="h-screen flex justify-center items-center snap-start"
        >
          <div className="relative max-h-[calc(100vh-32px)] aspect-[9/16] max-w-[500px]">
            <NextVideo
              src={video.src}
              className="h-full w-full object-contain"
              controls
              playsInline
              autoPlay={false}
              muted
            />
            <VideoActions videoId={video.id} />
          </div>
        </div>
      ))}
    </div>
  );
}