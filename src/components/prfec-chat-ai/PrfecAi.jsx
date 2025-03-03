// import React from 'react'
// import ChatDashboard from './ai/ChatDashboard'
// import Chatbot from './ai/ChatAi'
// const PrfecAi = () => {
//   return (
//     <div style={{display:"flex"}}>
//         <ChatDashboard/>
//         <Chatbot/>
//     </div>
//   )
// }

// export default PrfecAi

// 'use client';
// import React, { useState, useEffect } from 'react';
// // import ChatDashboard from './ai/ChatDashboard';
// import Chatbot from './ai/ChatAi';
// import AiDashboard from '@components/ai/Dashboard';
// import Image from 'next/image';
// import { RiMenu4Fill } from "react-icons/ri";
// import '@styles/prfec-chat-ai/ChatAi.css';
// const PrfecAi = ({chatId}) => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   // useEffect(() => {
//   //   const adjustHeight = () => {
//   //     const viewportHeight = window.innerHeight;
//   //     document.querySelector('.prfec-ai-component').style.height = `${viewportHeight}px`;
//   //   };
  
//   //   adjustHeight();
//   //   window.addEventListener('resize', adjustHeight);
  
//   //   return () => window.removeEventListener('resize', adjustHeight);
//   // }, []);
  
//   useEffect(() => {
//     const adjustHeight = () => {
//       const viewportHeight = window.innerHeight;
//       const viewportWidth = window.innerWidth;
      
//       if (viewportWidth <= 600) {
//         document.querySelector('.prfec-ai-component').style.height = `${viewportHeight}px`;
//       } else {
//         document.querySelector('.prfec-ai-component').style.height = 'auto'; // Reset height for larger screens
//       }
//     };
  
//     adjustHeight();
//     window.addEventListener('resize', adjustHeight);
  
//     return () => window.removeEventListener('resize', adjustHeight);
//   }, []);
  

//   const handleMenuOpen = () =>{
//     setMenuOpen(!menuOpen);
//     console.log("yess")
//   }


//   return (
//     <div className='prfec-ai-component' >
//       {/* <div className='prfec-chat-dashboard-desktop'> */}
//         {/* <ChatDashboard menuOpen={menuOpen} setMenuOpen={setMenuOpen}/> */}
//        <AiDashboard/>
//         {/* </div> */}
//       <div className='prfec-chat-dashboard-hamburger'>
//         <RiMenu4Fill className='prfec-chat-dashboard-menu-icon' onClick={handleMenuOpen} style={{color:"var(--p-color)"}} />
//         {menuOpen && <div className='prfec-chat-dashboard-mobile'><AiDashboard menuOpen={menuOpen} setMenuOpen={setMenuOpen}/></div>}

//       </div>
//       <Chatbot chatId={chatId} />
//     </div>
//   );
// };

// export default PrfecAi;


'use client';
import React, { useState, useEffect } from 'react';
import Chatbot from './ai/ChatAi';
import AiDashboard from '@components/ai/Dashboard';
import { RiMenu4Fill } from "react-icons/ri";
import '@styles/prfec-chat-ai/ChatAi.css';
import { CgProfile } from "react-icons/cg";
import Link from 'next/link';
const PrfecAi = ({ chatId }) => {
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
        document.querySelector('.prfec-ai-component').style.height = `${viewportHeight}px`;
      } else {
        document.querySelector('.prfec-ai-component').style.height = 'auto';
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
    <div className='prfec-ai-component'>
      {/* Show AiDashboard only for desktop (width > 800px) */}
      {isDesktop && <AiDashboard />}
      {/* {!isDesktop &&
      <div className='prfec-chat-dashboard-hamburger' style={{display:"flex" ,justifyContent:"space-between"}}>
        <RiMenu4Fill
          className='prfec-chat-dashboard-menu-icon'
          onClick={handleMenuOpen}
          style={{ color: "var(--p-color)" }}
        />
                  <Link href='/settings/profile'> <CgProfile  style={{color:"var(--dashboard-h-color)",width:"22px",height:"22px"}}/></Link> 


        {!isDesktop && menuOpen && (
          <div className='prfec-chat-dashboard-mobile'>
            <AiDashboard menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          </div>
        )}
      </div>} */}

      <Chatbot chatId={chatId} />
    </div>
  );
};

export default PrfecAi;

