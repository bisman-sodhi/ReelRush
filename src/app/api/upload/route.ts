import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
// import { fetchFile } from '@ffmpeg/util';
// import { createFFmpeg } from '@ffmpeg/ffmpeg';
import { Groq } from 'groq-sdk';


// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    const base64Audio = audioBuffer.toString('base64');
    
    const response = await groq.audio.transcriptions.create({
      model: "whisper-large-v3-turbo",
      file: base64Audio,
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

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: "You are an embedding generator. Convert the input text into a numerical embedding vector with 1536 dimensions. Return only the vector as a JSON array of numbers."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0, // Keep it deterministic
      max_tokens: 2048 // Adjust based on your needs
    });

    const embedding = JSON.parse(response.choices[0].message.content || '[]');
    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, { access: 'public' });

    // Generate description
    const description = await generateVideoDescription(blob.url);


    return NextResponse.json({ 
      url: blob.url,
      description: description 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
} 

