import Image from "next/image";
import VideoPlayer from '../../components/VideoPlayer';
import logo from '/public/logo/v3ReelRush.png';
import Link from "next/link";
// import NavigationMenu from '@/components/NavigationMenu';

export default function FeedPage() {
  // const trendingTags = [
  //   { tag: 'love', count: '2.4M' },
  //   { tag: 'dance', count: '1.8M' },
  //   { tag: 'food', count: '1.2M' },
  //   { tag: 'music', count: '956K' },
  //   { tag: 'pets', count: '847K' },
  //   { tag: 'travel', count: '723K' },
  //   { tag: 'fitness', count: '612K' },
  // ];

// flex min-h-screen
// 

  return (
    <div className="flex w-full h-screen">
      {/* Center Section */}
      <div className="w-1/2 ml-[60px] flex justify-center">
        <div className="h-screen overflow-y-scroll hide-scrollbar snap-y snap-mandatory">
          <VideoPlayer />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 h-full overflow-y-auto p-4">
        <h1 className="text-3xl text-black font-bold mb-6">Comments</h1>
      </div>
    </div>
  );
}
