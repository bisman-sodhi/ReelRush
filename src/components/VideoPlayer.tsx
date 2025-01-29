'use client';
import VideoActions from './VideoActions';
// const d2 = 'https://niafmdtam5fgm1cs.public.blob.vercel-storage.com/dog2-JoxcUSf5oo9P47PoJrJfUeYr6oxAPp.MP4'
// const d3 = 'https://niafmdtam5fgm1cs.public.blob.vercel-storage.com/dog3-FiGUVJn48jSel38f7XgYBsnu5a6gRb.mp4'
// const videos = [
//   { id: 'video-3', src: d2 },
//   { id: 'video-4', src: d3 },
// ];

import { useVideos } from '@/context/VideoContext';
import { useEffect, useRef } from 'react';

export default function VideoPlayer() {
  const { videos } = useVideos();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when videos array changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [videos]);

  return (
    <div className="w-full" ref={containerRef}>
      {videos.map((video) => (
        <div 
          key={video.id}
          className="h-screen flex justify-center snap-start snap-always"
        >
          <div className="h-full aspect-[9/16]">
            <video 
              key={video.id}
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

// export default function VideoPlayer() {
//   return (
//     <div className="flex justify-center items-center h-screen snap-start snap-always">
//       <video controls className="w-[80%] max-w-3xl rounded-lg shadow-lg">
//         <source src={d2} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//       <video controls className="w-[80%] max-w-3xl rounded-lg shadow-lg">
//         <source src={d3} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//     </div>
//   );
// }