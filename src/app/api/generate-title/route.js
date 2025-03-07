
// import { NextResponse } from 'next/server';
// import Groq from 'groq-sdk';

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export async function POST(request) {
//   try {
//     const { messages } = await request.json();
//     if (!messages || messages.length === 0) {
//       return NextResponse.json(
//         { error: 'Messages are required to generate a title' },
//         { status: 400 }
//       );
//     }

//     // Extract last 5 user messages only (ignoring system/bot messages)
//     const recentMessages = messages
//       .filter(msg => msg.role === 'user')
//       .slice(-5)
//       .map(msg => msg.content)
//       .join(" ");

//     if (!recentMessages) {
//       return NextResponse.json({ title: 'Untitled Chat' });
//     }

//     // Instruction for title generation
//     const instruction = `Generate a short, concise title (max 6 words) summarizing the following conversation. Only return the title without any additional text`;

//     // Try the primary model first
//     let title;
//     try {
//       title = await generateTitle(instruction, recentMessages, 'gemma-2b-9bit');
//     } catch (error) {
//       console.warn('Primary model failed, switching to fallback model:', error);
//       title = await generateTitle(instruction, recentMessages, 'llama-3.3-70b-versatile');
//     }

//     // Ensure title is valid and formatted
//     title = title.replace(/["'\n]/g, '').trim(); // Remove quotes or newlines
//     if (!title || title.length > 50) title = 'New Chat'; // Fallback if response is invalid

//     return NextResponse.json({ title });
//   } catch (error) {
//     console.error('Error in title generation API:', error);
//     return NextResponse.json(
//       { error: 'An error occurred while generating the title' },
//       { status: 500 }
//     );
//   }
// }

// // Helper function to call the Groq API with a specified model
// async function generateTitle(instruction, recentMessages, model) {
//   const chatCompletion = await groq.chat.completions.create({
//     messages: [
//       { role: 'system', content: instruction },
//       { role: 'user', content: recentMessages },
//     ],
//     model: model,
//     max_tokens: 15, // Limit response length to ensure concise title
//   });

//   return chatCompletion.choices[0]?.message?.content?.trim() || 'New Chat';
// }


import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
const api = "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";

const groq = new Groq({ apiKey: api});

export async function POST(request) {
  try {
    const { messages } = await request.json();
    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required to generate a title' },
        { status: 400 }
      );
    }

    // Extract last 5 user messages only (ignoring system/bot messages)
    const recentMessages = messages
      .filter(msg => msg.role === 'user')
      .slice(-5)
      .map(msg => msg.content)
      .join(" ");

    if (!recentMessages) {
      return NextResponse.json({ title: 'Untitled Chat' });
    }

    // Instruction for title generation
    const instruction = `Generate a short, concise title (max 6 words) summarizing the following conversation. Only return the title without any additional text`;

    // Try the primary model first
    let title;
    try {
      title = await generateTitle(instruction, recentMessages, 'gemma-2b-9bit');
    } catch (error) {
      console.warn('Primary model failed, switching to fallback model:', error);
      title = await generateTitle(instruction, recentMessages, 'llama-3.3-70b-versatile');
    }

    // Ensure title is valid and formatted
    title = title.replace(/["'\n]/g, '').trim(); // Remove quotes or newlines
    if (!title || title.length > 50) title = 'New Chat'; // Fallback if response is invalid

    return NextResponse.json({ title });
  } catch (error) {
    console.error('Error in title generation API:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the title' },
      { status: 500 }
    );
  }
}

// Helper function to call the Groq API with a specified model
async function generateTitle(instruction, recentMessages, model) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: instruction },
      { role: 'user', content: recentMessages },
    ],
    model: model,
    max_tokens: 15, // Limit response length to ensure concise title
  });

  return chatCompletion.choices[0]?.message?.content?.trim() || 'New Chat';
}


// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function POST(request) {
//   try {
//     const { messages } = await request.json();
//     if (!messages || messages.length === 0) {
//       return NextResponse.json(
//         { error: 'Messages are required to generate a title' },
//         { status: 400 }
//       );
//     }

//     // Extract last 5 user messages only (ignoring system/bot messages)
//     const recentMessages = messages
//       .filter(msg => msg.role === 'user')
//       .slice(-5)
//       .map(msg => msg.content)
//       .join(" ");

//     if (!recentMessages) {
//       return NextResponse.json({ title: 'Untitled Chat' });
//     }

//     // Instruction for title generation
//     const instruction = `Generate a short, concise title (max 6 words) summarizing the following conversation. Only return the title without any additional text`;

//     // Try the primary model first
//     let title;
//     try {
//       title = await generateTitle(instruction, recentMessages, 'gpt-4o-mini');
//     } catch (error) {
//       console.warn('Primary model failed, switching to fallback model:', error);
//       title = await generateTitle(instruction, recentMessages, 'gpt-4');
//     }

//     // Ensure title is valid and formatted
//     title = title.replace(/["'\n]/g, '').trim(); // Remove quotes or newlines
//     if (!title || title.length > 50) title = 'New Chat'; // Fallback if response is invalid

//     return NextResponse.json({ title });
//   } catch (error) {
//     console.error('Error in title generation API:', error);
//     return NextResponse.json(
//       { error: 'An error occurred while generating the title' },
//       { status: 500 }
//     );
//   }
// }

// // Helper function to call the OpenAI API with a specified model
// async function generateTitle(instruction, recentMessages, model) {
//   const chatCompletion = await openai.chat.completions.create({
//     messages: [
//       { role: 'system', content: instruction },
//       { role: 'user', content: recentMessages },
//     ],
//     model: model,
//     max_tokens: 15, // Limit response length to ensure concise title
//   });

//   return chatCompletion.choices[0]?.message?.content?.trim() || 'New Chat';
// }
