'use client';

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/ReelRushLogo.jpeg"
            alt="ReelRush"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
          <input 
            type="text" 
            placeholder="Search videos..." 
            className="w-full px-4 py-2 rounded-full border bg-gray-50 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Auth/Profile */}
        <div className="flex items-center gap-4">
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
                  avatarBox: "w-10 h-10"
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
} 