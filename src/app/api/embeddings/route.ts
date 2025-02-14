// import { pipeline } from '@xenova/transformers';
// import { NextResponse } from 'next/server';

// let embedder: any = null;

// export async function POST(request: Request) {
//   try {
//     if (!request.body) {
//       return NextResponse.json({ error: 'No body provided' }, { status: 400 });
//     }

//     const { text } = await request.json();

//     if (!text?.trim()) {
//       return NextResponse.json({ 
//         embedding: new Array(768).fill(0) 
//       });
//     }

//     if (!embedder) {
//       embedder = await pipeline('feature-extraction', 'Xenova/all-mpnet-base-v2');
//     }

//     const output = await embedder(text, { 
//       pooling: 'mean', 
//       normalize: true 
//     });

//     return NextResponse.json({ 
//       embedding: Array.from(output.data) 
//     });
//   } catch (error) {
//     console.error("Error generating embedding:", error);
//     return NextResponse.json({ 
//       error: 'Embedding generation failed',
//       embedding: new Array(768).fill(0) 
//     }, { status: 500 });
//   }
// } 