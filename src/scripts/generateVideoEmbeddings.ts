import 'dotenv/config';
import { supabaseAdmin } from "@/lib/supabase-admin";
import videoData from '@/data/videoData.json';
import { generateVideoDescription, generateEmbedding } from '@/app/api/upload/route';
import { v4 as uuidv4 } from 'uuid';

async function generateAndStoreEmbeddings() {
  try {
    for (const video of videoData.videos) {
      console.log(`Processing video ${video.id}...`);
      
      // 1. Generate video description and hashtags
      const { description, hashtags } = await generateVideoDescription(video.src);
      console.log('-------------------');
      console.log(`Video ${video.id}:`);
      console.log('Description:', description);
      console.log('Parsed Hashtags:', hashtags);

      if (hashtags.length === 0) {
        console.warn('⚠️ No hashtags generated for video:', video.id);
      } else {
        console.log('✅ Found', hashtags.length, 'hashtags');
      }

      // 2. Generate embeddings
      const [descEmbedding, hashtagEmbedding] = await Promise.all([
        generateEmbedding(description),
        generateEmbedding(hashtags.join(' '))
      ]);

      // Combine embeddings (weighted)
      const embedding = descEmbedding.map((val, idx) => 
        (val * 0.6 + hashtagEmbedding[idx] * 0.4)
      );

      // 3. Store in Supabase
      const { error } = await supabaseAdmin
        .from('videos')
        .insert({
          user_id: uuidv4(),
          url: video.src,
          description: `[${embedding.join(',')}]`,
          title: `video_${video.id}`,
          text_description: description,
          hashtags: hashtags,  // This should now contain the actual hashtags
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      console.log(`Stored video ${video.id} with ${hashtags.length} hashtags`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
generateAndStoreEmbeddings(); 