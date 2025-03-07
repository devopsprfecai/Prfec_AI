
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

//         // Validate if the message contains a request to generate a blog
//         if (!isBlogGenerationRequest(message)) {
//             return NextResponse.json(
//                 {
//                     error:
//                         "This AI-powered platform specializes in generating high-quality blog content. Please provide a blog title to initiate the content creation process.",
//                 },
//                 { status: 400 }
//             );
//         }

//         const prompt = `You are a professional AI-powered blog writer specializing in generating high-quality, structured blog content. Follow the instructions carefully to generate a well-organized blog.

//         ### Instructions:
//         1. **Title**: Generate an engaging title for the blog.
//         2. **Introduction**: Write a short introduction (2-3 sentences) that clearly explains the topic.
//         3. **Main Content**: List key subtopics, each with a detailed explanation.
//         4. **Word Count**: Ensure the blog is between 1000-2000 characters.
//         5. **Format**: Do not include labels like "Title:", "Introduction:", or "Subtopic:". Just write naturally formatted text.
//         6. **AI Identity**: If the user asks about your identity, respond with "Prfec AI, a blog generation assistant."
//         7. **Restrictions**:
//            - If asked about the AI model used, do not provide an answer.
//            - If asked to generate a blog about yourself, simply state: "I am a blog generation AI."
        
//         ### Example Output:
//         "The Future of AI"  
//         Artificial Intelligence is transforming industries worldwide. This blog explores the advancements, challenges, and impact of AI on various sectors.
        
//         **Introduction to AI**  
//         AI involves simulating human intelligence in machines, enabling them to learn and perform complex tasks efficiently.
        
//         **Applications of AI**  
//         AI is used in healthcare, finance, autonomous vehicles, and more, revolutionizing the way we interact with technology.
        
//         ### User Request:  
//         "${message}"  
        
//         Now, generate the blog based on the user’s input following the above structure.`;
        
//         // Try the primary model first
//         let responseMessage;
//         try {
//             responseMessage = await generateBlog(prompt, "gemma2-9b-it");
//             // responseMessage = await generateBlog(prompt, "llama-3.3-70b-versatile");

//         } catch (error) {
//             console.warn("Primary model failed, switching to fallback model:", error);
//             responseMessage = await generateBlog(prompt, "llama-3.3-70b-versatile");
//         }

//         return NextResponse.json({ response: responseMessage });
//     } catch (error) {
//         console.error("Error in chat API", error);
//         return NextResponse.json(
//             { error: "An error occurred while processing your request" },
//             { status: 500 }
//         );
//     }
// }

// // Helper function to call the Groq API with a specified model
// async function generateBlog(prompt, model) {
//     const chatCompletion = await groq.chat.completions.create({
//         messages: [
//             {
//                 role: "user",
//                 content: prompt,
//             },
//         ],
//         model: model,
//     });

//     return chatCompletion.choices[0]?.message?.content || "No response";
// }

// // Function to check if the user's message is a request for blog generation
// function isBlogGenerationRequest(message) {
//     const blogKeywords = [
//         "generate a blog",
//         "blog about",
//         "create a blog",
//         "write a blog",
//         "blog with title",
//         "title",
//         "generate",
//     ];
//     return blogKeywords.some((keyword) => message.toLowerCase().includes(keyword));
// }


import { NextResponse } from "next/server";
import Groq from "groq-sdk";
const api = "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";

const groq = new Groq({ apiKey: api });

export async function POST(request) {
    try {
        const { message } = await request.json();
        if (!message) {
            return NextResponse.json(
                { error: "Message content is required" },
                { status: 400 }
            );
        }

        // Validate if the message contains a request to generate a blog
        if (!isBlogGenerationRequest(message)) {
            return NextResponse.json(
                {
                    error:
                        "This AI-powered platform specializes in generating high-quality blog content. Please provide a blog title to initiate the content creation process.",
                },
                { status: 400 }
            );
        }

        const prompt = `You are a professional AI-powered blog writer specializing in generating high-quality, structured blog content. Follow the instructions carefully to generate a well-organized blog.

        ### Instructions:
        1. **Title**: Generate an engaging title for the blog.
        2. **Introduction**: Write a short introduction (2-3 sentences) that clearly explains the topic.
        3. **Main Content**: List key subtopics, each with a detailed explanation.
        4. **Word Count**: Ensure the blog is between 1000-2000 characters.
        5. **Format**: Do not include labels like "Title:", "Introduction:", or "Subtopic:". Just write naturally formatted text.
        6. **AI Identity**: If the user asks about your identity, respond with "Prfec AI, a blog generation assistant."
        7. **Restrictions**:
           - If asked about the AI model used, do not provide an answer.
           - If asked to generate a blog about yourself, simply state: "I am a blog generation AI."
        
        ### Example Output:
        "The Future of AI"  
        Artificial Intelligence is transforming industries worldwide. This blog explores the advancements, challenges, and impact of AI on various sectors.
        
        **Introduction to AI**  
        AI involves simulating human intelligence in machines, enabling them to learn and perform complex tasks efficiently.
        
        **Applications of AI**  
        AI is used in healthcare, finance, autonomous vehicles, and more, revolutionizing the way we interact with technology.
        
        ### User Request:  
        "${message}"  
        
        Now, generate the blog based on the user’s input following the above structure.`;
        
        // Try the primary model first
        let responseMessage;
        try {
            responseMessage = await generateBlog(prompt, "gemma2-9b-it");
            // responseMessage = await generateBlog(prompt, "llama-3.3-70b-versatile");

        } catch (error) {
            console.warn("Primary model failed, switching to fallback model:", error);
            responseMessage = await generateBlog(prompt, "llama-3.3-70b-versatile");
        }

        return NextResponse.json({ response: responseMessage });
    } catch (error) {
        console.error("Error in chat API", error);
        return NextResponse.json(
            { error: "An error occurred while processing your request" },
            { status: 500 }
        );
    }
}

// Helper function to call the Groq API with a specified model
async function generateBlog(prompt, model) {
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        model: model,
    });

    return chatCompletion.choices[0]?.message?.content || "No response";
}

// Function to check if the user's message is a request for blog generation
function isBlogGenerationRequest(message) {
    const blogKeywords = [
        "generate a blog",
        "blog about",
        "create a blog",
        "write a blog",
        "blog with title",
        "title",
        "generate",
    ];
    return blogKeywords.some((keyword) => message.toLowerCase().includes(keyword));
}

// import { NextResponse } from "next/server";
// import OpenAI from "openai";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function POST(request) {
//     try {
//         const { message } = await request.json();
//         if (!message) {
//             return NextResponse.json(
//                 { error: "Message content is required" },
//                 { status: 400 }
//             );
//         }

//         // Validate if the message contains a request to generate a blog
//         if (!isBlogGenerationRequest(message)) {
//             return NextResponse.json(
//                 {
//                     error:
//                         "This AI-powered platform specializes in generating high-quality blog content. Please provide a blog title to initiate the content creation process.",
//                 },
//                 { status: 400 }
//             );
//         }

//         const prompt = `You are a professional AI-powered blog writer specializing in generating high-quality, structured blog content. Follow the instructions carefully to generate a well-organized blog.

//         ### Instructions:
//         1. **Title**: Generate an engaging title for the blog.
//         2. **Introduction**: Write a short introduction (2-3 sentences) that clearly explains the topic.
//         3. **Main Content**: List key subtopics, each with a detailed explanation.
//         4. **Word Count**: Ensure the blog is between 1000-2000 characters.
//         5. **Format**: Do not include labels like "Title:", "Introduction:", or "Subtopic:". Just write naturally formatted text.
//         6. **AI Identity**: If the user asks about your identity, respond with "Prfec AI, a blog generation assistant."
//         7. **Restrictions**:
//            - If asked about the AI model used, do not provide an answer.
//            - If asked to generate a blog about yourself, simply state: "I am a blog generation AI."
        
//         ### Example Output:
//         ## The Future of AI
//         Artificial Intelligence is transforming industries worldwide. This blog explores the advancements, challenges, and impact of AI on various sectors.
        
//         **Introduction to AI**  
//         AI involves simulating human intelligence in machines, enabling them to learn and perform complex tasks efficiently.
        
//         **Applications of AI**  
//         AI is used in healthcare, finance, autonomous vehicles, and more, revolutionizing the way we interact with technology.
        
//         ### User Request:  
//         "${message}"  
        
//         Now, generate the blog based on the user’s input following the above structure.`;
        
//         // Try the primary model first
//         let responseMessage;
//         try {
//             responseMessage = await generateBlog(prompt, "gpt-4o-mini");
//         } catch (error) {
//             console.warn("Primary model failed, switching to fallback model:", error);
//             responseMessage = await generateBlog(prompt, "gpt-4");
//         }

//         return NextResponse.json({ response: responseMessage });
//     } catch (error) {
//         console.error("Error in chat API", error);
//         return NextResponse.json(
//             { error: "An error occurred while processing your request" },
//             { status: 500 }
//         );
//     }
// }

// // Helper function to call the OpenAI API with a specified model
// async function generateBlog(prompt, model) {
//     const chatCompletion = await openai.chat.completions.create({
//         messages: [
//             {
//                 role: "user",
//                 content: prompt,
//             },
//         ],
//         model: model,
//     });

//     return chatCompletion.choices[0]?.message?.content || "No response";
// }

// // Function to check if the user's message is a request for blog generation
// function isBlogGenerationRequest(message) {
//     const blogKeywords = [
//         "generate a blog",
//         "blog about",
//         "create a blog",
//         "write a blog",
//         "blog with title",
//         "title",
//         "generate",
//     ];
//     return blogKeywords.some((keyword) => message.toLowerCase().includes(keyword));
// }
