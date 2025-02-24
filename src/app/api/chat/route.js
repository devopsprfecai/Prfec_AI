// import { NextResponse } from "next/server";
// import Groq from "groq-sdk";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// // export async function POST(request) {
// //     try {
// //         const { message } = await request.json();
// //         if (!message) {
// //             return NextResponse.json(
// //                 { error: "Message content is required" },
// //                 { status: 400 }
// //             );
// //         }

// //         const chatCompletion = await groq.chat.completions.create({
// //             messages: [
// //                 {
// //                     role: "user",
// //                     content: message,
// //                 },
// //             ],
// //             model: "gemma-7b-it",
// //         });

// //         const responseMessage = chatCompletion.choices[0]?.message?.content || "No response";

// //         return NextResponse.json({ response: responseMessage });
// //     } catch (error) {
// //         console.error("Error in chat API", error);
// //         return NextResponse.json(
// //             { error: "An error occurred while processing your request" },
// //             { status: 500 }
// //         );
// //     }
// // }



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
//                 { error: "This AI-powered platform specializes in generating high-quality blog content. Please provide a blog title to initiate the content creation process." },
//                 { status: 400 }
//             );
//         }

//         // Prepare the prompt for the AI to generate content in the desired format
//         const prompt = `Please generate a blog with the following structure:
//         1. A title for the blog.
//         2. A brief introduction to the blog (description of the topic).
//         3. A list of subtopics, each with a detailed description.

//         DO NOT include labels like "Title:", "Description:", or "Subtopic:" in your response.
//         The blog content should look like this:
        
//         Example:
//         "The Future of AI"
//         AI is shaping the future of various industries. This blog explores the possibilities and challenges that lie ahead.
        
//         Introduction to AI: AI involves the simulation of human intelligence in machines, allowing them to perform tasks that typically require human cognition.
//         Applications of AI: AI has various applications, including healthcare, finance, autonomous vehicles, and more.

//         User's input: ${message}`;

//         // Send the request to the Groq API
//         const chatCompletion = await groq.chat.completions.create({
//             messages: [
//                 {
//                     role: "user",
//                     content: prompt,
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

// // Function to check if the user's message is a request for blog generation
// function isBlogGenerationRequest(message) {
//     const blogKeywords = ["generate a blog", "blog about", "create a blog", "write a blog", "blog with title", "title", "generate", "generate"];
//     return blogKeywords.some(keyword => message.toLowerCase().includes(keyword));
// }

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

        // Prepare the prompt for the AI to generate content in the desired format
        const prompt = `Please generate a blog with the following structure:
        1. A title for the blog.
        2. A brief introduction to the blog (description of the topic).
        3. A list of subtopics, each with a detailed description.

        DO NOT include labels like "Title:", "Description:", or "Subtopic:" in your response. It should have 1000-2000 characters
        The blog content should look like this:
        
        Example:
        "The Future of AI"
        AI is shaping the future of various industries. This blog explores the possibilities and challenges that lie ahead.
        
        Introduction to AI: AI involves the simulation of human intelligence in machines, allowing them to perform tasks that typically require human cognition.
        Applications of AI: AI has various applications, including healthcare, finance, autonomous vehicles, and more.

        User's input: ${message}`;

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

//         // Prepare the prompt for the AI to generate content in the desired format
//         const prompt = `Please generate a blog with the following structure:
//             1. The title of the blog should be enclosed with **title** (e.g., **Your Blog Title**).
//             2. A brief introduction to the blog (description of the topic) Ensure that description are written normally, suitable for enclosing with paragraph tags later.
//             3. Subheadings should be numbered and enclosed with **subheading**, starting with numbers (e.g., 1. **Your Subheading**).
//             4. Paragraph points should be enclosed with - (e.g., - Your paragraph point).
//             5. Ensure that other paragraphs are written normally, suitable for enclosing with paragraph tags later.


//         DO NOT include labels like "Title:", "Description:", or "Subtopic:" in your response.
//         The blog content should look like this:
        
//         Example:
//         **The Future of AI**
//         AI is shaping the future of various industries. This blog explores the possibilities and challenges that lie ahead.
        
//         1. **Introduction to AI**: AI involves the simulation of human intelligence in machines, allowing them to perform tasks that typically require human cognition.
//         - It allows machines to perform tasks requiring human cognition.
//         - AI systems are designed to learn, adapt, and improve over time.
//         2. **Applications of AI**: AI has various applications, including healthcare, finance, autonomous vehicles, and more.
//         - AI is transforming healthcare by enabling early diagnosis and personalized treatment.
//         - In finance, AI helps in fraud detection, algorithmic trading, and risk assessment.

//         User's input: ${message}`;

//         // Try the primary model first
//         let responseMessage;
//         try {
//             // responseMessage = await generateBlog(prompt, "gemma2-9b-it");
//             responseMessage = await generateBlog(prompt, "llama-3.3-70b-versatile");

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

