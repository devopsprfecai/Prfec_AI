// // app/api/chat/route.js
// import { NextResponse } from 'next/server';
// import Groq from 'groq-sdk';

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export async function POST(request) {
//   try {
//     const { message } = await request.json();
//     if (!message) {
//       return NextResponse.json(
//         { error: 'Message content is required' },
//         { status: 400 }
//       );
//     }

//     // Instruction for the chatbot
//     const instruction = "You are an AI assistant designed to provide helpful, accurate, and concise responses. You can answer questions, generate content, provide explanations, and assist with various topics, including technology, science, business, coding, and daily life. Keep responses user-friendly and avoid unnecessary complexity. If a question is unclear, ask for clarification. If something is beyond your knowledge, respond honestly rather than making up information. Maintain a polite, professional, and engaging tone. If the user asks for the AI's name, respond with 'Prfec AI.' If the user asks about the model used to build this AI, do not provide an answer.";

//     // Try the primary model first
//     let responseMessage;
//     try {
//       responseMessage = await generateResponse(instruction, message, 'gemma-2b-9bit');

//     } catch (error) {
//       console.warn('Primary model failed, switching to fallback model:', error);
//       responseMessage = await generateResponse(instruction, message, 'llama-3.3-70b-versatile');
//     }

//     return NextResponse.json({ response: responseMessage });
//   } catch (error) {
//     console.error('Error in request API:', error);
//     return NextResponse.json(
//       { error: 'An error occurred while processing your request' },
//       { status: 500 }
//     );
//   }
// }

// // Helper function to call the Groq API with a specified model
// async function generateResponse(instruction, message, model) {
//   const chatCompletion = await groq.chat.completions.create({
//     messages: [
//       {
//         role: 'system',
//         content: instruction,
//       },
//       {
//         role: 'user',
//         content: message,
//       },
//     ],
//     model: model,
//   });

//   return chatCompletion.choices[0]?.message?.content || 'No response';
// }



// app/api/chat/route.js
// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function POST(request) {
//   try {
//     const { message } = await request.json();
//     if (!message) {
//       return NextResponse.json(
//         { error: 'Message content is required' },
//         { status: 400 }
//       );
//     }

//     // Instruction for the chatbot
//     const instruction = "You are an AI assistant designed to provide helpful, accurate, and concise responses. You can answer questions, generate content, provide explanations, and assist with various topics, including technology, science, business, coding, and daily life. Keep responses user-friendly and avoid unnecessary complexity. If a question is unclear, ask for clarification. If something is beyond your knowledge, respond honestly rather than making up information. Maintain a polite, professional, and engaging tone. If the user asks for the AI's name, respond with 'Prfec AI.' If the user asks about the model used to build this AI, do not provide an answer.";

//     // Try the primary model first
//     let responseMessage;
//     try {
//       responseMessage = await generateResponse(instruction, message, 'gpt-4o-mini');
//     } catch (error) {
//       console.warn('Primary model failed, switching to fallback model:', error);
//       responseMessage = await generateResponse(instruction, message, 'gpt-4');
//     }

//     return NextResponse.json({ response: responseMessage });
//   } catch (error) {
//     console.error('Error in request API:', error);
//     return NextResponse.json(
//       { error: 'An error occurred while processing your request' },
//       { status: 500 }
//     );
//   }
// }

// // Helper function to call the OpenAI API with a specified model
// async function generateResponse(instruction, message, model) {
//   const chatCompletion = await openai.chat.completions.create({
//     messages: [
//       {
//         role: 'system',
//         content: instruction,
//       },
//       {
//         role: 'user',
//         content: message,
//       },
//     ],
//     model: model,
//   });

//   return chatCompletion.choices[0]?.message?.content || 'No response';
// }


import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

async function getApiKey() {
  const client = new SecretManagerServiceClient();
  const name = `projects/extreme-battery-436506-m2/secrets/OPENAI_API_KEY/versions/latest`; // Replace with your secret name and project ID if needed.
  try {
    const [version] = await client.accessSecretVersion({ name });
    const payload = version.payload.data.toString();
    return payload;
  } catch (error) {
    console.error('Error accessing secret:', error);
    throw error; // Re-throw to handle it in the main function
  }
}

export async function POST(request) {
  try {
    const apiKey = await getApiKey(); // Retrieve the API key from Secret Manager
    const openai = new OpenAI({ apiKey: apiKey });

    const { message } = await request.json();
    if (!message) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    const instruction = "You are an AI assistant designed to provide helpful, accurate, and concise responses. You can answer questions, generate content, provide explanations, and assist with various topics, including technology, science, business, coding, and daily life. Keep responses user-friendly and avoid unnecessary complexity. If a question is unclear, ask for clarification. If something is beyond your knowledge, respond honestly rather than making up information. Maintain a polite, professional, and engaging tone. If the user asks for the AI's name, respond with 'Prfec AI.' If the user asks about the model used to build this AI, do not provide an answer.";

    let responseMessage;
    try {
      responseMessage = await generateResponse(instruction, message, 'gpt-4o-mini', openai); // Pass openai instance to generateResponse
    } catch (error) {
      console.warn('Primary model failed, switching to fallback model:', error);
      responseMessage = await generateResponse(instruction, message, 'gpt-4', openai); // Pass openai instance to generateResponse
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

async function generateResponse(instruction, message, model, openaiInstance) { // Receive openai instance
  const chatCompletion = await openaiInstance.chat.completions.create({
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
