import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
} from '@clerk/nextjs'
// import Navbar from '@/components/Navbar';
import AuthShowcase from '@/components/AuthShowcase';
import RightSidebar from '@/components/RightSidebar';
import { VideoProvider } from '@/context/VideoContext';
import LeftSidebar from '@/components/LeftSidebar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReelRush",
  description: "Reels and Feels ;)",
  icons: {
    icon: [
      { url: './favicon.ico', type: 'image/x-icon' },
      { url: './favicon.ico', sizes: '32x32' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white overflow-hidden`}>
          <VideoProvider>
            <div className="flex">
              <SignedIn>
                <LeftSidebar />
              </SignedIn>
              
              {/* Main Content Area - Remaining space divided into 3 equal parts */}
              <main className="flex ml-[460px] mr-[100px] w-full">
                <AuthShowcase />
                <SignedIn>
                  {children}
                </SignedIn>
              </main>
              
              {/* Right Navigation Bar - Fixed width */}
              <RightSidebar />
            </div>
          </VideoProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
