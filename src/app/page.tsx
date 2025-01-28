import Image from "next/image";
import Video from 'next-video';
import VideoPlayer from '../components/VideoPlayer';
import NavigationMenu from '@/components/NavigationMenu';

export default function Home() {
  const trendingTags = [
    { tag: 'love', count: '2.4M' },
    { tag: 'dance', count: '1.8M' },
    { tag: 'food', count: '1.2M' },
    { tag: 'music', count: '956K' },
    { tag: 'pets', count: '847K' },
    { tag: 'travel', count: '723K' },
    { tag: 'fitness', count: '612K' },
  ];

  return (
    <div className="min-h-screen pt-28">
      <NavigationMenu />
      <div className="flex gap-6">
        {/* Left Sidebar - Fixed */}
        <div className="w-72 hidden lg:block">
          <div className="fixed pl-2">
            <h2 className="font-bold text-2xl text-black mb-4 pl-1">#Trending</h2>
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
        </div>

        {/* Main Content (Videos) */}
        <div className="flex-1 max-w-2xl mx-auto">
          <VideoPlayer />
        </div>

        {/* Right Sidebar */}
        <div className="w-72 hidden lg:block">
          <div className="bg-white p-4 rounded-lg border">
            <h2 className="font-bold text-lg text-black mb-4">Right Sidebar</h2>
            {/* Add your right sidebar content here */}
          </div>
        </div>
      </div>
    </div>
  );
}
