'use client'
import '@styles/prfec-chat-ai/ChatAi.css';
import { useRouter } from 'next/navigation';
import { UserAuth } from '@context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect } from "react";
import { Marked } from 'marked';
import { database } from '@firebase';
import { ref, set, get, serverTimestamp, update,getDatabase } from 'firebase/database';
import Image from 'next/image';
import copy from '@public/Images/ai/copy.svg';
import refresh from '@public/Images/ai/refresh.svg';
import { IoMdArrowUp } from "react-icons/io";
import prfecBtn from '@public/Images/ai/prfec button.svg';
import { useChatPrompt } from '@context/ChatPromptContext';
import Link from 'next/link';
import { RiCloseFill } from "react-icons/ri";

const Chatbot = ({ chatId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [planType, setPlanType] = useState("free");
    const [planCount, setPlanCount] = useState(3);
    const [popupOpen, setPopupOpen] = useState(false);

    const router = useRouter();
    const { user } = UserAuth();
    const markdown = new Marked();
  const{chatPromptCount, setChatPromptCount} = useChatPrompt(); // Use the keyword prompt context
  let maxPrompts = 3; 

  useEffect(() => {
    if (!user) return;
    
    const fetchPlanType = async () => {
        const userId = user?.uid; 

      try {
        const planRef = ref(database, `/subscriptions/${userId}/planType`);
        const snapshot = await get(planRef);
        if (snapshot.exists()) {
          setPlanType(snapshot.val());
        }
      } catch (error) {
        console.error("Error fetching planType:", error);
      }
    };

    fetchPlanType();
  }, [user]);

    useEffect(() => {
        const fetchChatData = async () => {
            if (!chatId || !user) return;

            const chatRef = ref(database, `chats/${user.uid}/${chatId}`);
            const snapshot = await get(chatRef);

            if (snapshot.exists()) {
                const chatData = snapshot.val();
                if (chatData.messages) setMessages(Object.values(chatData.messages));
                if (chatData.title) setTitle(chatData.title.title);
            }
        };

        fetchChatData();
    }, [chatId, user]);

    // Save messages and title to Firebase with timestamp
    const saveChatToDatabase = async (chatId, messages) => {
        if (!chatId || !user) return;

        const chatRef = ref(database, `chats/${user.uid}/${chatId}`);
        const chatData = {
            messages: messages.reduce((acc, msg, index) => {
                acc[index] = {
                    ...msg,
                    timestamp: msg.timestamp || serverTimestamp()
                };
                return acc;
            }, {}),
            lastUpdated: serverTimestamp()
        };

        await set(chatRef, chatData);
        
        if (!title) await generateChatTitle(chatId, messages);
    };

    // Generate a title for the conversation
    const generateChatTitle = async (chatId, messages) => {
        if (!user || !messages.length) return;

        try {
            const res = await fetch("/api/generate-title", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages }),
            });

            const data = await res.json();
            if (data.title) {
                setTitle(data.title);
                const titleRef = ref(database, `chats/${user.uid}/${chatId}`);
                await update(titleRef, {
                    title: data.title,
                    lastTitleUpdate: serverTimestamp()
                }, { merge: true });
            }
        } catch (error) {
            console.error("Error generating title", error);
        }
    };

    // Send message to API and handle response
    const sendMessage = async () => {
        if (!input.trim() || !user) return;

        const userMessage = {
            role: "user",
            content: input,
            timestamp: serverTimestamp()
        };
        
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setLoading(true);
    const userId = user.uid;
    const db = getDatabase();
    // const planRef = ref(db, `subscriptions/${userId}/planType`);
    // const snapshot = await get(planRef);
    // planType = snapshot.exists() ? snapshot.val() : null;
    const planRef = ref(db, `subscriptions/${userId}/planType`);
    const snapshot = await get(planRef);
    if (snapshot.exists()) {
    setPlanType(snapshot.val()); 
    }

    // Default limit

    if (planType === "starter") {
        maxPrompts = 50;
    } else if (planType === "pro") {
        maxPrompts = 150;
    }

    if (chatPromptCount >= maxPrompts) {
        alert(`You have reached your daily prompt limit of ${maxPrompts}. Please try again tomorrow.`);
        setLoading(false);
        return;
    }

    setChatPromptCount((prev) => prev + 1);
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            const data = await res.json();
            const botMessage = {
                role: "bot",
                content: data.response || "No response",
                timestamp: serverTimestamp()
            };

            simulateTyping(botMessage.content, botMessage);

            const chatSessionId = chatId || uuidv4();
            await saveChatToDatabase(chatSessionId, [...newMessages, botMessage]);

            if (!chatId) router.push(`/chat/${chatSessionId}`);
        } catch (error) {
            console.error("Error sending message", error);
            simulateTyping("There was an error. Please try again.", {
                role: "bot",
                content: "There was an error. Please try again.",
                timestamp: serverTimestamp()
            });
        } finally {
            setLoading(false);
        }
    };

    // Modified simulateTyping to include timestamp
    const simulateTyping = (fullMessage, botMessage) => {
        let currentText = "";
        let index = 0;

        setMessages(prevMessages => [...prevMessages, { ...botMessage, content: "" }]);

        const interval = setInterval(() => {
            if (index < fullMessage.length) {
                currentText += fullMessage[index];
                setMessages(prevMessages => {
                    const newMessages = [...prevMessages];
                    newMessages[newMessages.length - 1] = { ...botMessage, content: currentText };
                    return newMessages;
                });
                index++;
            } else {
                clearInterval(interval);
            }
        }, 5);
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
    };

    const refreshMessage = async (index) => {
        if (!messages.length || !user) return;
        setLoading(true); 

        const userMessageIndex = messages.slice(0, index).reverse().findIndex(msg => msg.role === "user");
        if (userMessageIndex === -1) return; // No user message found before the bot message
    
        const actualUserMessageIndex = index - userMessageIndex - 1;
        const userMessage = messages[actualUserMessageIndex];
    
        const updatedMessages = messages.slice(0, actualUserMessageIndex + 1);
        setMessages(updatedMessages);
    
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage.content }),
            });
    
            const data = await response.json();
            const refreshedBotMessage = {
                role: "bot",
                content: data.response || "Something went wrong.",
                timestamp: serverTimestamp(),
            };
    
            simulateTyping(refreshedBotMessage.content, refreshedBotMessage);
    
            await saveChatToDatabase(chatId, [...updatedMessages, refreshedBotMessage]);
            await generateChatTitle(chatId, [...updatedMessages, refreshedBotMessage]);
    
        } catch (error) {
            console.error("Error refreshing content:", error);
            simulateTyping("Error refreshing message.", { role: "bot", content: "Error refreshing message." });
        }
    };
    

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).catch(() => {});
    };

    const promptLeft = planCount - chatPromptCount;
    useEffect(() => {
        if (promptLeft === 0) {
          setPopupOpen(true); // Set to true, not toggle
        }
      }, [promptLeft]); 
    
    return (
        <div className="prfec-chat">
            <div className="prfec-chat-container">
                <div className="prfec-chat-msg-container">
                    {messages.map((msg, index) => (
                        <div key={index} className={`tc-msgs ${msg.role === "user" ? "user" : "bot"}`}>
                            <div dangerouslySetInnerHTML={{ __html: markdown.parse(msg.content) }} />
                            {msg.role === "bot" &&
                            <div className='tc-msgs-events'>
                                <Image src={copy} width={12} height={13} alt='copy' onClick={() => copyToClipboard(msg.content)}/>
                                <Image src={refresh} width={12} height={13} alt='refresh' onClick={() => refreshMessage(index)} />
                            </div>
                            }
                        </div>
                    ))}
                </div>
                <div className="prfec-chat-prompt">
                {/* {popupOpen && (
                    <div className='chat-input-upgrade'>
                    <div className='chat-input-upgrade-container'>
                    <p>There are currently no prompts left. Prompts will reset after 24 hours.</p>
                    <Link href='/pricing' ><button>Upgrade</button></Link>
                    <RiCloseFill className='chat-input-upgrade-close'  onClick={() => setPopupOpen(false)} style={{color:"var(--p-color)"}}/>
                    </div>
                    </div>
                )}  */}
                    <div className="prfec-chat-prompt-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Type your message..."
                        />
                        <div className={`prfec-chat-input-generate-button ${loading ? 'change' : ''}`} onClick={sendMessage}>
                         {/* <IoMdArrowUp style={{fontSize:"24px",fontWeight:"400", color:"var(--white-black)"}}/> */}
                         Generate
                        <Image src={prfecBtn} alt="prfec" />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;