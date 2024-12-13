'use client';
import '@styles/ai/BetaAi.css'
import Image from 'next/image';
import Hover from '@public/Images/ai/hover.svg';
import NoHover from '@public/Images/ai/nohover.svg';
import prfecBtn from '@public/Images/ai/prfec button.svg';

export default function ChatInput({ input, setInput, handleSendMessage, buttonHl, setButtonHl }) {
    const handleInputChange = (event) => {
      const newInput = event.target.value;
      setInput(newInput);
      setButtonHl(newInput.trim() !== ''); // Highlight button if input isn't empty
    };
  return (
    <div className="chat-input">
    <div className="chat-input-container">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        placeholder="Type your message..."
      />
      <div className='chat-input-generate-button' onClick={handleSendMessage} style={{ backgroundColor: buttonHl ?  '#414abb' : '#515bda'  }}>
        <p>Generate</p>
        <Image src={prfecBtn} alt='prfec'/>
      </div>
      <div className='chat-input-mobile-button' >
        <Image  width={24} height={24} src={buttonHl ? Hover : NoHover}  alt="Button Icon" onClick={handleSendMessage}/>
      </div>
    </div>
</div>
  )
}

