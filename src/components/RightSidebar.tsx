'use client';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Home, Users, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import UploadingIndicator from './UploadingIndicator';
import { useVideoUpload } from '@/app/upload/uploadUtils';

export default function RightSidebar() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isUploading, handleVideoUpload } = useVideoUpload();

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div className="fixed top-0 right-0 h-screen w-[100px] bg-black border-l z-40">
        <div className="flex flex-col h-full">
          {/* Clerk Profile - positioned at top */}
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
            {/* Home Button */}
            <Link href="/profile" className="p-3 rounded-full hover:bg-gray-100 transition-colors">
              <Home size={24} />
            </Link>
            
            {/* Following Button */}
            <Link href="/following" className="p-3 rounded-full hover:bg-gray-100 transition-colors">
              <Users size={24} />
            </Link>

            {/* Upload Button */}
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
                handleVideoUpload(file);
              }
            }}
          />
        </div>
      </div>
      
      {isUploading && <UploadingIndicator />}
    </>
  );
}