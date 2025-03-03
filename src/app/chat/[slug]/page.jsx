'use client';
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import ChatDashboard from "@components/prfec-chat-ai/ai/ChatDashboard";
import Chatbot from "@components/prfec-chat-ai/ai/ChatAi";
import { UserAuth } from "@context/AuthContext";
import PrfecAi from "@components/prfec-chat-ai/PrfecAi";

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
        // <PrfecAi chatId={chatId}/>
        <PrfecAi chatId={chatId}/>

    );
};

export default ChatPage;
