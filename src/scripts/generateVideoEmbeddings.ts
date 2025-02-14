import 'dotenv/config';
import { supabaseAdmin } from "@/lib/supabase-admin";
import videoData from '@/data/videoData.json';
import { generateVideoDescription, generateEmbedding } from '@/app/api/upload/route';
import { v4 as uuidv4 } from 'uuid';

async function generateAndStoreEmbeddings() {
  try {
    for (const video of videoData.videos) {
      console.log(`Processing video ${video.id}...`);
      
      // 1. Generate video description using Gemini
      const description = await generateVideoDescription(video.src);
      console.log(`Description: ${description}`);

      // 2. Generate embedding for the description
      const embedding = await generateEmbedding(description);
        // user_id: userId,
        // url: blob.url,
        // description: `[${combinedEmbedding.join(',')}]`,
        // title: file.name,
        // text_description: description,
        // created_at: new Date().toISOString()
      // 3. Store in Supabase with UUID
      const { error } = await supabaseAdmin
        .from('videos')
        .insert({
          user_id: uuidv4(),
          url: video.src,
          description: `[${embedding.join(',')}]`,
          title: `video_${video.id}`,
          text_description: description,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      console.log(`Stored video ${video.id} successfully`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
generateAndStoreEmbeddings(); 