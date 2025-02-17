'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { INTERESTS } from '@/lib/constants';
import { X } from 'lucide-react'; // Import X icon for close button
import { GoogleGenerativeAI } from '@google/generative-ai';
import { updateUserInterests } from '@/app/profile/_actions';

interface InterestEditorProps {
  currentInterests: string[];
  onUpdate: () => void;
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
const gemini = genAI.getGenerativeModel({ model: "text-embedding-004" });

export function InterestEditor({ currentInterests, onUpdate }: InterestEditorProps) {
  const [interests, setInterests] = useState<string[]>(currentInterests);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userId } = useAuth();

  const handleInterestToggle = (interest: string) => {
    setInterests(prev => {
      // If interest is already selected, remove it
      if (prev.includes(interest)) {
        return prev.filter(i => i !== interest);
      }
      // If adding new interest, check limit
      if (prev.length >= 5) {
        alert('You can select up to 5 interests');
        return prev;
      }
      // Add new interest
      return [...prev, interest];
    });
  };

  const handleUpdate = async () => {
    try {
      if (interests.length === 0) {
        alert('Please select at least one interest');
        return;
      }
      if (interests.length > 5) {
        alert('You can only have up to 5 interests');
        return;
      }

      setIsUpdating(true);
      
      // Use server action to update interests
      const result = await updateUserInterests(interests);
      
      if (result.success) {
        onUpdate();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to update interests:', error);
      alert('Failed to update interests. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {/* Interest Display and Edit Button */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-black font-semibold">Interests</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Edit Interests
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentInterests.map((interest) => (
            <div
              key={interest}
              className="px-3 py-1 bg-gray-100 text-black rounded-full text-sm"
            >
              {interest}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-black">Update Your Interests</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Select interests to personalize your feed
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {INTERESTS.map(interest => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${interests.includes(interest)
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {interest}
                </button>
              ))}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating || interests.length === 0}
                className="px-4 py-2 text-sm bg-black text-white rounded-lg disabled:opacity-50 hover:bg-gray-800 transition-colors"
              >
                {isUpdating ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 