'use client';

import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';

export default function AuthShowcase() {
  return (
    <SignedOut>
      <div className="text-center">
        <h2 className="text-2xl mb-4 text-black">Welcome to ReelRush</h2>
        <div className="flex gap-4 justify-center">
          <SignInButton mode="modal">
            <button className="px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-4 py-2 rounded-full border border-black text-black hover:bg-gray-100">
              Sign Up
            </button>
          </SignUpButton>
        </div>
        <p className="mt-4 text-gray-600 text-sm">
          New to ReelRush? Sign up for free!
        </p>
      </div>
    </SignedOut>
  );
} 