


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

//         const chatCompletion = await groq.chat.completions.create({
//             messages: [
//                 {
//                     role: "system",
//                     content: "You are an assistant that restructures sentences without changing their meaning. Only return the restructured sentence, no additional text or explanations.",
//                 },
//                 {
//                     role: "user",
//                     content: `Restructure the following sentence: "${sentence}"`,
//                 },
//             ],
//             model: "gemma-7b-it",
//         });

//         const regeneratedSentence = chatCompletion.choices[0]?.message?.content?.trim() || "No response";

//         return NextResponse.json({ regeneratedSentence });
//     } catch (error) {
//         console.error("Error in refresh API", error);
//         return NextResponse.json(
//             { error: "An error occurred while processing your request" },
//             { status: 500 }
//         );
//     }
// }

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
