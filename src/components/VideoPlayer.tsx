'use client';
import VideoActions from './VideoActions';

import { useVideos } from '@/context/VideoContext';
import { useRef, useEffect } from 'react';

export default function VideoPlayer() {
  const { videos } = useVideos();
  const containerRef = useRef<HTMLDivElement>(null);

  // const topRef = useRef(null); // Reference for scrolling to top

  // // Scroll to top when videos array changes
  // useEffect(() => {
  //   if (containerRef.current) {
  //     containerRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [videos]);

  const handleVideoEnd = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.target as HTMLVideoElement;
    video.play(); // Replay when ended
  };

  return (
    <>
      {videos.map((video) => (
        <div 
          key={video.id}
          className="h-screen w-full flex items-center justify-center snap-start snap-always"
        >
          <div className="relative h-full aspect-[9/16]">
            <video 
              src={video.url}
              className="h-full w-full object-contain"
              controls
              playsInline
              autoPlay={true}
              muted
              loop
              onEnded={handleVideoEnd}
              onError={(e) => console.error('Video error:', e)}
            />
            {video.id && <VideoActions videoId={video.id} />}
          </div>
        </div>
      ))}
    </>
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