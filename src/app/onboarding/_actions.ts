'use server'

import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiAPIKey: string = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(geminiAPIKey);
const gemini = genAI.getGenerativeModel({ model: "text-embedding-004" });

export const completeOnboarding = async (formData: FormData) => {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    const interests = JSON.parse(formData.get('interests') as string)
    
    // Generate embedding for interests
    const text = interests.join(', ');
    const embedding = await gemini.embedContent(text);
    const embeddingArray = embedding.embedding.values;
    
    console.log("Embedding Length:", embeddingArray.length); // 768 dimensions from text-embedding-004


    const { error } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        username: formData.get('username'),
        interests: interests,
        upload_count: 0,
        interests_embedding: embeddingArray
      });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return { success: true }
  } catch (error) {
    console.error('Onboarding error:', error);
    throw error;
  }
}

export async function saveUserInterests(userId: string, interests: string[], upload_count: number) {
  const { error } = await supabaseAdmin
    .from('users')
    .upsert({ 
      id: userId, 
      interests,
      upload_count,
    });
  
  if (error) throw error;
}