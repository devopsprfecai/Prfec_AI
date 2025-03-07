
// import { NextResponse } from "next/server";
// import Groq from "groq-sdk";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export async function POST(request) {
//     try {
//         const { sentence } = await request.json();
//         if (!sentence) {
//             return NextResponse.json(
//                 { error: "Sentence content is required" },
//                 { status: 400 }
//             );
//         }

//         // Prompt to instruct the AI
//         const prompt = {
//             role: "system",
//             content: "You are an assistant that restructures sentences without changing their meaning. Only return the restructured sentence, no additional text or explanations.",
//         };

//         const userMessage = {
//             role: "user",
//             content: `Restructure the following sentence: "${sentence}"`,
//         };

//         // Try the primary model first
//         let regeneratedSentence;
//         try {
//             regeneratedSentence = await restructureSentence([prompt, userMessage], "gemma2-9b-it");
//         } catch (error) {
//             console.warn("Primary model failed, switching to fallback model:", error);
//             regeneratedSentence = await restructureSentence([prompt, userMessage], "llama-3.3-70b-versatile");
//         }

//         return NextResponse.json({ regeneratedSentence });
//     } catch (error) {
//         console.error("Error in restructure API", error);
//         return NextResponse.json(
//             { error: "An error occurred while processing your request" },
//             { status: 500 }
//         );
//     }
// }

// // Helper function to call the Groq API with a specified model
// async function restructureSentence(messages, model) {
//     const chatCompletion = await groq.chat.completions.create({
//         messages: messages,
//         model: model,
//     });

//     return chatCompletion.choices[0]?.message?.content?.trim() || "No response";
// }


import { NextResponse } from "next/server";
import Groq from "groq-sdk";
const api = "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";

const groq = new Groq({ apiKey: api });

export async function POST(request) {
    try {
        const { sentence } = await request.json();
        if (!sentence) {
            return NextResponse.json(
                { error: "Sentence content is required" },
                { status: 400 }
            );
        }

        // Prompt to instruct the AI
        const prompt = {
            role: "system",
            content: "You are an assistant that restructures sentences without changing their meaning. Only return the restructured sentence, no additional text or explanations.",
        };

        const userMessage = {
            role: "user",
            content: `Restructure the following sentence: "${sentence}"`,
        };

        // Try the primary model first
        let regeneratedSentence;
        try {
            regeneratedSentence = await restructureSentence([prompt, userMessage], "gemma2-9b-it");
        } catch (error) {
            console.warn("Primary model failed, switching to fallback model:", error);
            regeneratedSentence = await restructureSentence([prompt, userMessage], "llama-3.3-70b-versatile");
        }

        return NextResponse.json({ regeneratedSentence });
    } catch (error) {
        console.error("Error in restructure API", error);
        return NextResponse.json(
            { error: "An error occurred while processing your request" },
            { status: 500 }
        );
    }
}

// Helper function to call the Groq API with a specified model
async function restructureSentence(messages, model) {
    const chatCompletion = await groq.chat.completions.create({
        messages: messages,
        model: model,
    });

    return chatCompletion.choices[0]?.message?.content?.trim() || "No response";
}

// import { NextResponse } from "next/server";
// import OpenAI from "openai";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function POST(request) {
//     try {
//         const { sentence } = await request.json();
//         if (!sentence) {
//             return NextResponse.json(
//                 { error: "Sentence content is required" },
//                 { status: 400 }
//             );
//         }

//         // Prompt to instruct the AI
//         const prompt = {
//             role: "system",
//             content: "You are an assistant that restructures blog without changing their meaning and structure. Only return the restructured blog, no additional text or explanations.",
//         };

//         const userMessage = {
//             role: "user",
//             content: `Restructure the following blog: "${sentence}"`,
//         };

//         const completion = await openai.chat.completions.create({
//             model: "gpt-4o-mini",
//             messages: [prompt, userMessage],
//         });

//         return NextResponse.json({ regeneratedSentence: completion.choices[0]?.message?.content?.trim() || "No response" });
//     } catch (error) {
//         console.error("Error in restructure API", error);
//         return NextResponse.json(
//             { error: "An error occurred while processing your request" },
//             { status: 500 }
//         );
//     }
// }
