import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { Groq } from 'groq-sdk';
import { supabaseAdmin } from "@/lib/supabase-admin";
import { pipeline } from '@xenova/transformers';
import { auth } from '@clerk/nextjs/server'

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function extractAudio(videoUrl: string): Promise<Buffer> {
  try {
    // Download video file
    const response = await fetch(videoUrl);
    const videoBuffer = Buffer.from(await response.arrayBuffer());
    
    // Save to temp file
    const tempDir = tmpdir();
    const inputPath = join(tempDir, `input-${Date.now()}.mp4`);
    const outputPath = join(tempDir, `output-${Date.now()}.mp3`);
    
    await fs.writeFile(inputPath, videoBuffer);
    
    // Convert to audio using child_process
    const { exec } = require('child_process');
    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -i ${inputPath} -vn -acodec libmp3lame ${outputPath}`,
        (error: any) => {
          if (error) reject(error);
          else resolve(null);
        }
      );
    });
    
    // Read output file
    const audioBuffer = await fs.readFile(outputPath);
    
    // Cleanup
    await Promise.all([
      fs.unlink(inputPath),
      fs.unlink(outputPath)
    ]);
    
    return audioBuffer;
  } catch (error) {
    console.error('Audio extraction error:', error);
    throw error;
  }
}

async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    // Create a File object from the buffer
    const audioFile = new File(
      [audioBuffer], 
      'audio.mp3', 
      { type: 'audio/mp3' }
    );
    
    const response = await groq.audio.transcriptions.create({
      model: "whisper-large-v3-turbo",
      file: audioFile,
      response_format: "text"
    });

    return response.text;
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY || "");

// Cache the pipeline
let embedder: any = null;

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    if (!text?.trim()) {
      console.error("Empty text provided for embedding");
      return new Array(384).fill(0); // MiniLM outputs 384-dim vectors
    }

    // Initialize embedder if not already done
    if (!embedder) {
      embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }

    const output = await embedder(text, { 
      pooling: 'mean', 
      normalize: true 
    });

    return Array.from(output.data);
  } catch (error) {
    console.error("Error generating embedding:", error);
    return new Array(384).fill(0);
  }
}

async function generateVideoDescription(fileUrl: string): Promise<string> {
  try {
    // Download the file
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create temp file
    const tempPath = join(tmpdir(), `temp-${Date.now()}.mp4`);
    await fs.writeFile(tempPath, buffer);

    // Upload to Gemini
    const uploadResult = await fileManager.uploadFile(tempPath, { mimeType: "video/mp4" });

    // Clean up temp file
    await fs.unlink(tempPath);

    // Wait for processing
    let file = await fileManager.getFile(uploadResult.file.name);
    while (file.state === FileState.PROCESSING) {
      await new Promise((resolve) => setTimeout(resolve, 10_000)); // Wait 10s
      file = await fileManager.getFile(uploadResult.file.name);
    }

    if (file.state === FileState.FAILED) {
      throw new Error("Video processing failed");
    }

    // Generate description
    const prompt = "Describe this video clip in detail";
    const videoPart = {
      fileData: {
        fileUri: uploadResult.file.uri,
        mimeType: uploadResult.file.mimeType,
      },
    };

    const result = await model.generateContent([prompt, videoPart]);
    const description = result.response.text();
    console.log(description);
    return description;
  } catch (error) {
    console.error("Error generating description:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    // 1. Upload video to Vercel Blob
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const { userId } = await auth();

    if (!file || !userId) {
      return NextResponse.json({ error: 'No file or unauthorized' }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, { access: 'public' });

    // 2. Generate video description using Gemini
    const description = await generateVideoDescription(blob.url);

    // 3. Extract audio and transcribe using Whisper
    const audioBuffer = await extractAudio(blob.url);
    const transcript = await transcribeAudio(audioBuffer);

    // 4. Generate embeddings for both description and transcript
    const [descriptionEmbedding, transcriptEmbedding] = await Promise.all([
      generateEmbedding(description),
      generateEmbedding(transcript)
    ]);

    // 5. Combine embeddings (average them)
    const combinedEmbedding = descriptionEmbedding.map((val, idx) => 
      (val + transcriptEmbedding[idx]) / 2
    );
    console.log("combinedEmbedding", combinedEmbedding);

    // Save to Supabase
    const { error: videoError } = await supabaseAdmin
      .from('videos')
      .insert({
        user_id: userId,
        url: blob.url,
        description: `[${combinedEmbedding.join(',')}]`,
        title: file.name,
        text_description: description,
        created_at: new Date().toISOString()
      });

    if (videoError) throw videoError;

    // Silently update upload count without throwing errors
    try {
      await supabaseAdmin
        .from('users')
        .update({ 
          upload_count: supabaseAdmin.rpc('increment', { row_count: 1 }) 
        })
        .eq('id', userId);
    } catch (countError) {
      console.error('Failed to update upload count:', countError);
      // Don't throw error - allow upload to succeed
    }

    return NextResponse.json({ 
      url: blob.url,
      description: description
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
} 

