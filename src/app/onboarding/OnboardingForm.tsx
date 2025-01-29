'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { completeOnboarding } from './_actions'

const INTERESTS = [
  'Music', 'Dance', 'Food', 'Travel', 'Fashion', 
  'Gaming', 'Sports', 'Art', 'Technology', 'Fitness',
  'Beauty', 'Comedy', 'Education', 'Pets', 'Nature'
];

export default function OnboardingForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (interests.length < 5) {
      alert('Please select at least 5 interests')
      return
    }

    try {
      setIsSubmitting(true)
      const formData = new FormData()
      formData.append('username', username)
      formData.append('interests', JSON.stringify(interests))

      const result = await completeOnboarding(formData)
      
      if (result.message === 'Profile Updated Successfully') {
        // Use window.location for a hard redirect
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to complete onboarding')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-black mb-2">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full text-black"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Select at least 5 interests</label>
        <p className="text-xs text-gray-500 mb-3">
          Selected: {interests.length}/5
        </p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => {
                if (interests.includes(interest)) {
                  setInterests(interests.filter((i) => i !== interest))
                } else if (interests.length < 5) {
                  setInterests([...interests, interest])
                }
              }}
              className={`px-3 py-1 rounded-full text-sm ${
                interests.includes(interest)
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <button 
        type="submit"
        disabled={isSubmitting}
        className={`px-4 py-2 rounded ${
          isSubmitting 
            ? 'bg-blue-300 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
      >
        {isSubmitting ? 'Completing...' : 'Complete Profile'}
      </button>
    </form>
  )
}