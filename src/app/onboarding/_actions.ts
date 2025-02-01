'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const completeOnboarding = async (formData: FormData) => {
  const { userId } = await auth()
  if (!userId) return { message: 'No user found' }

  try {
    const username = formData.get('username') as string
    const interests = JSON.parse(formData.get('interests') as string)

    const { error } = await supabase
      .from('users')
      .insert({
        id: userId,
        username,
        interests,
        upload_count: 0,
      })

    if (error) throw error
    return { message: 'Profile Updated Successfully' }
  } catch (e) {
    console.error('error', e)
    return { message: 'Error Updating Profile' }
  }
}

export async function saveUserInterests(userId: string, interests: string[], upload_count: number) {
  const { error } = await supabase
    .from('users')
    .upsert({ 
      id: userId, 
      interests,
      upload_count,
    });
  
  if (error) throw error;
}