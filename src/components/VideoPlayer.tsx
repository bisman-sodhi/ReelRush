'use client';
import VideoActions from './VideoActions';

import { useVideos } from '@/context/VideoContext';
import { useEffect, useRef } from 'react';

export default function VideoPlayer() {
  const { videos } = useVideos();
  const containerRef = useRef<HTMLDivElement>(null); 
  // const topRef = useRef(null); // Reference for scrolling to top

  // Scroll to top when videos array changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth" });
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
              autoPlay={true}
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