// 'use client';
// import { useState, useEffect, useRef } from 'react';
// import '@styles/ai/BetaAi.css'
// import Image from 'next/image';
// import Hover from '@public/Images/ai/hover.svg';
// import NoHover from '@public/Images/ai/nohover.svg';
// import copy from '@public/Images/ai/copy.svg';
// import refresh from '@public/Images/ai/refresh.svg';
// import refresh2 from '@public/Images/ai/refresh-dash.svg';
// import download from '@public/Images/ai/download.svg';
// import prfecBtn from '@public/Images/ai/prfec button.svg';
// import filter from '@public/Images/ai/filter.svg';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

// import { metadata } from '@app/layout';

// export default function PuterChat() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
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
//   const dashboardRef = useRef(null); // Create a ref for the dashboard
//   const messagesEndRef = useRef(null);
//   const chatContainerRef = useRef(null);

//   useEffect(() => {
//     const lastAiMessage = messages.find((msg) => msg.sender === 'AI');
//     if (lastAiMessage) {
//       const { formattedTitle: newTitle, paragraph: newDescription, formattedContent: newContent } = formatBlogContent(lastAiMessage.text);
  
//       // Update state only if it's different
//       if (newTitle && newTitle !== formattedTitle) setFormattedTitle((prev) => prev || newTitle);
//       if (newDescription && newDescription !== metaDescription) setMetaDescription((prev) => prev || newDescription);

//       if (newContent && newContent !== formattedContent) setFormattedContent((prev) => prev || newContent);
//     }
//   }, [messages]);


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

//   const handleInputChange = (event) => {
//     const newInput = event.target.value;
//     setInput(newInput);
//     setButtonHl(newInput.trim() !== ''); // Highlight button if input isn't empty
//   };

//   const handleSendMessage = async () => {
//     if (!input.trim()) return;

//     const prefixedInput = input.trim().startsWith("blog about")
//     ? input.trim()
//     : `blog about ${input.trim()}`;

//     setButtonHl(true); // Highlight button when message is being sent
//     setFormattedTitle(''); // Reset the previous title
//     setMetaDescription(''); // Reset the previous meta description
//     setFormattedContent('');

//     const userMessage = {
//       id: Date.now(),
//       sender: 'You',
//       text: prefixedInput,
//     };

//     // Clear previous AI messages before adding the new one
//     setMessages((prev) => [
//       ...prev.filter((msg) => msg.sender !== 'AI'),
//       userMessage,
//     ]);

//     setInput('');
//     setButtonHl(false); // Reset button highlight while waiting for AI response
//     setIsTyping(true);

//     try {
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message: userMessage.text }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         const botMessage = {
//           id: Date.now() + 1,
//           sender: 'AI',
//           text: data.response,
//         };
//         setMessages((prev) => [...prev, botMessage]);
//       } else {
//         const errorMessage = {
//           id: Date.now() + 1,
//           sender: 'AI',
//           text: data.error || 'Something went wrong.',
//         };
//         setMessages((prev) => [...prev, errorMessage]);
//       }
//     } catch (error) {
//       console.error('Error fetching chat:', error);
//       const errorMessage = {
//         id: Date.now() + 1,
//         sender: 'AI',
//         text: 'An unexpected error occurred.',
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handleCopyChat = () => {
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

//     html2canvas(chatContents).then((canvas) => {
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size
  
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
//       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
//       pdf.save(fileName);
//     });
//   };

//   const handleCopyMouseOver = () => {
//     if (!isCopied) {
//       setCopyHover(true);
//     }
//   };

//   const handleCopyMouseOut = () => {
//     setCopyHover(false);
//   };

//   const handleCopyMouseDown = () => {
//     setCopyHover(false);
//   };

//   const handleRefreshChat = async () => {
//           // Clear the AI Dashboard inputs when refreshing chat
//           setFormattedTitle('');
//           setMetaDescription('');
//           setFormattedContent('');

//     const lastUserMessage = messages
//       .slice()
//       .reverse()
//       .find((msg) => msg.sender === 'You');
  
//     if (!lastUserMessage) return;
  
//     // Clear previous AI messages before adding the refreshed one
//     setMessages((prev) => prev.filter((msg) => msg.sender !== 'AI'));
  
//     setIsTyping(true);
  
//     try {
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message: lastUserMessage.text }),
//       });
  
//       const data = await response.json();
  
//       if (response.ok) {
//         const refreshedMessage = {
//           id: Date.now(),
//           sender: 'AI',
//           text: data.response,
//         };
  
//         setMessages((prev) => [
//           ...prev.filter((msg) => msg.sender !== 'AI'),
//           refreshedMessage,
//         ]);
//       } else {
//         const errorMessage = {
//           id: Date.now(),
//           sender: 'AI',
//           text: data.error || 'Something went wrong while refreshing.',
//         };
  
//         setMessages((prev) => [
//           ...prev.filter((msg) => msg.sender !== 'AI'),
//           errorMessage,
//         ]);
//       }
//     } catch (error) {
//       console.error('Error refreshing chat:', error);
//       const errorMessage = {
//         id: Date.now(),
//         sender: 'AI',
//         text: 'An unexpected error occurred while refreshing.',
//       };
  
//       setMessages((prev) => [
//         ...prev.filter((msg) => msg.sender !== 'AI'),
//         errorMessage,
//       ]);
//     } finally {
//       setIsTyping(false);
      

//     }
//   };

//   const handleRestructureClick = async (type) => {
//     const sentence =
//       type === "title"
//         ? stripHtmlTags(formattedTitle)
//         : type === "description"
//         ? stripHtmlTags(metaDescription)
//         : stripHtmlTags(formattedContent);
  
//     if (!sentence.trim()) {
//       console.warn(""); 
//       return;
//     }
  
//     try {
//       const response = await fetch("/api/refresh", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ sentence, category, keyword }),
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
//               updatedText = updatedText.replace(
//                 /\*\*Introduction:\*\*\s*([\s\S]*?)(?=\*\*|$)/,
//                 `**Introduction:** ${newSentence}`
//               );
//               setMetaDescription(newSentence);
//             } else if (type === "content") {
//               updatedText += `\n\n${newSentence}`;
//               console.log("New sentence:", newSentence);
//               setFormattedContent("");
//               console.log("Formatted:", formattedContent);
//               setFormattedContent(newSentence);
//             }
  
//             updatedMessages[lastAiIndex] = { ...lastMessage, text: updatedText };
//           }
  
//           return updatedMessages;
//         });
//       } else {
//         console.error(data.error || "Failed to regenerate the sentence."); 
//       }
//     } catch (error) {
//       console.error("Error regenerating sentence:", error); 
//     }
//   };
  
  
 
// const formatBlogContent = (content) => {
//     const cleanedContent = content;
  
//     //-------------------------------------------------------------------------------------------------- Title
//     const titleMatch = cleanedContent.match(
//       /^##\s*(.*?)\s*$|^###\s*(.*?)\s*$|^## Blog:\s*\*\*(.*?)\*\*|^##\s*Blog:\s*(.*?)$|^##\s?\*\*(.*?)\*\*|\*\*Blog:\s*(.*?)\*\*/m
//     );
   
  
//     let BlogTitle = "";
//     if (titleMatch) {
//       BlogTitle = titleMatch[1] || titleMatch[2] || titleMatch[3] || titleMatch[4] ||titleMatch[5] ||titleMatch[6] || "";
//     }

//     const formattedTitle = BlogTitle
//       ? `<h1 class="heading1">${BlogTitle.trim()}</h1>`
//       : "";

//     // ------------------------------------------------------------------------------------------------Paragraph

//     const introMatch = cleanedContent.match(
//       /^([\s\S]*?)(?=\s*\*\*|\n\*\*|$)|\*\*Introduction:\*\*\s*([\s\S]*?)(?=\s\*\*|$)|^###\s*Introduction\s*([\s\S]*?)(?=\s\*\*|^##|\n|$)/
//     );

//     let BlogPara = "";

//     if (introMatch) {
//       BlogPara = introMatch[1] || introMatch[2] || introMatch[3] || introMatch[4] ||introMatch[5] || "";
//     }
//     if (formattedTitle && BlogPara.includes(BlogTitle)) {
//       BlogPara = BlogPara.replace(BlogTitle, "").trim();
//     }

//     const paragraph = BlogPara
//       ? `<p class="para-text">${BlogPara.replace(/##/g, '').trim()}</p>` 
//       : "";

//   // --------------------------------------------------------------------------------------------------------------------------

//     let contentWithoutTitleAndParagraph = cleanedContent;
 
//     if (paragraph) {
//       contentWithoutTitleAndParagraph = contentWithoutTitleAndParagraph.replace(introMatch[0], "");
//     }
//     if (formattedTitle) {
//       contentWithoutTitleAndParagraph = contentWithoutTitleAndParagraph.replace(titleMatch[0], "");
//     }

//     //------------------------------------------------------------------------------------------------------------------
//     const formattedContent = contentWithoutTitleAndParagraph
//       .replace(/^###\s?\*\*(.*?)\*\*/gm, '<h2 class="heading2an">$1</h2>') //for ###**.....**
//       .replace(/^###\s*(.*?)\s*$/gm, '<h2 class="heading2an">$1</h2>') // for ###....
//       .replace(/^##\s*(.*?)\s*$/gm, '<h2 class="heading2an">$1</h2>') // for ##....
//       .replace(/\*\s\*\*(.*?)\*\*\:/g, '<h4 class="heading3">$1:</h4>') // for * **...
//       .replace(/\-\s\*\*(.*?)\*\*\:/g, '<h4 class="heading3">$1:</h4>') // for - **...
//       .replace(/\*\s\*\*(.*?)\*\*/g, '<h4 class="heading3">$1</h4>') // for * **...
//       .replace(/\-\s\*\*(.*?)\*\*/g, '<h4 class="heading3">$1</h4>') // for - **...
//       .replace(/\*\*(.*?)\*\*/g, '<h2 class="heading2">$1</h2>') // for **.....
//       .replace(/^([*-])\s(.*?)(?=\n|$)/gm, '<li class="list-item">$2</li>') 
//       .replace(/^(?!<h1|<h2)(.*?)(?=\n|$)/gm, '<p class="para-text">$1</p>') // Paragraph tag for other content
//       .replace(/\n+/g, "") // Remove extra line breaks
//       .trim();

  
//     return { formattedTitle, paragraph, formattedContent};
//   };


//   function stripHtmlTags(html) {
//     const div = document.createElement('div');
//     div.innerHTML = html;
//     return div.textContent || div.innerText || '';
//   }

// const handleRegenerateWithCategoryAndKeyword = async () => {
//   const fullCategory = [...categoryBadges, category].join(", ");
//   const fullKeyword = [...keywordBadges, keyword].join(", ");

//   // Ensure both category and keyword are provided
//   if (!fullCategory.trim() || !fullKeyword.trim()) {
//     alert('Please provide both category and keyword!');
//     return;
//   }

//   const lastUserMessage = messages
//     .slice()
//     .reverse()
//     .find((msg) => msg.sender === 'You');
  
//   if (!lastUserMessage) return;

//   // Clear previous AI messages before adding the refreshed one
//   setMessages((prev) => prev.filter((msg) => msg.sender !== 'AI'));

//   setIsTyping(true);

//   try {
//     const response = await fetch('/api/chat', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         message: lastUserMessage.text,
//         category: fullCategory,  // Send combined categories
//         keyword: fullKeyword,    // Send combined keywords
//       }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       const regeneratedMessage = {
//         id: Date.now(),
//         sender: 'AI',
//         text: data.response,
//       };

//       setMessages((prev) => [...prev, regeneratedMessage]);
//     } else {
//       const errorMessage = {
//         id: Date.now() + 1,
//         sender: 'AI',
//         text: data.error || 'Failed to regenerate content with category and keyword.',
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     }
//   } catch (error) {
//     console.error('Error regenerating content:', error);
//     const errorMessage = {
//       id: Date.now() + 1,
//       sender: 'AI',
//       text: 'An unexpected error occurred while regenerating.',
//     };
//     setMessages((prev) => [...prev, errorMessage]);
//   } finally {
//     setIsTyping(false);
//   }
// };

//   const handleCategoryChange = (event) => {
//     setCategory(event.target.value);
//   };

//   const handleKeywordChange = (event) => {
//     setKeyword(event.target.value);
//   };

//   const handleCategoryKeyDown = (event) => {
//     if (event.key === 'Enter' && category.trim()) {
//       setCategoryBadges((prev) => [...prev, category]);
//       setCategory('');
//     }
//   };

//   const handleKeywordKeyDown = (event) => {
//     if (event.key === 'Enter' && keyword.trim()) {
//       setKeywordBadges((prev) => [...prev, keyword]);
//       setKeyword('');
//     }
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
//      <div className="prfec-ai">
//       <div className="prfec-ai-container">
//         {/* AI Dashboard Section */}
//         <div className={`ai-dashboard ${isDashboardActive ? "active" : ""}`} ref={dashboardRef}>
//           <div className="ai-dashboard-container">
//             <h1 className='ai-chat-heading'>AI Content Generation</h1>

//             <div className="ai-dashboard-contents">
//             <div className="ai-dashboard-title">
//                 <label htmlFor="ai-title" className='dashboard-label'>Title</label>  
//                 <div className='ai-dashboard-title-input'>
//                   <input type="text" id="ai-title" value={stripHtmlTags(formattedTitle)} readOnly />
//                   <div className="refresh-title-button" onClick={() => handleRestructureClick('title')}>
//                     <Image src={refresh2} height={12} alt='refresh'/>
//                   </div>
//                 </div>
//               </div>
//               <div className="ai-dashboard-description">
//                 <label htmlFor="ai-description" className='dashboard-label'>Meta description</label>
//                 <div className='ai-dashboard-title-input'>
//                   <input type="text" id="ai-description"
//                     value={stripHtmlTags(metaDescription) === "This AI-powered platform specializes in generating high-quality blog content. Please provide a blog title to initiate the content creation process."
//                       ? "" // If the description matches, replace it with an empty string
//                       : stripHtmlTags(metaDescription)} // Else, display the cleaned metaDescription
//                     readOnly
//                   />
//                   <div className="refresh-description-button" onClick={() => handleRestructureClick('description')}>
//                     <Image src={refresh2} height={12} alt='refresh'/>
//                   </div>
//                 </div>
//               </div>

//               <div className="ai-dashboard-body">
//                 <label htmlFor="" className='dashboard-label'>Body</label>
//                 <div className='ai-dashboard-title-input'>
//                   <input type="text" id="ai-content" value={stripHtmlTags(formattedContent)} readOnly  />
//                   <div className="refresh-body-button" onClick={() => handleRestructureClick('content')}>
//                     <Image src={refresh2} height={12} alt='refresh'/>
//                   </div>
//                 </div>
//               </div>
//               <div className="ai-dashboard-category">
//                 <label htmlFor="category" className='dashboard-label'>Category</label>
//                 <div className='ai-dashboard-title-input'>
//                   <input type="text" id="category" value={category} onChange={handleCategoryChange} onKeyDown={handleCategoryKeyDown} />
//                 </div>
//                 {categoryBadges &&
//                 <div className="badges-container">
//                   {categoryBadges.map((badge, index) => (
//                     <span key={index} className="badge">
//                       {badge}
//                     </span>
//                   ))}
//                 </div>}
//               </div>
//               <div className="ai-dashboard-category">
//                 <label htmlFor="keyword" className='dashboard-label'>Keyword</label>
//                 <div className='ai-dashboard-title-input'>
//                   <input type="text" id="keyword" value={keyword} onChange={handleKeywordChange} onKeyDown={handleKeywordKeyDown} />
//                 </div>
//                 {keywordBadges &&
//                 <div className="badges-container">
//                   {keywordBadges.map((badge, index) => (
//                     <span key={index} className="badge">
//                       {badge}
//                     </span>
//                   ))}
//                 </div>}
//               </div>

//               {/* <button className="regenerate-button" onClick={handleRegenerateWithCategoryAndKeyword}> submit </button> */}

//             </div>
//           </div>
//         </div>

//         <div className='content-gen-space'>

//           <div className="chat-space">
//             <div className="chat-container" ref={chatContainerRef}>
//               <div className='chat-contents'>
//                   {messages
//                     .filter((msg) => msg.sender === 'AI')
//                     .map((msg, index) => {
//                       const { formattedTitle, paragraph, formattedContent } = formatBlogContent(msg.text);
                      
//                       return (
//                         <div key={index}>
//                           {formattedTitle && (
//                             <h1 className="heading1" dangerouslySetInnerHTML={{ __html: formattedTitle }} />
//                           )}
                          
//                           {paragraph && (
//                             <p className="para-text ai-message" dangerouslySetInnerHTML={{ __html: paragraph }} />
//                           )}

//                           {formattedContent && (
//                             <p className="para-text ai-message" dangerouslySetInnerHTML={{ __html: formattedContent }} />
//                           )}
//                         </div>
//                       );
//                     })}

//                   {isTyping && (
//                     <div className="loading-skeleton ai-message">
//                       <div className="skeleton-line"></div>
//                       <div className="skeleton-line"></div>
//                       <div className="skeleton-line"></div>
//                     </div>
//                   )}

//               </div>
//             </div>
//             <div className="chat-action-buttons">
//               <div className='chat-action-buttons-left'>
//               <div className="filter-chat-button" onClick={handleFilterButtonClick}>
//                     <Image src={filter} height={19} alt='download'/>
//                   </div>
//               </div>
//               <div className='chat-action-buttons-right'>
//                   <div className="copy-chat-button">
//                     <Image src={copy}  height={14} onClick={handleCopyChat} alt='copy'/>
//                     <div className="chat-button-label">
//                       {isCopied && (
//                         <div className="chat-button-label-copied">Copied</div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="download-chat-button">
//                     <Image src={download} height={14}    onClick={() => formattedTitle && handleDownloadChat()} alt='download'/>
//                   </div>
//                   <div className="refresh-chat-button">
//                     <Image src={refresh} height={13} onClick={handleRefreshChat} alt='refresh'/>
//                   </div>
//               </div>
//             </div>
//             {formattedContent && <div className="chat-action-buttons-mobile">
//               <div className='chat-action-buttons-left'>
//               <div className="filter-chat-button" onClick={handleFilterButtonClick}>
//                     <Image src={filter} height={19} alt='download'/>
//                   </div>
//               </div>
//               <div className='chat-action-buttons-right'>
//                   <div className="copy-chat-button">
//                     <Image src={copy}  height={14} onClick={handleCopyChat} alt='copy'/>
//                     <div className="chat-button-label">
//                       {isCopied && (
//                         <div className="chat-button-label-copied">Copied</div>
//                       )}
//                     </div>
//                   </div>
//                   <div className="download-chat-button">
//                     <Image src={download} height={14}    onClick={() => formattedTitle && handleDownloadChat()} alt='download'/>
//                   </div>
//                   <div className="refresh-chat-button">
//                     <Image src={refresh} height={13} onClick={handleRefreshChat} alt='refresh'/>
//                   </div>
//               </div>
//             </div>}
//           </div>

//         </div>
//       </div>

//       <div className="chat-input">
//           <div className="chat-input-container">
//             <input
//               type="text"
//               value={input}
//               onChange={handleInputChange}
//               onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
//               placeholder="Type your message..."
//             />
//             <div className='chat-input-generate-button' onClick={handleSendMessage} style={{ backgroundColor: buttonHl ?  '#414abb' : '#515bda'  }}>
//               <p>Generate</p>
//               <Image src={prfecBtn} alt='prfec'/>
//             </div>
//             <div className='chat-input-mobile-button' >
//               <Image  width={24} height={24} src={buttonHl ? Hover : NoHover}  alt="Button Icon" onClick={handleSendMessage}/>
//             </div>
//           </div>
//       </div>
  
//     </div>
//   );
// }

'use client';
import { useState, useEffect, useRef } from 'react';
import '@styles/ai/BetaAi.css'
import AiDashboard from '@components/ai/Dashboard';
import ChatInput from '@components/ai/ChatInput';
import ChatActionButtons from '@components/ai/ChatActionButtons';
import LoadingSkeleton from '@components/ai/LoadingSkeleton';
import Image from 'next/image';
import copy from '@public/Images/ai/copy.svg';
import refresh from '@public/Images/ai/refresh.svg';
import download from '@public/Images/ai/download.svg';
import prfecBtn from '@public/Images/ai/prfec button.svg';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


import { metadata } from '@app/layout';

export default function PuterChat() {
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
  const dashboardRef = useRef(null); // Create a ref for the dashboard

  const chatContainerRef = useRef(null);

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
  useEffect(() => {
    const latestAIMessage = messages.find((msg) => msg.sender === 'AI');
    if (latestAIMessage) {
      const { formattedTitle, formattedParagraph, formattedContent } = formatBlogContent(latestAIMessage.text);
      setFormattedTitle(formattedTitle);
      setMetaDescription(formattedParagraph); // Assuming paragraph as meta description
      setFormattedContent(formattedContent);
    }
  }, [messages]);
  
  const handleInputChange = (event) => {
    const newInput = event.target.value;
    setInput(newInput);
    setButtonHl(newInput.trim() !== ''); // Highlight button if input isn't empty
  };
  const handleSendMessage = async () => {
    if (!input.trim()) return;
 

    let prefixedInput = input.trim().startsWith("blog about")? input.trim(): `blog about ${input.trim()}`;
    setButtonHl(true); // Highlight button when message is being sent
    setFormattedTitle(''); // Reset the previous title
    setMetaDescription(''); // Reset the previous meta description
    setFormattedContent('');
    setCategory('');
    setKeyword('');
    setCategoryBadges('');
    setKeywordBadges('');
    setLastInput(prefixedInput); // Store the last input

    if (categoryBadges.length > 0) {// Append categories and keywords to the input
      const categoriesText = `Categories: ${categoryBadges.join(', ')}`;
      prefixedInput += `\n${categoriesText}`;
    }

    if (keywordBadges.length > 0) {
      const keywordsText = `Keywords: ${keywordBadges.join(', ')}`;
      prefixedInput += `\n${keywordsText}`;
    }

   

    const userMessage = {
      id: Date.now(),
      sender: 'You',
      text: prefixedInput,
    };

    // Clear previous AI messages before adding the new one
    setMessages((prev) => [
      ...prev.filter((msg) => msg.sender !== 'AI'),
      userMessage,
    ]);

    setInput('');
    setButtonHl(false); // Reset button highlight while waiting for AI response
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();

      if (response.ok) {
        const botMessage = {
          id: Date.now() + 1,
          sender: 'AI',
          text: data.response,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          sender: 'AI',
          text: data.error || 'Something went wrong.',
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'AI',
        text: 'An unexpected error occurred.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatBlogContent = (content) => {
    const cleanedContent = content;

 //-------------------------------------------------------------------------------------------------- Title
 const titleMatch = cleanedContent.match(/^##\s*(.*?)\s*$/m);

 let title = titleMatch ? titleMatch[1].trim() : "";
 const formattedTitle = title
   ? `<h1 class="heading1">${title.trim()}</h1>`
   : "";
 // ------------------------------------------------------------------------------------------------ Paragraph
 const introPara = cleanedContent.match(/^([\s\S]*?)(?=\s*\*\*|\n\*\*|$)/);
 
 let BlogPara = introPara ? introPara[1].trim() : "";
  if (title) {
   BlogPara = BlogPara.replace(new RegExp(`##\\s*${title}`, "i"), "").trim(); //i stands for case-insensitive matching.
 }
 
 const formattedParagraph = BlogPara? `<p class="para-text">${BlogPara.replace(/##/g, "").trim()}</p>`: "";
  // // --------------------------------------------------------------------------------------------------------------------------

  let contentWithoutTitleAndParagraph = cleanedContent;

  if (title) {
    contentWithoutTitleAndParagraph = contentWithoutTitleAndParagraph.replace(new RegExp(`^##\\s*${title}\\s*`, "i"),"");
  }
  if (BlogPara) {
    contentWithoutTitleAndParagraph = contentWithoutTitleAndParagraph.replace(new RegExp(BlogPara.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"),"");
  }
  
  contentWithoutTitleAndParagraph = contentWithoutTitleAndParagraph.trim();
 
    //------------------------------------------------------------------------------------------------------------------
    const formattedContent = contentWithoutTitleAndParagraph
    .replace(/-\s\*\*(.*?)\*\*/g, '<li class="list-item-heading">$1</li>')
    .replace(/\*\s\*\*(.*?)\*\*/g, '<li class="list-item-heading">$1</li>')
    .replace(/^(\d+\.)\s\*\*(.*?)\*\*/gm, '<h4 class="heading3">$2</h4>')


      .replace(/\*\*(.*?)\*\*/g, '<h2 class="heading2">$1</h2>') // for **.....
      .replace(/^\s*-\s(.*?)(?=\n|$)/gm, '<li class="list-item">$1</li>')
      .replace(/^- (.*?)(?=\n|$)/gm, '<li class="list-item">$1</li>')
      .replace(/^([*-])\s(.*?)(?=\n|$)/gm, '<li class="list-item">$2</li>') 
      .replace(/^(?!<h1|<h2)(.*?)(?=\n|$)/gm, '<p class="para-text">$1</p>') // Paragraph tag for other content
      .trim();

  
    return {formattedTitle,formattedParagraph,formattedContent};
  };
  function stripHtmlTags(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
  const handleRefreshContent = async () => {
    if (!lastInput) return; 

    let refreshedInput = lastInput;
    if (categoryBadges.length > 0) {
      const categoriesText = `Categories: ${categoryBadges.join(', ')}`;
      refreshedInput += `\n${categoriesText}`;
    }
  
    if (keywordBadges.length > 0) {
      const keywordsText = `Keywords: ${keywordBadges.join(', ')}`;
      refreshedInput += `\n${keywordsText}`;
    }

    setMessages((prev) => prev.filter((msg) => msg.sender !== 'AI'));//remove chat-contents message
    setFormattedTitle('');//clear dashboard inputs
    setMetaDescription('');
    setFormattedContent('');
    setIsTyping(true);
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: refreshedInput }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const botMessage = {
          id: Date.now() + 1,
          sender: 'AI',
          text: data.response,
        };
        setMessages((prev) => [...prev.filter((msg) => msg.sender !== 'AI'), botMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          sender: 'AI',
          text: data.error || 'Something went wrong.',
        };
        setMessages((prev) => [...prev.filter((msg) => msg.sender !== 'AI'), errorMessage]);
      }
    } catch (error) {
      console.error('Error refreshing content:', error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'AI',
        text: 'An unexpected error occurred.',
      };
      setMessages((prev) => [...prev.filter((msg) => msg.sender !== 'AI'), errorMessage]);
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
  // const handleCopyChat = () => {
  //   const chatContent = chatContainerRef.current?.innerText;
  //   if (chatContent) {
  //     navigator.clipboard
  //       .writeText(chatContent)
  //       .then(() => setIsCopied(true))
  //       .catch((err) => console.error('Failed to copy: ', err));
  //   }
  
  //   setCopyHover(false);
  //   setTimeout(() => setIsCopied(false), 2000);
  // }

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

    html2canvas(chatContents).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size
  
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);
    });
  };
  const handleFilterButtonClick = () => {
    setIsDashboardActive((prevState) => !prevState);
  };
  const handleClickOutside = (event) => {
    if (dashboardRef.current && !dashboardRef.current.contains(event.target)) {

      setIsDashboardActive(false);
    }
  };
  return (
     <div className="prfec-ai">
      <div className="prfec-ai-container">
        {/* AI Dashboard Section */}
        <AiDashboard formattedTitle={formattedTitle} setFormattedTitle={setFormattedTitle}
          metaDescription={metaDescription} setMetaDescription={setMetaDescription}
          formattedContent={formattedContent} setFormattedContent={setFormattedContent}
          category={category} setCategory={setCategory} categoryBadges={categoryBadges}
          keyword={keyword} setKeyword={setKeyword} keywordBadges={keywordBadges}
          handleRestructureClick={handleRestructureClick} isDashboardActive={isDashboardActive} dashboardRef={dashboardRef}
          handleCategoryChange={(e) => setCategory(e.target.value)}
          handleCategoryKeyDown={(e) => {
            if (e.key === 'Enter' && category.trim()) {
              setCategoryBadges((prev) => [...prev, category]);
              setCategory('');
            }
          }}
          handleKeywordChange={(e) => setKeyword(e.target.value)}
          handleKeywordKeyDown={(e) => {
            if (e.key === 'Enter' && keyword.trim()) {
              setKeywordBadges((prev) => [...prev, keyword]);
              setKeyword('');
            }
          }}
        />

        <div className='content-gen-space'>

          <div className="chat-space">
            <div className="chat-container" ref={chatContainerRef}>
              <div className='chat-contents'>
                  {messages
                    .filter((msg) => msg.sender === 'AI')
                    .map((msg, index) => {
                      const { formattedTitle, formattedParagraph, formattedContent } = formatBlogContent(msg.text);
                      
                      return (
                        <div key={index}>
                          {formattedTitle && (
                            <h1 className="heading1" dangerouslySetInnerHTML={{ __html: formattedTitle }} />
                          )}
                          {formattedParagraph && (
                            <p className="para-text ai-message" dangerouslySetInnerHTML={{ __html: formattedParagraph }} />
                          )}
                          {formattedContent && (
                            <p className="para-text ai-message" dangerouslySetInnerHTML={{ __html: formattedContent }} />
                          )}
                        </div>
                      );
                    })}

                  {isTyping && (<LoadingSkeleton/>)}

              </div>
            </div>
            <ChatActionButtons isCopied={isCopied} setIsCopied={setIsCopied} handleCopyChat={handleCopyChat} copyHover={copyHover} setCopyHover={setCopyHover}
            handleRefreshContent={handleRefreshContent} formattedContent={formattedContent} formattedTitle={formattedTitle}
            handleDownloadChat={handleDownloadChat} handleFilterButtonClick={handleFilterButtonClick} setIsDashboardActive={setIsDashboardActive}/>
          </div>

        </div>
      </div>

      <ChatInput input={input} setInput={setInput} handleSendMessage={handleSendMessage} 
      buttonHl={buttonHl} setButtonHl={setButtonHl} />

    </div>
  );
}

