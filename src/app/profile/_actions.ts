'use server'

import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiAPIKey: string = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(geminiAPIKey);
const gemini = genAI.getGenerativeModel({ model: "text-embedding-004" });

export async function updateUserInterests(interests: string[]) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    // Generate embedding for interests
    const text = interests.join(', ');
    const embedding = await gemini.embedContent(text);
    const embeddingArray = embedding.embedding.values;

    const { error } = await supabaseAdmin
      .from('users')
      .update({
        interests,
        interests_embedding: `[${embeddingArray.join(',')}]`
      })
      .eq('id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Interest update error:', error);
    throw error;
  }
} 