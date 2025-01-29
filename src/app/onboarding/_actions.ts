'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

export const completeOnboarding = async (formData: FormData) => {
  const client = await clerkClient()
  const { userId } = await auth()

  if (!userId) {
    return { message: 'No Logged In User' }
  }

  try {
    const username = formData.get('username') as string
    const interests = JSON.parse(formData.get('interests') as string)

    await client.users.updateUser(userId, {
      username,
      publicMetadata: {
        onboardingComplete: true,
        interests,
      },
    })
    return { message: 'Profile Updated Successfully' }
  } catch (e) {
    console.log('error', e)
    return { message: 'Error Updating Profile' }
  }
}