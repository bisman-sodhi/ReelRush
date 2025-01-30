'use client';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Home, Users, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useVideos } from '@/context/VideoContext';
import UploadingIndicator from './UploadingIndicator';

interface NavbarProps {
  onUpload: (file: File) => void;
}

export default function RightSidebar() {
  const [isUploading, setIsUploading] = useState(false);
  const { addVideo } = useVideos();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      console.error('Please upload a video file');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        addVideo({ src: data.url });
        // Scroll to top after successful upload
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="fixed top-0 right-0 h-screen w-[100px] bg-black border-l z-40">
        <div className="flex flex-col h-full">
          {/* Auth/Profile - positioned at top */}
          <div className="flex items-center justify-center w-full py-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: "text-black",
                    avatarInitials: "text-white bg-black",
                  },
                  variables: {
                    colorPrimary: "#000000",
                    colorTextSecondary: "#000000",
                    colorBackground: "white",
                  }
                }}
              />
            </SignedIn>
          </div>

          {/* Navigation Buttons - centered vertically */}
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <Link href="/profile" className="p-3 rounded-full hover:bg-gray-100 transition-colors">
              <Home size={24} />
            </Link>
            <Link href="/following" className="p-3 rounded-full hover:bg-gray-100 transition-colors">
              <Users size={24} />
            </Link>
            <button onClick={handleClick} className="p-3 rounded-full hover:bg-gray-100 transition-colors">
              <Upload size={24} />
            </button>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            accept="video/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                handleUpload(file);
              }
            }}
          />
        </div>
      </div>
      
      {isUploading && <UploadingIndicator />}
    </>
  );
}