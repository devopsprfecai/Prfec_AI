'use client';
import { useState, useEffect, useRef } from 'react';
import '@styles/ai/BetaAi.css'
import Image from 'next/image';
import Hover from '@public/Images/ai/hover.svg';
import NoHover from '@public/Images/ai/nohover.svg';
import copy from '@public/Images/ai/copy.svg';
import refresh from '@public/Images/ai/refresh.svg';
import refresh2 from '@public/Images/ai/refresh-dash.svg';
import download from '@public/Images/ai/download.svg';
import prfecBtn from '@public/Images/ai/prfec button.svg';
import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
import { Marked } from 'marked';

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

  // useEffect(() => {
  //   const latestAIMessage = messages.find((msg) => msg.sender === 'AI');
  //   if (latestAIMessage) {
  //     const { formattedTitle, formattedParagraph, formattedContent } = formatBlogContent(latestAIMessage.text);
  //     setFormattedTitle(formattedTitle);
  //     setMetaDescription(formattedParagraph); // Assuming paragraph as meta description
  //     setFormattedContent(formattedContent);
  //   }
  // }, [messages]);

  useEffect(() => {
    const latestAIMessage = messages.find((msg) => msg.sender === 'AI');
    if (latestAIMessage) {
      const formattedHtml = Marked(latestAIMessage.text);
      setFormattedContent(formattedHtml);
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

//   const formatBlogContent = (content) => {
//     const cleanedContent = content;

//  //-------------------------------------------------------------------------------------------------- Title
//  const titleMatch = cleanedContent.match(/^##\s*(.*?)\s*$/m);

//  let title = titleMatch ? titleMatch[1].trim() : "";
//  const formattedTitle = title
//    ? `<h1 class="heading1">${title.trim()}</h1>`
//    : "";
//  // ------------------------------------------------------------------------------------------------ Paragraph
//  const introPara = cleanedContent.match(/^([\s\S]*?)(?=\s*\*\*|\n\*\*|$)/);
 
//  let BlogPara = introPara ? introPara[1].trim() : "";
//   if (title) {
//    BlogPara = BlogPara.replace(new RegExp(`##\\s*${title}`, "i"), "").trim(); //i stands for case-insensitive matching.
//  }
 
//  const formattedParagraph = BlogPara? `<p class="para-text">${BlogPara.replace(/##/g, "").trim()}</p>`: "";
//   // // --------------------------------------------------------------------------------------------------------------------------

//   let contentWithoutTitleAndParagraph = cleanedContent;

//   if (title) {
//     contentWithoutTitleAndParagraph = contentWithoutTitleAndParagraph.replace(new RegExp(`^##\\s*${title}\\s*`, "i"),"");
//   }
//   if (BlogPara) {
//     contentWithoutTitleAndParagraph = contentWithoutTitleAndParagraph.replace(new RegExp(BlogPara.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"),"");
//   }
  
//   contentWithoutTitleAndParagraph = contentWithoutTitleAndParagraph.trim();
 
//     //------------------------------------------------------------------------------------------------------------------
//     const formattedContent = contentWithoutTitleAndParagraph
//     .replace(/-\s\*\*(.*?)\*\*/g, '<li class="list-item-heading">$1</li>')
//     .replace(/\*\s\*\*(.*?)\*\*/g, '<li class="list-item-heading">$1</li>')
//     .replace(/^(\d+\.)\s\*\*(.*?)\*\*/gm, '<h4 class="heading3">$2</h4>')


//       .replace(/\*\*(.*?)\*\*/g, '<h2 class="heading2">$1</h2>') // for **.....
//       .replace(/^\s*-\s(.*?)(?=\n|$)/gm, '<li class="list-item">$1</li>')
//       .replace(/^- (.*?)(?=\n|$)/gm, '<li class="list-item">$1</li>')
//       .replace(/^([*-])\s(.*?)(?=\n|$)/gm, '<li class="list-item">$2</li>') 
//       .replace(/^(?!<h1|<h2)(.*?)(?=\n|$)/gm, '<p class="para-text">$1</p>') // Paragraph tag for other content
//       .trim();

  
//     return {formattedTitle,formattedParagraph,formattedContent};
//   };
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
              console.log("UPDATEd",updatedText);
              console.log("Not",formattedTitle);

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

  function stripHtmlTags(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleCategoryKeyDown = (event) => {
    if (event.key === 'Enter' && category.trim()) {
      setCategoryBadges((prev) => [...prev, category]);
      setCategory('');
    }
  };

  const handleKeywordKeyDown = (event) => {
    if (event.key === 'Enter' && keyword.trim()) {
      setKeywordBadges((prev) => [...prev, keyword]);
      setKeyword('');
    }
  };
  return (
     <div className="prfec-ai">
      <div className="prfec-ai-container">
        {/* AI Dashboard Section */}
        <div className="ai-dashboard">
          <div className="ai-dashboard-container">
            <h1 className='ai-chat-heading'>AI Content Generation</h1>
            <div className="ai-dashboard-contents">
            <div className="ai-dashboard-title">
                <label htmlFor="ai-title" className='dashboard-label'>Title</label>  
                <div className='ai-dashboard-title-input'>
                  <input type="text" id="ai-title" value={stripHtmlTags(formattedTitle)} readOnly />
                  <div className="refresh-title-button" onClick={() => handleRestructureClick('title')}>
                    <Image src={refresh2} height={12} alt='refresh'/>
                  </div>
                </div>
              </div>
              <div className="ai-dashboard-description">
                <label htmlFor="ai-description" className='dashboard-label'>Meta description</label>
                <div className='ai-dashboard-title-input'>
                  <input type="text" id="ai-description"  value={stripHtmlTags(metaDescription)} readOnly/>
                  <div className="refresh-description-button" onClick={() => handleRestructureClick('description')}>
                    <Image src={refresh2} height={12} alt='refresh'/>
                  </div>
                </div>
              </div>

              <div className="ai-dashboard-body">
                <label htmlFor="" className='dashboard-label'>Body</label>
                <div className='ai-dashboard-title-input'>
                  <input type="text" id="ai-content" value={stripHtmlTags(formattedContent)} readOnly  />
                  <div className="refresh-body-button">
                    <Image src={refresh2} height={12} alt='refresh'/>
                  </div>
                </div>
              </div>
              <div className="ai-dashboard-category">
                <label htmlFor="category" className='dashboard-label'>Category</label>
                <div className='ai-dashboard-title-input'>
                  <input type="text" id="category" value={category} onChange={handleCategoryChange} onKeyDown={handleCategoryKeyDown}/>
                </div>
                {categoryBadges &&
                <div className="badges-container">
                  {categoryBadges.map((badge, index) => (
                    <span key={index} className="badge"> {badge} </span>
                  ))}
                </div>}
              </div>
              <div className="ai-dashboard-category">
                <label htmlFor="keyword" className='dashboard-label'>Keyword</label>
                <div className='ai-dashboard-title-input'>
                  <input type="text" id="keyword" value={keyword} onChange={handleKeywordChange} onKeyDown={handleKeywordKeyDown}/>
                </div>
                {keywordBadges && <div className="badges-container">
                  {keywordBadges.map((badge, index) => (
                    <span key={index} className="badge"> {badge} </span>
                  ))}
                </div>}
              </div>
            </div>
          </div>
        </div>

        <div className='content-gen-space'>

          <div className="chat-space">
            <div className="chat-container">
              <div className='chat-contents'>
                  {messages
                    .filter((msg) => msg.sender === 'AI')
                    .map((msg, index) => {
                      const { formattedTitle, formattedParagraph, formattedContent } = Marked(msg.text);
                      
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

                  {isTyping && (
                    <div className="loading-skeleton ai-message">
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line"></div>
                    </div>
                  )}

              </div>
            </div>
            <div className="chat-action-buttons">
              <div className="copy-chat-button">
                <Image src={copy}  height={14} alt='copy'/>
                <div className="chat-button-label">
                  {isCopied && (
                    <div className="chat-button-label-copied">Copied</div>
                  )}
                </div>
              </div>
              <div className="download-chat-button">
                <Image src={download} height={14} alt='download'/>
              </div>
              <div className="refresh-chat-button" onClick={handleRefreshContent}>
                <Image src={refresh} height={13} alt='refresh'/>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="chat-input">
          <div className="chat-input-container">
            <input type="text" value={input} placeholder="Type your message..." onChange={handleInputChange} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}/>
            <div className='chat-input-generate-button' style={{ backgroundColor: buttonHl ?  '#414abb' : '#515bda'  }} onClick={handleSendMessage}>
              <p>Generate</p>
              <Image src={prfecBtn} alt='prfec'/>
            </div>
          </div>
          </div>
    </div>
  );
}

