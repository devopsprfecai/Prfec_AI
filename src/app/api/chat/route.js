// app/api/chat/route.js
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { message } = await request.json();
    if (!message) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Instruction for the chatbot
    // const instruction = "You are an AI assistant designed to provide helpful, accurate, and concise responses. You can answer questions, generate content, provide explanations, and assist with various topics, including technology, science, business, coding, and daily life. Keep responses user-friendly and avoid unnecessary complexity. If a question is unclear, ask for clarification. If something is beyond your knowledge, respond honestly rather than making up information. Maintain a polite, professional, and engaging tone.";
    const instruction = "You are an AI assistant designed to provide helpful, accurate, and concise responses. You can answer questions, generate content, provide explanations, and assist with various topics, including technology, science, business, coding, and daily life. Keep responses user-friendly and avoid unnecessary complexity. If a question is unclear, ask for clarification. If something is beyond your knowledge, respond honestly rather than making up information. Maintain a polite, professional, and engaging tone. If the user asks for the AI's name, respond with 'Trafy AI.' If the user asks about the model used to build this AI, do not provide an answer.";

    // Try the primary model first
    let responseMessage;
    try {
      responseMessage = await generateResponse(instruction, message, 'gemma-2b-9bit');

    } catch (error) {
      console.warn('Primary model failed, switching to fallback model:', error);
      responseMessage = await generateResponse(instruction, message, 'llama-3.3-70b-versatile');
    }

    return NextResponse.json({ response: responseMessage });
  } catch (error) {
    console.error('Error in request API:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}

// Helper function to call the Groq API with a specified model
async function generateResponse(instruction, message, model) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: instruction,
      },
      {
        role: 'user',
        content: message,
      },
    ],
    model: model,
  });

  return chatCompletion.choices[0]?.message?.content || 'No response';
}


// import { NextResponse } from "next/server";
// import Groq from "groq-sdk";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export async function POST(request) {
//     try {
//         const { message } = await request.json();
//         if (!message) {
//             return NextResponse.json(
//                 { error: "Message content is required" },
//                 { status: 400 }
//             );
//         }

//         const chatCompletion = await groq.chat.completions.create({
//             messages: [
//                 {
//                     role: "user",
//                     content: message,
//                 },
//             ],
//             model: "gemma2-9b-it",
//         });

//         const responseMessage = chatCompletion.choices[0]?.message?.content || "No response";

//         return NextResponse.json({ response: responseMessage });
//     } catch (error) {
//         console.error("Error in chat API", error);
//         return NextResponse.json(
//             { error: "An error occurred while processing your request" },
//             { status: 500 }
//         );
//     }
// }
