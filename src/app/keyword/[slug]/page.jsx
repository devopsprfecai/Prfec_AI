'use client';
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserAuth } from "@context/AuthContext";
import KeywordGenerationAi from "@components/keyword-generation-ai/KeywordGenerationAi";

const ChatPage = () => {
    const { user } = UserAuth();
    const router = useRouter();
    const pathname = usePathname();
    const chatId = pathname.split("/").pop(); // Extract chat ID from URL
    const [validChat, setValidChat] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push("/"); // Redirect to home if user is not logged in
        } else {
            setValidChat(true);
        }
    }, [user,router]);

    if (!validChat) return <p>Loading chat...</p>;

    return (
        // <div style={{display:"flex"}}>
        //     <ChatDashboard chatId={chatId} />
        //     <Chatbot chatId={chatId} /> {/* Pass chatId to chatbot */}
        // </div>
        <KeywordGenerationAi contentId={chatId}/>
    );
};

export default ChatPage;
