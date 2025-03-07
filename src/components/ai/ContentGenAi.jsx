
// 'use client';
// import { useState, useEffect, useRef } from 'react';
// import { usePrompt } from '@context/PromptContext';
// import '@styles/ai/BetaAi.css'
// import AiDashboard from '@components/ai/Dashboard';
// import ChatInput from '@components/ai/ChatInput';
// import ChatActionButtons from '@components/ai/ChatActionButtons';
// import LoadingSkeleton from '@components/ai/LoadingSkeleton';
// import Image from 'next/image';
// import { Marked } from 'marked';
// import html2pdf from "html2pdf.js";
// import { getDatabase, ref, get } from "firebase/database";
// import { getAuth } from "firebase/auth";

// export default function PuterChat({currentPath}) {
//   const { promptCount, setPromptCount } = usePrompt();
//   const markdown = new Marked();
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [lastInput, setLastInput] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [buttonHl, setButtonHl] = useState(false);
//   const [isCopied, setIsCopied] = useState(false);
//   const [copyHover, setCopyHover] = useState(false);
//   const [formattedTitle, setFormattedTitle] = useState('');
//   const [metaDescription, setMetaDescription] = useState('');
//   const [formattedContent, setFormattedContent] = useState('');
//   const [category, setCategory] = useState('');
//   const [keyword, setKeyword] = useState('');
//   const [categoryBadges, setCategoryBadges] = useState([]); // State for category badges
//   const [keywordBadges, setKeywordBadges] = useState([]);
//   const [isDashboardActive, setIsDashboardActive] = useState(false);
//   const [loading,setLoading] = useState(false);
//   const dashboardRef = useRef(null); // Create a ref for the dashboard

//   const chatContainerRef = useRef(null);
//   const auth = getAuth();

//   useEffect(() => {
//     if (isDashboardActive) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isDashboardActive]);

//   useEffect(() => {
//     const latestAIMessage = messages.find((msg) => msg.sender === 'AI');
//     if (latestAIMessage) {
//       const formattedHtml = markdown.parse(latestAIMessage.text);
//       const { title, description, content } = parseContent(formattedHtml);
      
//       setFormattedTitle(title);
//       setMetaDescription(description);
//       setFormattedContent(content);
//     }
//   }, [messages]);
//   const parseContent = (content) => {
//     const tempDiv = document.createElement('div');
//     tempDiv.innerHTML = content;

//     const firstHeading = tempDiv.querySelector('h1, h2, h3, h4, h5, h6');
//     const title = firstHeading ? firstHeading.innerHTML : '';
//     if (firstHeading) firstHeading.remove();

//     const firstPara = tempDiv.querySelector('p');
//     const description = firstPara ? firstPara.innerHTML : '';
//     if (firstPara) firstPara.remove();

//     const remainingContent = tempDiv.innerHTML;

//     return {
//       title,
//       description,
//       content: remainingContent
//     };
//   };

//   const handleSendMessage = async () => {
//     if (!input.trim()) return;
  
//     setLoading(true);
  
//     try {
//       // Fetch planType from Firebase
//       const user= auth.currentUser;

//       const userId = user.uid;  
//          const db = getDatabase();
//       const planRef = ref(db, `subscriptions/${userId}/planType`);
//       const snapshot = await get(planRef);
  
//       let planType = snapshot.exists() ? snapshot.val() : null;
//       let maxPrompts = 3; // Default limit
  
//       if (planType === "starter") {
//         maxPrompts = 50;
//       } else if (planType === "pro") {
//         maxPrompts = 150;
//       }
  
//       if (promptCount >= maxPrompts) {
//         alert(`You have reached your daily prompt limit of ${maxPrompts}. Please try again tomorrow.`);
//         setLoading(false);
//         return;
//       }
  
//       // Increment prompt count
//       setPromptCount((prev) => prev + 1);
  
//       let prefixedInput = input.trim().startsWith("blog about") ? input.trim() : `blog about ${input.trim()}`;
  
//       setButtonHl(true);
//       setFormattedTitle('');
//       setMetaDescription('');
//       setFormattedContent('');
//       setCategory('');
//       setKeyword('');
//       setCategoryBadges([]);
//       setKeywordBadges([]);
//       setLastInput(prefixedInput);
  
//       if (categoryBadges.length > 0) {
//         const categoriesText = `Categories: ${categoryBadges.join(', ')}`;
//         prefixedInput += `\n${categoriesText}`;
//       }
  
//       if (keywordBadges.length > 0) {
//         const keywordsText = `Keywords: ${keywordBadges.join(', ')}`;
//         prefixedInput += `\n${keywordsText}`;
//       }
  
//       const userMessage = {
//         id: Date.now(),
//         sender: 'You',
//         text: prefixedInput,
//       };
  
//       setMessages([userMessage]); // ✅ Only store the latest user message
//       setInput('');
//       setButtonHl(false);
//       setIsTyping(true);
  
//       // Send the message to API
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: userMessage.text }),
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         const botMessage = {
//           id: Date.now() + 1,
//           sender: 'AI',
//           text: data.response,
//         };
//         setMessages([userMessage, botMessage]); // ✅ Keep only the latest messages
//       } else {
//         const errorMessage = {
//           id: Date.now() + 1,
//           sender: 'AI',
//           text: data.error || 'Something went wrong.',
//         };
//         setMessages([userMessage, errorMessage]);
//       }
//     } catch (error) {
//       console.error('Error fetching planType or sending chat:', error);
//       setMessages([
//         { id: Date.now(), sender: 'You', text: input.trim() },
//         { id: Date.now() + 1, sender: 'AI', text: 'An unexpected error occurred.' },
//       ]);
//     } finally {
//       setIsTyping(false);
//       setLoading(false);
//     }
//   };
//   function stripHtmlTags(html) {
//     const div = document.createElement('div');
//     div.innerHTML = html;
//     return div.textContent || div.innerText || '';
//   }
//   const handleRefreshContent = async () => {
//     if (!lastInput) return; 

//     let refreshedInput = lastInput;
//     if (categoryBadges.length > 0) {
//       const categoriesText = `Categories: ${categoryBadges.join(', ')}`;
//       refreshedInput += `\n${categoriesText}`;
//     }
  
//     if (keywordBadges.length > 0) {
//       const keywordsText = `Keywords: ${keywordBadges.join(', ')}`;
//       refreshedInput += `\n${keywordsText}`;
//     }

//     setMessages((prev) => prev.filter((msg) => msg.sender !== 'AI'));//remove chat-contents message
//     setFormattedTitle('');//clear dashboard inputs
//     setMetaDescription('');
//     setFormattedContent('');
//     setIsTyping(true);
  
//     try {
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message: refreshedInput }),
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         const botMessage = {
//           id: Date.now() + 1,
//           sender: 'AI',
//           text: data.response,
//         };
//         setMessages((prev) => [...prev.filter((msg) => msg.sender !== 'AI'), botMessage]);
//       } else {
//         const errorMessage = {
//           id: Date.now() + 1,
//           sender: 'AI',
//           text: data.error || 'Something went wrong.',
//         };
//         setMessages((prev) => [...prev.filter((msg) => msg.sender !== 'AI'), errorMessage]);
//       }
//     } catch (error) {
//       console.error('Error refreshing content:', error);
//       const errorMessage = {
//         id: Date.now() + 1,
//         sender: 'AI',
//         text: 'An unexpected error occurred.',
//       };
//       setMessages((prev) => [...prev.filter((msg) => msg.sender !== 'AI'), errorMessage]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handleRestructureClick = async (type) => {
//     const sentence = type === 'title' ? formattedTitle : metaDescription;
//     const category = Array.isArray(categoryBadges) ? categoryBadges.join(', ') : '';
//     const keyword = Array.isArray(keywordBadges) ? keywordBadges.join(', ') : '';
  
//     try {
//       const response = await fetch('/api/refresh', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ sentence}),
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         const newSentence = data.regeneratedSentence;
  
//         setMessages((prevMessages) => {
//           const updatedMessages = [...prevMessages];
//           const lastAiIndex = updatedMessages.findLastIndex((msg) => msg.sender === "AI");
  
//           if (lastAiIndex !== -1) {
//             const lastMessage = updatedMessages[lastAiIndex];
//             let updatedText = lastMessage.text;
  
//             if (type === "title") {
//               updatedText = updatedText.replace(/^##\s*(.*?)\s*$/m, `## ${newSentence}`);
//               setFormattedTitle(newSentence);
//             } else if (type === "description") {
//               const match = formattedTitle.match(/<h1 class="heading1">(.*?)<\/h1>/);
//               let headingText='';
//               if (match) {
//                  headingText = `## ${match[1]}` // Captures the content between the tags
//               } 
//               updatedText = updatedText.replace(/^([\s\S]*?)(?=\s*\*\*|\n\*\*|$)/,`${headingText}\n${newSentence}`);
  
//               setMetaDescription(newSentence);
//             }
//             updatedMessages[lastAiIndex] = { ...lastMessage, text: updatedText };
//           }
  
//           return updatedMessages;
//         });
//       } else {
//         console.error('Error refreshing:', data.error);
//       }
//     } catch (error) {
//       console.error('Error refreshing:', error);
//     }
//   };
//     const handleCopyChat = () => {
//     const chatContent = chatContainerRef.current?.innerText;
//     if (chatContent) {
//       navigator.clipboard
//         .writeText(chatContent)
//         .then(() => setIsCopied(true))
//         .catch((err) => console.error('Failed to copy: ', err));
//     }
  
//     setCopyHover(false);
//     setTimeout(() => setIsCopied(false), 2000);
//   }

//   const handleDownloadChat = () => {
//     const chatContents = document.querySelector('.chat-contents');
//     if (!chatContents) return;
  
//     const cleanedTitle = formattedTitle ? stripHtmlTags(formattedTitle) : 'chat-contents';
//     const fileName = `${cleanedTitle}.pdf`;
  
//     html2pdf()
//       .set({
//         margin: 10,
//         filename: fileName,
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 2 }, // Higher scale for better resolution
//         jsPDF: { format: 'a4', orientation: 'portrait' }
//       })
//       .from(chatContents)
//       .save();
//   };
//   const handleFilterButtonClick = () => {
//     setIsDashboardActive((prevState) => !prevState);
//   };
//   const handleClickOutside = (event) => {
//     if (dashboardRef.current && !dashboardRef.current.contains(event.target)) {

//       setIsDashboardActive(false);
//     }
//   };
//   return (
//     <>

//      <div className="prfec-ai">
//       <div className="prfec-ai-container">
//         <AiDashboard currentPath={currentPath} />

//         <div className='content-gen-space'>

//           <div className="chat-space">
//             <div className="chat-container" ref={chatContainerRef}>
//               <div className='chat-contents'>
//               {messages
//               .filter((msg) => msg.sender === 'You') // Only user messages
//               .map((msg, index) => {
//                 let cleanedText = msg.text.replace(/^blog about\s+/i, ''); 

//                 return (
//                   <div key={index} className="user-message">
//                     <div 
//                       dangerouslySetInnerHTML={{ __html: markdown.parse(cleanedText) }} 
//                       className='user-message-text'
//                     />
//                   </div>
//                 );
//               })}

//                   {messages
//                     .filter((msg) => msg.sender === 'AI')
//                     .map((msg, index) => (
//                       <div key={index} className='ai-message'>
//                         {formattedTitle && (
//                           <h1 className="heading1" dangerouslySetInnerHTML={{ __html: formattedTitle }} />
//                         )}
//                         {metaDescription && (
//                           <p className="meta-description" dangerouslySetInnerHTML={{ __html: metaDescription }} />
//                         )}
//                         {formattedContent && (
//                           <div className="content" dangerouslySetInnerHTML={{ __html: formattedContent }} />
//                         )}
//                       </div>
//                     ))}

//                   {isTyping && (<LoadingSkeleton/>)}

//               </div>
//             </div>
//             <ChatActionButtons isCopied={isCopied} setIsCopied={setIsCopied} handleCopyChat={handleCopyChat} copyHover={copyHover} setCopyHover={setCopyHover}
//             handleRefreshContent={handleRefreshContent} formattedContent={formattedContent} formattedTitle={formattedTitle}
//             handleDownloadChat={handleDownloadChat} handleFilterButtonClick={handleFilterButtonClick} setIsDashboardActive={setIsDashboardActive}/>
//           </div>

//           <ChatInput input={input} setInput={setInput} handleSendMessage={handleSendMessage} 
//       buttonHl={buttonHl} setButtonHl={setButtonHl} promptCount={promptCount} isTyping={isTyping}/>


//         </div>
//         {/* <DashboardRight formattedTitle={formattedTitle} setFormattedTitle={setFormattedTitle}
//           metaDescription={metaDescription} setMetaDescription={setMetaDescription}
//           formattedContent={formattedContent} setFormattedContent={setFormattedContent}
//           handleRestructureClick={handleRestructureClick}    
//           category={category} setCategory={setCategory} categoryBadges={categoryBadges}
//           keyword={keyword} setKeyword={setKeyword} keywordBadges={keywordBadges}
//          isDashboardActive={isDashboardActive} dashboardRef={dashboardRef}
//           handleCategoryChange={(e) => setCategory(e.target.value)}
//           handleCategoryKeyDown={(e) => {
//             if (e.key === 'Enter' && category.trim()) {
//               setCategoryBadges((prev) => [...prev, category]);
//               setCategory('');
//             }
//           }}
//           handleKeywordChange={(e) => setKeyword(e.target.value)}
//           handleKeywordKeyDown={(e) => {
//             if (e.key === 'Enter' && keyword.trim()) {
//               setKeywordBadges((prev) => [...prev, keyword]);
//               setKeyword('');
//             }
//           }} /> */}
//       </div>



//     </div>
//     </>
//   );
// }




// 'use client';
// import { useState, useEffect, useRef } from 'react';
// import { usePrompt } from '@context/PromptContext';
// import '@styles/ai/BetaAi.css'
// import AiDashboard from '@components/ai/Dashboard';
// import ChatInput from '@components/ai/ChatInput';
// import ChatActionButtons from '@components/ai/ChatActionButtons';
// import LoadingSkeleton from '@components/ai/LoadingSkeleton';
// import Image from 'next/image';
// import { Marked } from 'marked';
// import html2pdf from "html2pdf.js";
// import { getDatabase, ref, set, get, push } from "firebase/database";
// import { getAuth } from "firebase/auth";
// import { UserAuth } from '@context/AuthContext';
// import { useRouter } from 'next/navigation';

// export default function PuterChat({currentPath,contentId}) {
//   const { promptCount, setPromptCount } = usePrompt();
//   const markdown = new Marked();
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [lastInput, setLastInput] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [buttonHl, setButtonHl] = useState(false);
//   const [isCopied, setIsCopied] = useState(false);
//   const [copyHover, setCopyHover] = useState(false);
//   const [formattedTitle, setFormattedTitle] = useState('');
//   const [metaDescription, setMetaDescription] = useState('');
//   const [formattedContent, setFormattedContent] = useState('');
//   const [category, setCategory] = useState('');
//   const [keyword, setKeyword] = useState('');
//   const [categoryBadges, setCategoryBadges] = useState([]); // State for category badges
//   const [keywordBadges, setKeywordBadges] = useState([]);
//   const [isDashboardActive, setIsDashboardActive] = useState(false);
//   const [loading,setLoading] = useState(false);
//   const dashboardRef = useRef(null); // Create a ref for the dashboard
//   const router = useRouter();
//   const chatContainerRef = useRef(null);
//   const auth = getAuth();
//   const { user } = UserAuth();

// //   useEffect(() => {
// //     const fetchChatData = async () => {
// //         if (!contentId || !user) return;

// //         const db = getDatabase();
// //         const chatRef = ref(db, `content-generation-prompts/${user.uid}/${contentId}`);
// //         const snapshot = await get(chatRef);

// //         if (snapshot.exists()) {
// //             const chatData = snapshot.val();
// //             console.log("Fetched Chat Data:", chatData); // Debugging line

// //             if (chatData.messages) {
// //                 setMessages(Object.values(chatData.messages)); // Make sure messages exist
// //             } else {
// //                 console.log("No messages found in chatData");
// //             }
// //         } else {
// //             console.log("No chat data found for this contentId");
// //         }
// //     };

// //     fetchChatData();
// // }, [contentId, user]);
// useEffect(() => {
//   const fetchChatData = async () => {
//       if (!contentId || !user) return;

//       const db = getDatabase();
//       const chatRef = ref(db, `content-generation-prompts/${user.uid}/${contentId}/messages`);
//       const snapshot = await get(chatRef);

//       if (snapshot.exists()) {
//           let chatData = Object.values(snapshot.val());
          
//           // Sort messages by timestamp
//           chatData.sort((a, b) => a.timestamp - b.timestamp);

//           console.log("Fetched Chat Messages:", chatData);
//           setMessages(chatData);
//       } else {
//           console.log("No messages found in chatData");
//       }
//   };

//   fetchChatData();
// }, [contentId, user]);


// useEffect(() => {
//   if (contentId) {
//     router.push(`/content-generation/${contentId}`);
//   }
// }, [contentId]);

//   useEffect(() => {
//     if (isDashboardActive) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isDashboardActive]);

//   useEffect(() => {
//     const latestAIMessage = messages.find((msg) => msg.sender === 'AI');
//     if (latestAIMessage) {
//       const formattedHtml = markdown.parse(latestAIMessage.text);
//       const { title, description, content } = parseContent(formattedHtml);
      
//       setFormattedTitle(title);
//       setMetaDescription(description);
//       setFormattedContent(content);
//     }
//   }, [messages]);
//   const parseContent = (content) => {
//     const tempDiv = document.createElement('div');
//     tempDiv.innerHTML = content;

//     const firstHeading = tempDiv.querySelector('h1, h2, h3, h4, h5, h6');
//     const title = firstHeading ? firstHeading.innerHTML : '';
//     if (firstHeading) firstHeading.remove();

//     const firstPara = tempDiv.querySelector('p');
//     const description = firstPara ? firstPara.innerHTML : '';
//     if (firstPara) firstPara.remove();

//     const remainingContent = tempDiv.innerHTML;

//     return {
//       title,
//       description,
//       content: remainingContent
//     };
//   };

//   const handleSendMessage = async () => {
//     if (!input.trim()) return;
  
//     setLoading(true);
  
//     try {
//       // Fetch planType from Firebase
//       // const user= auth.currentUser;

//       const userId = user.uid;  
//          const db = getDatabase();
//       const planRef = ref(db, `subscriptions/${userId}/planType`);
//       const snapshot = await get(planRef);
  
//       let planType = snapshot.exists() ? snapshot.val() : null;
//       let maxPrompts = 3; // Default limit
  
//       if (planType === "starter") {
//         maxPrompts = 50;
//       } else if (planType === "pro") {
//         maxPrompts = 150;
//       }
  
//       if (promptCount >= maxPrompts) {
//         alert(`You have reached your daily prompt limit of ${maxPrompts}. Please try again tomorrow.`);
//         setLoading(false);
//         return;
//       }
  
//       // Increment prompt count
//       setPromptCount((prev) => prev + 1);
  
//       let prefixedInput = input.trim().startsWith("blog about") ? input.trim() : `blog about ${input.trim()}`;
  
//       setButtonHl(true);
//       setFormattedTitle('');
//       setMetaDescription('');
//       setFormattedContent('');
//       setCategory('');
//       setKeyword('');
//       setCategoryBadges([]);
//       setKeywordBadges([]);
//       setLastInput(prefixedInput);
  
//       if (categoryBadges.length > 0) {
//         const categoriesText = `Categories: ${categoryBadges.join(', ')}`;
//         prefixedInput += `\n${categoriesText}`;
//       }
  
//       if (keywordBadges.length > 0) {
//         const keywordsText = `Keywords: ${keywordBadges.join(', ')}`;
//         prefixedInput += `\n${keywordsText}`;
//       }

//       const chatRef = ref(db, `content-generation-prompts/${userId}`);
//       const newChatRef = push(chatRef);
//       const chatId = newChatRef.key;

//       const userMessage = {
//         id: Date.now(),
//         sender: 'You',
//         text: prefixedInput,
//         timestamp: Date.now(),  // Store timestamp

//       };
  
//       setMessages([userMessage]); 
//       setInput('');
//       setButtonHl(false);
//       setIsTyping(true);
  
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: userMessage.text }),
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         const botMessage = {
//           id: Date.now() + 1,  // Ensure different ID
//           sender: 'AI',
//           text: data.response,
//           timestamp: Date.now(),  // Store timestamp
//         };
//         const chatSessionId = chatId || contentId;
//         setMessages([userMessage, botMessage]);
//         await set(ref(db, `content-generation-prompts/${userId}/${chatId}/messages`), {
//           [userMessage.id]: userMessage,
//           [botMessage.id]: botMessage,
//         });
//         // if (!chatId) router.push(`/content-generation/${chatSessionId}`);
//         if (chatId) {
//           router.push(`/content-generation/${chatId}`);
//         }
        
//       } else {
//         const errorMessage = {
//           id: Date.now() + 1,
//           sender: 'AI',
//           text: data.error || 'Something went wrong.',
//         };
//         setMessages([userMessage, errorMessage]);
//       }
//     } catch (error) {
//       console.error('Error fetching planType or sending chat:', error);
//       setMessages([
//         { id: Date.now(), sender: 'You', text: input.trim() },
//         { id: Date.now() + 1, sender: 'AI', text: 'An unexpected error occurred.' },
//       ]);
//     } finally {
//       setIsTyping(false);
//       setLoading(false);
//     }
//   };
//   function stripHtmlTags(html) {
//     const div = document.createElement('div');
//     div.innerHTML = html;
//     return div.textContent || div.innerText || '';
//   }
//   const handleRefreshContent = async () => {
//     if (!lastInput) return; 

//     let refreshedInput = lastInput;
//     if (categoryBadges.length > 0) {
//       const categoriesText = `Categories: ${categoryBadges.join(', ')}`;
//       refreshedInput += `\n${categoriesText}`;
//     }
  
//     if (keywordBadges.length > 0) {
//       const keywordsText = `Keywords: ${keywordBadges.join(', ')}`;
//       refreshedInput += `\n${keywordsText}`;
//     }

//     setMessages((prev) => prev.filter((msg) => msg.sender !== 'AI'));//remove chat-contents message
//     setFormattedTitle('');//clear dashboard inputs
//     setMetaDescription('');
//     setFormattedContent('');
//     setIsTyping(true);
  
//     try {
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message: refreshedInput }),
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         const botMessage = {
//           id: Date.now() + 1,
//           sender: 'AI',
//           text: data.response,
//         };
//         setMessages((prev) => [...prev.filter((msg) => msg.sender !== 'AI'), botMessage]);
//       } else {
//         const errorMessage = {
//           id: Date.now() + 1,
//           sender: 'AI',
//           text: data.error || 'Something went wrong.',
//         };
//         setMessages((prev) => [...prev.filter((msg) => msg.sender !== 'AI'), errorMessage]);
//       }
//     } catch (error) {
//       console.error('Error refreshing content:', error);
//       const errorMessage = {
//         id: Date.now() + 1,
//         sender: 'AI',
//         text: 'An unexpected error occurred.',
//       };
//       setMessages((prev) => [...prev.filter((msg) => msg.sender !== 'AI'), errorMessage]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handleRestructureClick = async (type) => {
//     const sentence = type === 'title' ? formattedTitle : metaDescription;
//     const category = Array.isArray(categoryBadges) ? categoryBadges.join(', ') : '';
//     const keyword = Array.isArray(keywordBadges) ? keywordBadges.join(', ') : '';
  
//     try {
//       const response = await fetch('/api/refresh', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ sentence}),
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         const newSentence = data.regeneratedSentence;
  
//         setMessages((prevMessages) => {
//           const updatedMessages = [...prevMessages];
//           const lastAiIndex = updatedMessages.findLastIndex((msg) => msg.sender === "AI");
  
//           if (lastAiIndex !== -1) {
//             const lastMessage = updatedMessages[lastAiIndex];
//             let updatedText = lastMessage.text;
  
//             if (type === "title") {
//               updatedText = updatedText.replace(/^##\s*(.*?)\s*$/m, `## ${newSentence}`);
//               setFormattedTitle(newSentence);
//             } else if (type === "description") {
//               const match = formattedTitle.match(/<h1 class="heading1">(.*?)<\/h1>/);
//               let headingText='';
//               if (match) {
//                  headingText = `## ${match[1]}` // Captures the content between the tags
//               } 
//               updatedText = updatedText.replace(/^([\s\S]*?)(?=\s*\*\*|\n\*\*|$)/,`${headingText}\n${newSentence}`);
  
//               setMetaDescription(newSentence);
//             }
//             updatedMessages[lastAiIndex] = { ...lastMessage, text: updatedText };
//           }
  
//           return updatedMessages;
//         });
//       } else {
//         console.error('Error refreshing:', data.error);
//       }
//     } catch (error) {
//       console.error('Error refreshing:', error);
//     }
//   };
//     const handleCopyChat = () => {
//     const chatContent = chatContainerRef.current?.innerText;
//     if (chatContent) {
//       navigator.clipboard
//         .writeText(chatContent)
//         .then(() => setIsCopied(true))
//         .catch((err) => console.error('Failed to copy: ', err));
//     }
  
//     setCopyHover(false);
//     setTimeout(() => setIsCopied(false), 2000);
//   }

//   const handleDownloadChat = () => {
//     const chatContents = document.querySelector('.chat-contents');
//     if (!chatContents) return;
  
//     const cleanedTitle = formattedTitle ? stripHtmlTags(formattedTitle) : 'chat-contents';
//     const fileName = `${cleanedTitle}.pdf`;
  
//     html2pdf()
//       .set({
//         margin: 10,
//         filename: fileName,
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 2 }, // Higher scale for better resolution
//         jsPDF: { format: 'a4', orientation: 'portrait' }
//       })
//       .from(chatContents)
//       .save();
//   };
//   const handleFilterButtonClick = () => {
//     setIsDashboardActive((prevState) => !prevState);
//   };
//   const handleClickOutside = (event) => {
//     if (dashboardRef.current && !dashboardRef.current.contains(event.target)) {

//       setIsDashboardActive(false);
//     }
//   };
//   return (
//     <>

//      <div className="prfec-ai">
//       <div className="prfec-ai-container">
//         <AiDashboard currentPath={currentPath} />

//         <div className='content-gen-space'>

//           <div className="chat-space">
//             <div className="chat-container" ref={chatContainerRef}>
//               <div className='chat-contents'>
//               {messages
//               .filter((msg) => msg.sender === 'You') // Only user messages
//               .map((msg, index) => {
//                 let cleanedText = msg.text.replace(/^blog about\s+/i, ''); 

//                 return (
//                   <div key={index} className="user-message">
//                     <div 
//                       dangerouslySetInnerHTML={{ __html: markdown.parse(cleanedText) }} 
//                       className='user-message-text'
//                     />
//                   </div>
//                 );
//               })}

//                   {messages
//                     .filter((msg) => msg.sender === 'AI')
//                     .map((msg, index) => (
//                       <div key={index} className='ai-message'>
//                         {formattedTitle && (
//                           <h1 className="heading1" dangerouslySetInnerHTML={{ __html: formattedTitle }} />
//                         )}
//                         {metaDescription && (
//                           <p className="meta-description" dangerouslySetInnerHTML={{ __html: metaDescription }} />
//                         )}
//                         {formattedContent && (
//                           <div className="content" dangerouslySetInnerHTML={{ __html: formattedContent }} />
//                         )}
//                       </div>
//                     ))}

//                   {isTyping && (<LoadingSkeleton/>)}

//               </div>
//             </div>
//             <ChatActionButtons isCopied={isCopied} setIsCopied={setIsCopied} handleCopyChat={handleCopyChat} copyHover={copyHover} setCopyHover={setCopyHover}
//             handleRefreshContent={handleRefreshContent} formattedContent={formattedContent} formattedTitle={formattedTitle}
//             handleDownloadChat={handleDownloadChat} handleFilterButtonClick={handleFilterButtonClick} setIsDashboardActive={setIsDashboardActive}/>
//           </div>

//           <ChatInput input={input} setInput={setInput} handleSendMessage={handleSendMessage} 
//       buttonHl={buttonHl} setButtonHl={setButtonHl} promptCount={promptCount} isTyping={isTyping}/>

//         </div>
//       </div>
//     </div>
//     </>
//   );
// }



'use client';
import { useState, useEffect, useRef, useCallback  } from 'react';
import { usePrompt } from '@context/PromptContext';
import '@styles/ai/BetaAi.css'
import AiDashboard from '@components/ai/Dashboard';
import ChatInput from '@components/ai/ChatInput';
import ChatActionButtons from '@components/ai/ChatActionButtons';
import LoadingSkeleton from '@components/ai/LoadingSkeleton';
import Image from 'next/image';
import { Marked } from 'marked';
import html2pdf from "html2pdf.js";
import { getDatabase, ref, set, get, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import { UserAuth } from '@context/AuthContext';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { RiMenu4Fill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import Link from 'next/link';

export default function PuterChat({currentPath,contentId}) {
  const { promptCount, setPromptCount } = usePrompt();
  const markdown = new Marked();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [lastInput, setLastInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [buttonHl, setButtonHl] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [copyHover, setCopyHover] = useState(false);
  const [formattedTitle, setFormattedTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [formattedContent, setFormattedContent] = useState('');
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [categoryBadges, setCategoryBadges] = useState([]); // State for category badges
  const [keywordBadges, setKeywordBadges] = useState([]);
  const [isDashboardActive, setIsDashboardActive] = useState(false);
  const [loading,setLoading] = useState(false);
  const dashboardRef = useRef(null); // Create a ref for the dashboard
  const router = useRouter();
  const chatContainerRef = useRef(null);
  const auth = getAuth();
  const { user } = UserAuth();

  const fetchChatData = useCallback(async () => {
    if (!contentId || !user) return;
    const db = getDatabase();
    const chatRef = ref(db, `content-generation-prompts/${user.uid}/${contentId}/messages`);
    const snapshot = await get(chatRef);
    if (snapshot.exists()) {
      let chatData = Object.values(snapshot.val()).sort((a, b) => a.timestamp - b.timestamp);
      setMessages(chatData);
    } 
    // else {
    //   console.log('No messages found in chatData');
    // }
  }, [contentId, user]);

  useEffect(() => {
    fetchChatData();
  }, [fetchChatData]);

  useEffect(() => {
    if (contentId) {
      router.push(`/content-generation/${contentId}`);
    }
  }, [contentId, router]);

  useEffect(() => {
    if (isDashboardActive) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDashboardActive]);

  // useEffect(() => {
  //   const latestAIMessage = messages.find((msg) => msg.sender === 'AI');
  //   if (latestAIMessage) {
  //     const formattedHtml = markdown.parse(latestAIMessage.text);
  //     parseContent(formattedHtml);
  //   }
  // }, [messages]);
  useEffect(() => {
    const latestAIMessage = messages.find((msg) => msg.sender === 'AI');
    if (latestAIMessage && latestAIMessage.text) { // Ensure text exists before parsing
        const formattedHtml = markdown.parse(latestAIMessage.text);
        parseContent(formattedHtml);
    }
}, [messages]);

  const parseContent = (content) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    setFormattedTitle(tempDiv.querySelector('h1, h2, h3')?.innerHTML || '');
    setMetaDescription(tempDiv.querySelector('p')?.innerHTML || '');
    tempDiv.querySelector('h1, h2, h3')?.remove();
    tempDiv.querySelector('p')?.remove();
    setFormattedContent(tempDiv.innerHTML);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
  
    try {
      const userId = user.uid;
      const db = getDatabase();
  
      const planRef = ref(db, `subscriptions/${userId}/planType`);
      const snapshot = await get(planRef);
      const planType = snapshot.exists() ? snapshot.val() : null;
      const maxPrompts = planType === 'pro' ? 150 : planType === 'starter' ? 50 : 3;
  
      if (promptCount >= maxPrompts) {
        alert(`You have reached your daily prompt limit of ${maxPrompts}.`);
        setLoading(false);
        return;
      }
  
      setPromptCount((prev) => prev + 1);

      // const promptRef = ref(db, `users/${userId}/promptCount`);
      // const promptSnapshot = await get(promptRef);
      // let currentPromptCount = promptSnapshot.exists() ? promptSnapshot.val() : 0;
  
      // // Fetch user's plan and determine max prompts
      // const planRef = ref(db, `subscriptions/${userId}/planType`);
      // const planSnapshot = await get(planRef);
      // const planType = planSnapshot.exists() ? planSnapshot.val() : null;
      // const maxPrompts = planType === 'pro' ? 150 : planType === 'starter' ? 50 : 3;
  
      // if (currentPromptCount >= maxPrompts) {
      //   alert(`You have reached your daily prompt limit of ${maxPrompts}.`);
      //   setLoading(false);
      //   return;
      // }
      // const newPromptCount = currentPromptCount + 1;
      // await set(promptRef, newPromptCount);
      // setPromptCount(newPromptCount);
  
      const chatId = uuidv4(); // Always generate a new ID for every new prompt
  
      const prefixedInput = input.trim().startsWith('blog about') ? input.trim() : `blog about ${input.trim()}`;
  
      const userMessage = {
        id: uuidv4(),
        sender: 'You',
        text: prefixedInput,
        timestamp: Date.now(),
      };
  
      setMessages([userMessage]); // Start fresh chat with new message
      setInput('');
      setIsTyping(true);
  
      // Store user message in Firebase under the new chatId
      const chatRef = ref(db, `content-generation-prompts/${userId}/${chatId}/messages`);
      await set(chatRef, { [userMessage.id]: userMessage });
  
      // Call API to get AI response
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prefixedInput }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const botMessage = {
          id: uuidv4(),
          sender: 'AI',
          text: data.response,
          timestamp: Date.now(),
        };
  
        // Add AI message to state
        setMessages((prev) => [...prev, botMessage]);
  
        // Store AI response under new chatId
        await set(ref(db, `content-generation-prompts/${userId}/${chatId}/messages/${botMessage.id}`), botMessage);
      }
  
      // ✅ **Redirect ONLY AFTER AI response is stored**
      router.push(`/content-generation/${chatId}`);
  
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsTyping(false);
      setLoading(false);
    }
  };
  

  function stripHtmlTags(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
  // const handleRefreshContent = async () => {

  //   // if (!messages) return; 

  //   let refreshedInput = messages
  //   .filter(msg => msg.sender === 'You') // Only take AI-generated content
  //   .map(msg => msg.text) // Extract only the text
  //   .join("\n\n");     

  //   if (categoryBadges.length > 0) {
  //     const categoriesText = `Categories: ${categoryBadges.join(', ')}`;
  //     refreshedInput += `\n${categoriesText}`;
  //   }
  
  //   if (keywordBadges.length > 0) {
  //     const keywordsText = `Keywords: ${keywordBadges.join(', ')}`;
  //     refreshedInput += `\n${keywordsText}`;
  //   }

  //   setMessages((prev) => prev.filter((msg) => msg.sender !== 'AI'));//remove chat-contents message
  //   setFormattedTitle('');//clear dashboard inputs
  //   setMetaDescription('');
  //   setFormattedContent('');
  //   setIsTyping(true);
  
  //   try {
  //     const response = await fetch('/api/content', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ message: refreshedInput }),
  //     });
  
  //     const data = await response.json();
  
  //     if (response.ok) {
  //       const botMessage = {
  //         id: Date.now() + 1,
  //         sender: 'AI',
  //         text: data.response,
  //       };
  //       setMessages((prev) => [...prev.filter((msg) => msg.sender !== 'AI'), botMessage]);
  //     } else {
  //       const errorMessage = {
  //         id: Date.now() + 1,
  //         sender: 'AI',
  //         text: data.error || 'Something went wrong.',
  //       };
  //       setMessages((prev) => [...prev.filter((msg) => msg.sender !== 'AI'), errorMessage]);
  //     }
  //   } catch (error) {
  //     console.error('Error refreshing content:', error);
  //     const errorMessage = {
  //       id: Date.now() + 1,
  //       sender: 'AI',
  //       text: 'An unexpected error occurred.',
  //     };
  //     setMessages((prev) => [...prev.filter((msg) => msg.sender !== 'AI'), errorMessage]);
  //   } finally {
  //     setIsTyping(false);
  //   }
  // };
  const handleRefreshContent = async () => {
    if (!messages.length) return;
  
    let refreshedInput = messages
      .filter(msg => msg.sender === 'You') // Get user input only
      .map(msg => msg.text)
      .join("\n\n");
  
    if (categoryBadges.length > 0) {
      refreshedInput += `\nCategories: ${categoryBadges.join(', ')}`;
    }
  
    if (keywordBadges.length > 0) {
      refreshedInput += `\nKeywords: ${keywordBadges.join(', ')}`;
    }
  
    setMessages((prev) => prev.filter((msg) => msg.sender !== 'AI')); // Remove old AI message
    setFormattedTitle('');
    setMetaDescription('');
    setFormattedContent('');
    setIsTyping(true);
  
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: refreshedInput }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const botMessage = {
          id: messages.find(msg => msg.sender === 'AI')?.id || uuidv4(), // Keep same AI message ID
          sender: 'AI',
          text: data.response,
          timestamp: Date.now(),
        };
  
        setMessages((prev) => [...prev.filter((msg) => msg.sender !== 'AI'), botMessage]);
  
        // ✅ Update AI response in Firebase under the same chat ID
        if (contentId && user) {
          const db = getDatabase();
          const chatRef = ref(db, `content-generation-prompts/${user.uid}/${contentId}/messages/${botMessage.id}`);
          await set(chatRef, botMessage);
        }
      } else {
        setMessages((prev) => [...prev, { id: uuidv4(), sender: 'AI', text: data.error || 'Something went wrong.' }]);
      }
    } catch (error) {
      console.error('Error refreshing content:', error);
      setMessages((prev) => [...prev, { id: uuidv4(), sender: 'AI', text: 'An unexpected error occurred.' }]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleRestructureClick = async (type) => {
    const sentence = type === 'title' ? formattedTitle : metaDescription;
    const category = Array.isArray(categoryBadges) ? categoryBadges.join(', ') : '';
    const keyword = Array.isArray(keywordBadges) ? keywordBadges.join(', ') : '';
  
    try {
      const response = await fetch('/api/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sentence}),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const newSentence = data.regeneratedSentence;
  
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const lastAiIndex = updatedMessages.findLastIndex((msg) => msg.sender === "AI");
  
          if (lastAiIndex !== -1) {
            const lastMessage = updatedMessages[lastAiIndex];
            let updatedText = lastMessage.text;
  
            if (type === "title") {
              updatedText = updatedText.replace(/^##\s*(.*?)\s*$/m, `## ${newSentence}`);
              setFormattedTitle(newSentence);
            } else if (type === "description") {
              const match = formattedTitle.match(/<h1 class="heading1">(.*?)<\/h1>/);
              let headingText='';
              if (match) {
                 headingText = `## ${match[1]}` // Captures the content between the tags
              } 
              updatedText = updatedText.replace(/^([\s\S]*?)(?=\s*\*\*|\n\*\*|$)/,`${headingText}\n${newSentence}`);
  
              setMetaDescription(newSentence);
            }
            updatedMessages[lastAiIndex] = { ...lastMessage, text: updatedText };
          }
  
          return updatedMessages;
        });
      } else {
        console.error('Error refreshing:', data.error);
      }
    } catch (error) {
      console.error('Error refreshing:', error);
    }
  };
    const handleCopyChat = () => {
    const chatContent = chatContainerRef.current?.innerText;
    if (chatContent) {
      navigator.clipboard
        .writeText(chatContent)
        .then(() => setIsCopied(true))
        .catch((err) => console.error('Failed to copy: ', err));
    }
  
    setCopyHover(false);
    setTimeout(() => setIsCopied(false), 2000);
  }

  const handleDownloadChat = () => {
    const chatContents = document.querySelector('.chat-contents');
    if (!chatContents) return;
  
    const cleanedTitle = formattedTitle ? stripHtmlTags(formattedTitle) : 'chat-contents';
    const fileName = `${cleanedTitle}.pdf`;
  
    html2pdf()
      .set({
        margin: 10,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 }, // Higher scale for better resolution
        jsPDF: { format: 'a4', orientation: 'portrait' }
      })
      .from(chatContents)
      .save();
  };
  const handleFilterButtonClick = () => {
    setIsDashboardActive((prevState) => !prevState);
  };
  const handleClickOutside = (event) => {
    if (dashboardRef.current && !dashboardRef.current.contains(event.target)) {

      setIsDashboardActive(false);
    }
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 800);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 800);
      if (window.innerWidth > 800) {
        setMenuOpen(false); // Ensure menu closes when resizing to desktop mode
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize state on mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const adjustHeight = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      if (viewportWidth <= 600) {
        document.querySelector('.prfec-ai').style.height = `${viewportHeight}px`;
      } else {
        document.querySelector('.prfec-ai').style.height = 'auto';
      }
    };

    adjustHeight();
    window.addEventListener('resize', adjustHeight);

    return () => window.removeEventListener('resize', adjustHeight);
  }, []);

  const handleMenuOpen = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <>

     <div className="prfec-ai">
      <div className="prfec-ai-container">
        {/* <AiDashboard currentPath={currentPath} /> */}
        {isDesktop && <AiDashboard />}



        <div className='content-gen-space'>

        <div className={`chat-space ${!messages.some((msg) => msg.sender === 'AI') && !isTyping ? "center-content" : ""}`}>
          {!messages.some((msg) => msg.sender === 'AI') && !isTyping && (
            <h2 className="empty-state-title">Generate SEO Ready Blogs</h2>
          )}
            <div className="chat-container" ref={chatContainerRef}>
              <div className='chat-contents'>
              {messages
              .filter((msg) => msg.sender === 'You') // Only user messages
              .map((msg, index) => {
                let cleanedText = msg.text.replace(/^blog about\s+/i, ''); 

                return (
                  <div key={index} className="user-message">
                    <div 
                      dangerouslySetInnerHTML={{ __html: markdown.parse(cleanedText) }} 
                      className='user-message-text'
                    />
                  </div>
                );
              })}

                  {messages
                    .filter((msg) => msg.sender === 'AI')
                    .map((msg, index) => (
                      <div key={index} className='ai-message'>
                        {formattedTitle && (
                          <h1 className="heading1" dangerouslySetInnerHTML={{ __html: formattedTitle }} />
                        )}
                        {metaDescription && (
                          <p className="meta-description" dangerouslySetInnerHTML={{ __html: metaDescription }} />
                        )}
                        {formattedContent && (
                          <div className="content" dangerouslySetInnerHTML={{ __html: formattedContent }} />
                        )}
                      </div>
                    ))}

                  {isTyping && (<LoadingSkeleton/>)}

              </div>
            </div>
            <ChatActionButtons isCopied={isCopied} setIsCopied={setIsCopied} handleCopyChat={handleCopyChat} copyHover={copyHover} setCopyHover={setCopyHover}
            handleRefreshContent={handleRefreshContent} formattedContent={formattedContent} formattedTitle={formattedTitle}
            handleDownloadChat={handleDownloadChat} handleFilterButtonClick={handleFilterButtonClick} setIsDashboardActive={setIsDashboardActive}/>
          </div>

          <ChatInput   input={input} 
  setInput={setInput} 
  handleSendMessage={handleSendMessage} 
  buttonHl={buttonHl} 
  setButtonHl={setButtonHl} 
  promptCount={promptCount} 
  setPromptCount={setPromptCount}  // ✅ Pass setPromptCount as a prop
  isTyping={isTyping}/>

        </div>
      </div>
    </div>
    </>
  );
}