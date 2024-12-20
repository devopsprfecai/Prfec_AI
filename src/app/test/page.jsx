import React from "react";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Function to get chat completion
export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "Explain the importance of fast language models",
      },
    ],
    model: "llama3-8b-8192",
  });
}

// React component to render the page
export default async function TestPage() {
  const chatCompletion = await getGroqChatCompletion();

  return (
    <div>
      <h1>Chat Completion</h1>
      <p>{chatCompletion.choices[0]?.message?.content || "No content available"}</p>
    </div>
  );
}
