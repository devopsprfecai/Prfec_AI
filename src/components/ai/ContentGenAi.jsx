
'use client';
import { useState, useEffect, useRef } from 'react';
import { usePrompt } from '@context/PromptContext';
import '@styles/ai/BetaAi.css'
import AiDashboard from '@components/ai/Dashboard';
import ChatInput from '@components/ai/ChatInput';
import ChatActionButtons from '@components/ai/ChatActionButtons';
import LoadingSkeleton from '@components/ai/LoadingSkeleton';
import Image from 'next/image';
import { Marked } from 'marked';
import html2pdf from "html2pdf.js";
import DashboardRight from './DashboardRight';
import { getDatabase, ref, get } from "firebase/database";
import { getAuth } from "firebase/auth";

export default function PuterChat({currentPath}) {
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

  const chatContainerRef = useRef(null);
  const auth = getAuth();

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
      const formattedHtml = markdown.parse(latestAIMessage.text);
      const { title, description, content } = parseContent(formattedHtml);
      
      setFormattedTitle(title);
      setMetaDescription(description);
      setFormattedContent(content);
    }
  }, [messages]);
  const parseContent = (content) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    const firstHeading = tempDiv.querySelector('h1, h2, h3, h4, h5, h6');
    const title = firstHeading ? firstHeading.innerHTML : '';
    if (firstHeading) firstHeading.remove();

    const firstPara = tempDiv.querySelector('p');
    const description = firstPara ? firstPara.innerHTML : '';
    if (firstPara) firstPara.remove();

    const remainingContent = tempDiv.innerHTML;

    return {
      title,
      description,
      content: remainingContent
    };
  };


  // const handleSendMessage = async () => {
  //   if (!input.trim()) return;
  
  //   if (promptCount >= 100) {
  //     alert('You have reached the daily prompt limit. Please try again tomorrow.');
  //     setLoading(false);
  //     return;
  //   }
  
  //   setPromptCount((prev) => prev + 1);
  //   let prefixedInput = input.trim().startsWith("blog about") ? input.trim() : `blog about ${input.trim()}`;
  
  //   setButtonHl(true);
  //   setFormattedTitle('');
  //   setMetaDescription('');
  //   setFormattedContent('');
  //   setCategory('');
  //   setKeyword('');
  //   setCategoryBadges([]);
  //   setKeywordBadges([]);
  //   setLastInput(prefixedInput);
  
  //   if (categoryBadges.length > 0) {
  //     const categoriesText = `Categories: ${categoryBadges.join(', ')}`;
  //     prefixedInput += `\n${categoriesText}`;
  //   }
  
  //   if (keywordBadges.length > 0) {
  //     const keywordsText = `Keywords: ${keywordBadges.join(', ')}`;
  //     prefixedInput += `\n${keywordsText}`;
  //   }
  
  //   const userMessage = {
  //     id: Date.now(),
  //     sender: 'You',
  //     text: prefixedInput,
  //   };
  
  //   setMessages([userMessage]); // ✅ Only store the latest user message
  
  //   setInput('');
  //   setButtonHl(false);
  //   setIsTyping(true);
  
  //   try {
  //     const response = await fetch('/api/chat', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ message: userMessage.text }),
  //     });
  
  //     const data = await response.json();
  
  //     if (response.ok) {
  //       const botMessage = {
  //         id: Date.now() + 1,
  //         sender: 'AI',
  //         text: data.response,
  //       };
  //       setMessages([userMessage, botMessage]); // ✅ Only keep the latest user & AI messages
  //     } else {
  //       const errorMessage = {
  //         id: Date.now() + 1,
  //         sender: 'AI',
  //         text: data.error || 'Something went wrong.',
  //       };
  //       setMessages([userMessage, errorMessage]);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching chat:', error);
  //     setMessages([
  //       userMessage,
  //       { id: Date.now() + 1, sender: 'AI', text: 'An unexpected error occurred.' },
  //     ]);
  //   } finally {
  //     setIsTyping(false);
  //   }
  // };
  const handleSendMessage = async () => {
    if (!input.trim()) return;
  
    setLoading(true);
  
    try {
      // Fetch planType from Firebase
      const user= auth.currentUser;

      const userId = user.uid;  
         const db = getDatabase();
      const planRef = ref(db, `subscriptions/${userId}/planType`);
      const snapshot = await get(planRef);
  
      let planType = snapshot.exists() ? snapshot.val() : null;
      let maxPrompts = 3; // Default limit
  
      if (planType === "starter") {
        maxPrompts = 50;
      } else if (planType === "pro") {
        maxPrompts = 150;
      }
  
      if (promptCount >= maxPrompts) {
        alert(`You have reached your daily prompt limit of ${maxPrompts}. Please try again tomorrow.`);
        setLoading(false);
        return;
      }
  
      // Increment prompt count
      setPromptCount((prev) => prev + 1);
  
      let prefixedInput = input.trim().startsWith("blog about") ? input.trim() : `blog about ${input.trim()}`;
  
      setButtonHl(true);
      setFormattedTitle('');
      setMetaDescription('');
      setFormattedContent('');
      setCategory('');
      setKeyword('');
      setCategoryBadges([]);
      setKeywordBadges([]);
      setLastInput(prefixedInput);
  
      if (categoryBadges.length > 0) {
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
  
      setMessages([userMessage]); // ✅ Only store the latest user message
      setInput('');
      setButtonHl(false);
      setIsTyping(true);
  
      // Send the message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const botMessage = {
          id: Date.now() + 1,
          sender: 'AI',
          text: data.response,
        };
        setMessages([userMessage, botMessage]); // ✅ Keep only the latest messages
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          sender: 'AI',
          text: data.error || 'Something went wrong.',
        };
        setMessages([userMessage, errorMessage]);
      }
    } catch (error) {
      console.error('Error fetching planType or sending chat:', error);
      setMessages([
        { id: Date.now(), sender: 'You', text: input.trim() },
        { id: Date.now() + 1, sender: 'AI', text: 'An unexpected error occurred.' },
      ]);
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
  return (
    <>

     <div className="prfec-ai">
      <div className="prfec-ai-container">
        <AiDashboard currentPath={currentPath} />

        <div className='content-gen-space'>

          <div className="chat-space">
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

          <ChatInput input={input} setInput={setInput} handleSendMessage={handleSendMessage} 
      buttonHl={buttonHl} setButtonHl={setButtonHl} promptCount={promptCount} isTyping={isTyping}/>


        </div>
        <DashboardRight formattedTitle={formattedTitle} setFormattedTitle={setFormattedTitle}
          metaDescription={metaDescription} setMetaDescription={setMetaDescription}
          formattedContent={formattedContent} setFormattedContent={setFormattedContent}
          handleRestructureClick={handleRestructureClick}    
          category={category} setCategory={setCategory} categoryBadges={categoryBadges}
          keyword={keyword} setKeyword={setKeyword} keywordBadges={keywordBadges}
         isDashboardActive={isDashboardActive} dashboardRef={dashboardRef}
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
          }} />
      </div>



    </div>
    </>
  );
}

