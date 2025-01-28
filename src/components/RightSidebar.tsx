'use client';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Home, Users, Upload } from 'lucide-react';
import Link from 'next/link';

export default function RightSidebar() {
  return (
    <div className="fixed top-0 right-0 h-screen w-[100px] bg-black border-l z-40">
      <div className="flex flex-col items-center p-4">
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

        {/* Navigation Buttons */}
        <div className="flex flex-col items-center gap-8 mt-8">
          <Link href="/home" className="p-3 rounded-full hover:bg-gray-100 transition-colors">
            <Home size={24} />
          </Link>
          <Link href="/following" className="p-3 rounded-full hover:bg-gray-100 transition-colors">
            <Users size={24} />
          </Link>
          <Link href="/upload" className="p-3 rounded-full hover:bg-gray-100 transition-colors">
            <Upload size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
} 