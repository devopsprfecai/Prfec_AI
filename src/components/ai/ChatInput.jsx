
// 'use client';
// import '@styles/ai/BetaAi.css';
// import Image from 'next/image';
// import prfecBtn from '@public/Images/ai/prfec button.svg';
// import { useState, useEffect } from 'react';
// import { getDatabase, ref, get, onValue, off } from "firebase/database";
// import { getAuth } from "firebase/auth";
// import { UserAuth } from '@context/AuthContext';

// export default function ChatInput({   input, setInput, handleSendMessage, buttonHl, setButtonHl, 
//   promptCount, setPromptCount, isTyping }) {
//   const [planType, setPlanType] = useState(null);
//   const [planCount, setPlanCount] = useState(3);
//     const [popupOpen, setPopupOpen] = useState(false);

//   const { user } = UserAuth(); // Get user from AuthContext
//   const userId = user?.uid; // Get user ID safely
//   const database = getDatabase();


  
  
//   useEffect(() => {
//     if (!userId) return;

//     const fetchPlanType = async () => {
//       try {
//         const planRef = ref(database, `/subscriptions/${userId}/planType`);
//         const snapshot = await get(planRef);
//         if (snapshot.exists()) {
//           setPlanType(snapshot.val());
//         } 
//         // else {
//         //   console.log("No planType found");
//         // }
//       } catch (error) {
//         console.error("Error fetching planType:", error);
//       }
//     };

//     fetchPlanType();
//   }, [userId]);

//   // Map plan types to allowed prompts
//   useEffect(() => {
//     if (planType === 'starter') {
//       setPlanCount(50);
//     } else if (planType === 'pro') {
//       setPlanCount(150);
//     } else {
//       setPlanCount(3); // Default value
//     }
//   }, [planType]);

//   // Handle input change (Fixing the missing function)
//   const handleInputChange = (event) => {
//     const newInput = event.target.value;
//     setInput(newInput);
//     setButtonHl(newInput.trim() !== ''); // Highlight button if input isn't empty
//   };

//   // Calculate remaining prompts
//   const promptLeft = planCount - promptCount;
//   if(promptLeft===0){
//     setPopupOpen(!popupOpen)
//   }
//   useEffect(() => {
//     if (promptLeft === 0) {
//       setPopupOpen(true);
//     }
//   }, [promptLeft]);
//   return (
//     <div className="chat-input">
//       {!popupOpen && <div className='chat-input-upgrade'>
//         <p>There are currently no prompts left; they will reset after 24 hours.</p>
//         <button>upgrade</button>
//         <span onClick={setPopupOpen(!popupOpen)}>X</span>
//       </div>}
//        {/* <div className="chat-input-container">


//         <input type="text" value={input} onChange={handleInputChange} onKeyDown={(e) => e.key === 'Enter' } placeholder="Type your message..."/>
//         <div className={`chat-input-generate-button ${isTyping ? "loading" : ""}`} style={{ backgroundColor: buttonHl ? '#414abb' : '#515bda' }} >
//            <p>Generate</p>
//            <Image src={prfecBtn} alt="prfec" />
//         </div>

//       </div> */}
//        <div className="chat-input-container">
//          <input 
//           type="text" 
//           value={input} 
//           onChange={handleInputChange} 
//           onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
//           placeholder="Type your message..."
//         />
//         <div 
//           className={`chat-input-generate-button ${isTyping ? "loading" : ""}`} 
//           style={{ backgroundColor: buttonHl ? '#414abb' : '#515bda' }}
//         >
//           <p>Generate</p>
//           <Image src={prfecBtn} alt="prfec" />
//         </div>
//       </div>
//       {/* Display Remaining Prompts */}
//       <p className="chat-input-prompt-info">Remaining Prompts: {promptLeft}/{planCount} </p>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { getDatabase, ref, get } from "firebase/database";
import { UserAuth } from '@context/AuthContext';
import Image from 'next/image';
import prfecBtn from '@public/Images/ai/prfec button.svg';
import { RiCloseFill } from "react-icons/ri";
import Link from 'next/link';

export default function ChatInput({ input, setInput, handleSendMessage, buttonHl, setButtonHl, promptCount, setPromptCount, isTyping }) {
  const [planType, setPlanType] = useState(null);
  const [planCount, setPlanCount] = useState(3);
  const [popupOpen, setPopupOpen] = useState(false);

  const { user } = UserAuth();
  const userId = user?.uid;
  const database = getDatabase();

  useEffect(() => {
    if (!userId) return;
    
    const fetchPlanType = async () => {
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
  }, [userId,database]);

  useEffect(() => {
    if (planType === 'starter') {
      setPlanCount(50);
    } else if (planType === 'pro') {
      setPlanCount(150);
    } else {
      setPlanCount(3);
    }
  }, [planType]);

  const handleInputChange = (event) => {
    setInput(event.target.value);
    setButtonHl(event.target.value.trim() !== '');
  };

  // ✅ Define promptLeft before useEffect
  const promptLeft = planCount - promptCount;

  // ✅ Prevent infinite loop by setting only if promptLeft === 0
  useEffect(() => {
    if (promptLeft === 0) {
      setPopupOpen(true); // Set to true, not toggle
    }
  }, [promptLeft]); 

  return (
    <div className="chat-input">
      {popupOpen && (
        <div className='chat-input-upgrade'>
          <div className='chat-input-upgrade-container'>
          <p>There are currently no prompts left. Prompts will reset after 24 hours.</p>
          <Link href='/pricing' ><button>Upgrade</button></Link>
          <RiCloseFill className='chat-input-upgrade-close'  onClick={() => setPopupOpen(false)} style={{color:"var(--p-color)"}}/>
          </div>
        </div>
       )} 

      <div className="chat-input-container">
        <input 
          type="text" 
          value={input} 
          onChange={handleInputChange} 
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
          placeholder="Type your message..."
        />
        <div 
          className={`chat-input-generate-button ${isTyping ? "loading" : ""}`} 
          style={{ backgroundColor: buttonHl ? '#414abb' : '#515bda',height:"100%" }}
          onClick={handleSendMessage}
        >
          <p>Generate</p>
          <Image src={prfecBtn} alt="prfec" />
        </div>
      </div>

      <p className="chat-input-prompt-info">Remaining Prompts: {promptLeft}/{planCount}</p>
    </div>
  );
}



// 'use client';
// import '@styles/ai/BetaAi.css';
// import Image from 'next/image';
// import prfecBtn from '@public/Images/ai/prfec button.svg';
// import { useState, useEffect } from 'react';
// import { getDatabase, ref, get } from "firebase/database";
// import { getAuth } from "firebase/auth";
// import { UserAuth } from '@context/AuthContext';

// export default function ChatInput({ input, setInput, handleSendMessage, buttonHl, setButtonHl, promptCount, isTyping }) {
//   const [planType, setPlanType] = useState(null);
//   const [planCount, setPlanCount] = useState(3);
//   const [popupOpen, setPopupOpen] = useState(false);
//   const { user } = UserAuth(); // Get user from AuthContext
//   const userId = user?.uid; // Get user ID safely
//   const database = getDatabase();

//   useEffect(() => {
//     if (!userId) return;

//     const fetchPlanType = async () => {
//       try {
//         const planRef = ref(database, `/subscriptions/${userId}/planType`);
//         const snapshot = await get(planRef);
//         if (snapshot.exists()) {
//           setPlanType(snapshot.val());
//         } else {
//           console.log("No planType found");
//         }
//       } catch (error) {
//         console.error("Error fetching planType:", error);
//       }
//     };

//     fetchPlanType();
//   }, [userId]);

//   // Map plan types to allowed prompts
//   useEffect(() => {
//     if (planType === 'starter') {
//       setPlanCount(50);
//     } else if (planType === 'pro') {
//       setPlanCount(150);
//     } else {
//       setPlanCount(3); // Default value
//     }
//   }, [planType]);

//   // Handle input change
//   const handleInputChange = (event) => {
//     const newInput = event.target.value;
//     setInput(newInput);
//     setButtonHl(newInput.trim() !== ''); // Highlight button if input isn't empty
//   };

//   // Calculate remaining prompts
//   const promptLeft = planCount - promptCount;

//   // Open popup if no prompts are left
//   useEffect(() => {
//     if (promptLeft === 0) {
//       setPopupOpen(true);
//     }
//   }, [promptLeft]);

//   return (
//     <div className="chat-input">
//       {popupOpen && (
//         <div className='chat-input-upgrade'>
//           <p>There are currently no prompts left; they will reset after 24 hours.</p>
//           <button>Upgrade</button>
//           <span onClick={() => setPopupOpen(false)}>X</span>
//         </div>
//       )}
//       <div className="chat-input-container">
//         <input 
//           type="text" 
//           value={input} 
//           onChange={handleInputChange} 
//           onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
//           placeholder="Type your message..."
//         />
//         <div 
//           className={`chat-input-generate-button ${isTyping ? "loading" : ""}`} 
//           style={{ backgroundColor: buttonHl ? '#414abb' : '#515bda' }}
//         >
//           <p>Generate</p>
//           <Image src={prfecBtn} alt="prfec" />
//         </div>
//       </div>
//       {/* Display Remaining Prompts */}
//       <p className="chat-input-prompt-info">Remaining Prompts: {promptLeft}/{planCount}</p>
//     </div>
//   );
// }
