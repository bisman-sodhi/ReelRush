'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from './_actions'

const INTERESTS = [
  'Music', 'Dance', 'Food', 'Travel', 'Fashion', 
  'Gaming', 'Sports', 'Art', 'Technology', 'Fitness',
  'Beauty', 'Comedy', 'Education', 'Pets', 'Nature'
];

export default function OnboardingComponent() {
  const { user } = useUser()
  const router = useRouter()
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([])
  const [username, setUsername] = React.useState('')

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : prev.length < 5 
          ? [...prev, interest]
          : prev
    )
  }

  const handleSubmit = async (formData: FormData) => {
    if (selectedInterests.length < 5) {
      alert('Please select at least 5 interests')
      return
    }
    await completeOnboarding(formData)
    await user?.reload()
    router.push('/')
  }

  return (
    <div className="px-8 py-12 sm:py-16 md:px-20">
      <div className="mx-auto max-w-sm overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="p-8">
          <h3 className="text-xl font-semibold text-gray-900">Welcome to ReelRush!</h3>
          <p className="mt-2 text-sm text-gray-600">Let's set up your profile</p>
        </div>
        
        <form action={handleSubmit}>
          <div className="space-y-6 px-8">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Choose your username
              </label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>

            {/* Interests Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Select at least 5 interests
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Selected: {selectedInterests.length}/5
              </p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedInterests.includes(interest)
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              <input 
                type="hidden" 
                name="interests" 
                value={JSON.stringify(selectedInterests)} 
              />
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-4 mt-6">
            <button
              type="submit"
              disabled={selectedInterests.length < 5 || !username}
              className="w-full rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Complete Setup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}