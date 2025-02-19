// 'use client';
// import '@styles/ai/BetaAi.css'
// import Image from 'next/image';
// import Hover from '@public/Images/ai/hover.svg';
// import NoHover from '@public/Images/ai/nohover.svg';
// import prfecBtn from '@public/Images/ai/prfec button.svg';

// export default function ChatInput({ input, setInput, handleSendMessage, buttonHl, setButtonHl }) {
//     const handleInputChange = (event) => {
//       const newInput = event.target.value;
//       setInput(newInput);
//       setButtonHl(newInput.trim() !== ''); // Highlight button if input isn't empty
//     };
//   return (
//     <div className="chat-input">
//     <div className="chat-input-container">
//       <input
//         type="text"
//         value={input}
//         onChange={handleInputChange}
//         onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
//         placeholder="Type your message..."
//       />
//       <div className='chat-input-generate-button' onClick={handleSendMessage} style={{ backgroundColor: buttonHl ?  '#414abb' : '#515bda'  }}>
//         <p>Generate</p>
//         <Image src={prfecBtn} alt='prfec'/>
//       </div>
//       <div className='chat-input-mobile-button' >
//         <Image  width={24} height={24} src={buttonHl ? Hover : NoHover}  alt="Button Icon" onClick={handleSendMessage}/>
//       </div>
//     </div>
// </div>
//   )
// }

'use client';
import '@styles/ai/BetaAi.css';
import Image from 'next/image';
import Hover from '@public/Images/ai/hover.svg';
import NoHover from '@public/Images/ai/nohover.svg';
import prfecBtn from '@public/Images/ai/prfec button.svg';
import close from '@public/Images/navbar/close.png';
import { useState } from 'react';

export default function ChatInput({ input, setInput, handleSendMessage, buttonHl, setButtonHl, promptCount, isTyping }) {
  const [limitReached, setLimitReached] = useState(false); // State for limit message
  const handleInputChange = (event) => {
    const newInput = event.target.value;
    setInput(newInput);
    setButtonHl(newInput.trim() !== ''); // Highlight button if input isn't empty
  };

  const handleClick = () => {
    if (promptCount >= 100) {
      setLimitReached(true);
    } else {
      setLimitReached(false);
      handleSendMessage();
    }
  };

  const handleCloseLimitMessage = () => {
    setLimitReached(false);
  };

  return (
    <div className="chat-input">
      <div className="chat-input-container">
        {/* Limit Reached Message */}
        {limitReached && (
          <div className="limit-reached-message">
            <p>You have reached the daily limit of 3 prompts. Please try again tomorrow.</p>
            <Image src={close} alt="Close" height={14} width={14} className="close-icon" onClick={handleCloseLimitMessage} style={{ cursor: 'pointer' }}/>
          </div>
        )}
        <input type="text" value={input} onChange={handleInputChange} onKeyDown={(e) => e.key === 'Enter' && handleClick()} placeholder="Type your message..."/>
        <div className={`chat-input-generate-button ${isTyping ? "loading" : ""}`}onClick={handleClick} style={{ backgroundColor: buttonHl ? '#414abb' : '#515bda' }} >
          <p>Generate</p>
          {/* <Image src={prfecBtn} alt="prfec" /> */}
        </div>
        {/* <div className="chat-input-mobile-button">
          <Image width={24} height={24} src={buttonHl ? Hover : NoHover} alt="Button Icon"  onClick={handleClick} />
        </div> */}
      </div>
    </div>
  );
}
