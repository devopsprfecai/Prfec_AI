// 'use client'
// import React, { useEffect, useState } from 'react';
// import { getDatabase, ref, onValue } from 'firebase/database';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import '@styles/trafy-chat-ai/ChatDashboard.css';
// import Image from 'next/image';
// import logo from '@public/assets/images/navbar/trafy-black-logo.png';
// import newChat from '@public/assets/images/dashboard/new-chat.svg';
// import arrow from '@public/assets/images/dashboard/arrow.svg';

// const INITIAL_VISIBLE_CHATS = 8; 

// const ChatDashboardMobile = ({ menuOpen, setMenuOpen }) => {
//   const [recentChats, setRecentChats] = useState([]);
//   const [visibleChats, setVisibleChats] = useState(INITIAL_VISIBLE_CHATS);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userEmail, setUserEmail] = useState('');
//   const pathname = usePathname();
//   const currentChatId = pathname.split('/').pop();

//   useEffect(() => {
//     const auth = getAuth();

//     // Listen for authentication state changes
//     onAuthStateChanged(auth, (user) => {
//       if (user && user.email) {
//         setUserEmail(user.email);
//       } else {
//         setUserEmail('');
//       }
//     });

//     if (!auth.currentUser) {
//       setError("User not authenticated");
//       setLoading(false);
//       return;
//     }

//     const database = getDatabase();
//     const chatRef = ref(database, `chats/${auth.currentUser.uid}`);

//     onValue(chatRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const chatData = snapshot.val();
//         const chatsArray = Object.entries(chatData).map(([id, chat]) => ({
//           id,
//           title: chat.title || "Untitled Chat",
//           lastUpdated: chat.lastUpdated || 0,
//         }));

//         // Sort chats by lastUpdated timestamp (most recent first)
//         chatsArray.sort((a, b) => b.lastUpdated - a.lastUpdated);
        
//         setRecentChats(chatsArray);
//       } else {
//         setRecentChats([]);
//       }
//       setLoading(false);
//     }, (error) => {
//       setError("Failed to load chats");
//       setLoading(false);
//     });
//   }, []);

//   const showMoreChats = () => {
//     setVisibleChats(prev => prev + INITIAL_VISIBLE_CHATS);
//   };

//   return (
//     <div className="chat-dashboard">
//       <div className="chat-dashboard-container">
//         <div className='chat-dashboard-logo'>
//             <Image src={logo} alt='trafy logo' />
//             {menuOpen && <p onClick={() => setMenuOpen(false)}>close</p>}
//             </div>
//         <div className="chat-dashboard-new-chat">
//           <Link href='/'>
//           <Image src={newChat} width={16} height={16} alt='new chat'/>
//           New Chat</Link>
//         </div>
//         {recentChats.length > 0 && (
//           <div className="chat-dashboard-recents">
//             <h3>Recent Chats</h3>
//             <div className='chat-dashboard-recents-contents'>
//               {recentChats.slice(0, visibleChats).map(chat => (
//                 <Link 
//                   key={chat.id} 
//                   href={`/chat/${chat.id}`} 
//                   className={`chat-link ${chat.id === currentChatId ? "active" : ""}`}
//                 >
//                   {chat.title}
//                 </Link>
//               ))}
//             </div>
//             {visibleChats < recentChats.length && (
//               <div className="char-dashboard-view-more-btn" onClick={showMoreChats}>
//                 <Image src={arrow} width={16} height={16} alt='view more'/>
//                 View More
//               </div>
//             )}
//           </div>
//         )}
//         {/* User Account Section */}
//         <div className="chat-dashboard-account">
//           <div className='chat-dashboard-account-container'>
//             <div className='chat-dashboard-account-contents'>
//               {/* Display First Letter of Email */}
//               <div className='chat-dashboard-account-profile'>
//                 {userEmail ? userEmail.charAt(0).toUpperCase() : "?"}
//               </div>
//               {/* Display Full Email */}
//               <div className='chat-dashboard-account-email'>
//                 {userEmail || "Not Logged In"}
//               </div>
              
//             </div>  
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatDashboardMobile;
