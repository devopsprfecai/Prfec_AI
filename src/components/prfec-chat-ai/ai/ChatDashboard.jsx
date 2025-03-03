
// 'use client'
// import React, { useEffect, useState } from 'react';
// import { getDatabase, ref, onValue } from 'firebase/database';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useTheme } from 'next-themes';
// import '@styles/trafy-chat-ai/ChatDashboard.css';
// import Image from 'next/image';
// import blackLogo from '@public/assets/images/navbar/trafy-black-logo.png';
// import whiteLogo from '@public/assets/images/navbar/trafy-white-logo.png';

// import newChat from '@public/assets/images/dashboard/new-chat.svg';
// import arrow from '@public/assets/images/dashboard/arrow.svg';
// import { MdClose } from "react-icons/md";
// import { IoIosArrowDown } from "react-icons/io";
// import { UserAuth } from '@context/AuthContext';
// import { PiChatCircleDotsLight } from "react-icons/pi";

// const INITIAL_VISIBLE_CHATS = 8;

// const ChatDashboard = ({ menuOpen, setMenuOpen }) => {
//   const [recentChats, setRecentChats] = useState([]);
//   const [visibleChats, setVisibleChats] = useState(INITIAL_VISIBLE_CHATS);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userEmail, setUserEmail] = useState('');
//   const pathname = usePathname();
//   const currentChatId = pathname.split('/').pop();
//   const [openSetting, setOpenSetting] = useState(false);
//   const { logOut } = UserAuth();
//   const { theme, setTheme, systemTheme } = useTheme();

//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Ensure it doesn't render on the server to avoid hydration issues
  
//   useEffect(() => {
//     const auth = getAuth();
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

//   const toggleTheme = () => {
//     const currentTheme = theme === 'system' ? systemTheme : theme;
//     setTheme(currentTheme === 'dark' ? 'light' : 'dark');
//   };
//   if (!mounted) return null;


//   const logo = theme === 'dark' ? whiteLogo : blackLogo;

//   return (
//     <div className="chat-dashboard">
//       <div className="chat-dashboard-container">
//         <div className='chat-dashboard-logo'>
//             <Image src={logo} alt='trafy logo' />
//             {menuOpen && <MdClose onClick={() => setMenuOpen(false)} style={{fontSize:"20px",color:"var(--trafy-gray)"}}/>}
//         </div>
//         <div className="chat-dashboard-new-chat">
//           <Link href='/'>
//             <PiChatCircleDotsLight style={{fontSize:"16px",color:"var(--p-color-)"}}/>
//             New Chat
//           </Link>
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
//               <div className="char-dashboard-view-more-btn" onClick={() => setVisibleChats(prev => prev + INITIAL_VISIBLE_CHATS)}>
//                 <Image src={arrow} width={16} height={16} alt='view more'/>
//                 View More
//               </div>
//             )}
//           </div>
//         )}

//         <div className="chat-dashboard-account">
//           {openSetting && (
//           <div className='chat-dashboard-settings'>
//             <div className='chat-dashboard-settings-container'>
//               <div className='chat-dashboard-settings-theme' onClick={toggleTheme}>
//                   <p>Theme</p>
//                   <div className='settings-theme-indicator'>
//                   <span className={`settings-theme-indicator-light ${theme === 'light' ? 'active' : ''}`}></span>
//                   <span className={`settings-theme-indicator-dark ${theme === 'dark' ? 'active' : ''}`}></span>

//                   </div>
//               </div>
//               <div className='chat-dashboard-settings-logout' onClick={logOut}>
//                 Logout
//               </div>
//             </div>
//           </div>
//           )}
//           <div className='chat-dashboard-account-container' onClick={() => setOpenSetting(!openSetting)}>
//             <div className='chat-dashboard-account-contents'>
//               <div className='chat-dashboard-account-profile'>
//                 {userEmail ? userEmail.charAt(0).toUpperCase() : "?"}
//               </div>
//               <div className='chat-dashboard-account-email'>
//                 {userEmail || "Not Logged In"}
//               </div>
//             </div>
//             <IoIosArrowDown style={{fontSize:"16px",color:"var(--box-border)"}}/>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatDashboard;
