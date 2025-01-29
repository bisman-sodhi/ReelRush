'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share } from 'lucide-react';

interface VideoActionsProps {
  videoId: string;
}

export default function VideoActions({ videoId }: VideoActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleComment = () => {
    // TODO: Implement comments
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Check out this video!',
        url: `${window.location.origin}/video/${videoId}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <div className="absolute right-4 bottom-20 flex flex-col gap-6">
      <button 
        onClick={handleLike}
        className="flex flex-col items-center gap-1"
      >
        <div className={`p-2 rounded-full bg-black/20 backdrop-blur-lg hover:bg-black/40 transition-all ${
          isLiked ? 'text-red-500' : 'text-black'
        }`}>
          <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
        </div>
        <span className="text-sm text-black">{likes}</span>
      </button>

      <button 
        onClick={handleComment}
        className="flex flex-col items-center gap-1"
      >
        <div className="p-2 rounded-full bg-black/20 backdrop-blur-lg hover:bg-black/40 transition-all text-black">
          <MessageCircle className="w-6 h-6" />
        </div>
        <span className="text-sm text-black">{comments}</span>
      </button>

      <button 
        onClick={handleShare}
        className="flex flex-col items-center gap-1"
      >
        <div className="p-2 rounded-full bg-black/20 backdrop-blur-lg hover:bg-black/40 transition-all text-black">
          <Share className="w-6 h-6" />
        </div>
        <span className="text-sm text-black">Share</span>
      </button>
    </div>
  );
}