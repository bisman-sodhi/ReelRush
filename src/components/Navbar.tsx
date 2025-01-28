'use client';

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b z-50 h-16">
      <div className="flex justify-between items-center h-full p-4 max-w-7xl mx-auto">
        {/* Logo as a Link */}
        <Link href="/" className="flex items-center h-full w-[100px] hover:opacity-80 transition-opacity">
          <Image
            src="/v2ReelRush.png"
            alt="ReelRush"
            width={100}
            height={50}
            className="object-contain"
          />
        </Link>

        {/* Search Bar Container - aligned with video width */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-2xl">
            <input 
              type="text" 
              placeholder="Search videos..." 
              className="w-full px-4 py-2 rounded-full border bg-gray-50 focus:outline-none focus:border-blue-500 text-black"
            />
          </div>
        </div>

        {/* Auth/Profile - fixed width to match logo */}
        <div className="flex items-center gap-4 w-[100px] justify-end">
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
      </div>
    </nav>
  );
} 