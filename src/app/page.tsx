import Image from "next/image";
import Video from 'next-video';
import VideoPlayer from '../components/VideoPlayer';
// import NavigationMenu from '@/components/NavigationMenu';

export default function HomePage() {
  const trendingTags = [
    { tag: 'love', count: '2.4M' },
    { tag: 'dance', count: '1.8M' },
    { tag: 'food', count: '1.2M' },
    { tag: 'music', count: '956K' },
    { tag: 'pets', count: '847K' },
    { tag: 'travel', count: '723K' },
    { tag: 'fitness', count: '612K' },
  ];

// flex min-h-screen
// 

  return (
    <div className="flex h-screen overflow-y-auto snap-y snap-mandatory">
      {/* Left Sidebar - Trending */}
      <div className="w-[260px] fixed left-0 top-0 bottom-0 bg-white p-4">
        <h2 className="font-bold text-2xl text-black mb-4">#Trending</h2>
        <ul className="space-y-2">
          {trendingTags.map(({ tag, count }) => (
            <li 
              key={tag}
              className="group cursor-pointer transition-all duration-200 ease-in-out"
            >
              <div className="flex items-center gap-4 p-1 rounded-lg hover:bg-gray-50 transform group-hover:scale-105">
                <span className="text-lg text-black group-hover:font-semibold">
                  #{tag}
                </span>
                <span className="text-sm text-gray-500 group-hover:text-black">
                  {count}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content - Video */}
      <div className="flex-1 ml-[400px] mr-[400px]">
        <VideoPlayer />
      </div>

      {/* Right Section */}
      <div className="w-[260px] fixed right-[100px] top-0 bottom-0 bg-white p-4">
        {/* Right section content */}
      </div>

      {/* Right Navigation Bar remains unchanged */}
    </div>
  );
}
