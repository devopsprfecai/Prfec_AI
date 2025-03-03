
// 'use client';
// import '@styles/ai/BetaAi.css';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { getDatabase, ref, get } from 'firebase/database';
// import { useEffect, useState } from 'react';
// import { UserAuth } from '@context/AuthContext';

// const AiDashboard = () => {
//   const pathname = usePathname();
//   const { user } = UserAuth(); // Get user from context
//   const [recentPrompts, setRecentPrompts] = useState([]);
//   const [recentKeywords, setRecentKeywords] = useState([]);
//   const [recentCompetitor, setRecentCompetitor] = useState([]);


//   useEffect(() => {
//     const fetchPrompts = async () => {
//       if (!user) return;

//       const db = getDatabase();
//       const userId = user.uid;

//       // If URL starts with /content-generation, fetch content-generation-prompts
//       if (pathname.startsWith('/content-generation')) {
//         try {
//           const promptsRef = ref(db, `content-generation-prompts/${userId}/`);
//           const snapshot = await get(promptsRef);

//           if (snapshot.exists()) {
//             const data = snapshot.val();
//             const userPrompts = [];

//             Object.keys(data).forEach((chatId) => {
//               const messages = data[chatId].messages;

//               if (messages) {
//                 // Get only messages sent by the user
//                 const userMessage = Object.values(messages).find((msg) => msg.sender === 'You');

//                 if (userMessage) {
//                   userPrompts.push({
//                     chatId,
//                     message: userMessage.text, // Store only user-sent messages
//                   });
//                 }
//               }
//             });

//             setRecentPrompts(userPrompts);
//           }
//         } catch (error) {
//           console.error('Error fetching user messages:', error);
//         }
//       }

//       if (pathname.startsWith('/keyword')) {
//         try {
//           const keywordsRef = ref(db, `keyword-research-prompts/${userId}/`);
//           const snapshot = await get(keywordsRef);

//           if (snapshot.exists()) {
//             const data = snapshot.val();
//             const keywordsList = [];

//             Object.keys(data).forEach((keywordId) => {
//               const { id, country, timestamp } = data[keywordId]; // Extract data
              

//               if (id ) {
//                 keywordsList.push({
//                   keywordId,
//                   id,
//                   country,
//                   timestamp,
//                 });
//               }
//             });
//             setRecentKeywords(keywordsList);

//           }
//         } catch (error) {
//           console.error('Error fetching keyword data:', error);
//         }
//       }

//       if (pathname.startsWith('/competitor')) {
//         try {
//           const competitorRef = ref(db, `competitor-analysis-prompts/${userId}/`);
//           const snapshot = await get(competitorRef);

//           if (snapshot.exists()) {
//             const data = snapshot.val();
//             const competitorList = [];

//             Object.keys(data).forEach((competitorId) => {
//               const { id, country, timestamp } = data[competitorId]; // Extract data
              

//               if (id ) {
//                competitorList.push({
//                   competitorId,
//                   id,
//                   country,
//                   timestamp,
//                 });
//               }
//             });
//             setRecentCompetitor(competitorList);

//           }
//         } catch (error) {
//           console.error('Error fetching competitor data:', error);
//         }
//       }

//     };

//     fetchPrompts();
//   }, [pathname, user]);

//   return (
//     <div className='ai-left-dashboard'>
//       <div className='ai-left-dashboard-container'>
//         <h2>Tools</h2>
//         <Link href='/' className={`ai-left-dashboard-contents ${pathname.startsWith('/content-generation') ? 'active' : ''}`}>
//           Content Generation
//         </Link>
//         <Link href='/keyword' className={`ai-left-dashboard-contents ${pathname.startsWith('/keyword') ? 'active' : ''}`}>
//           Keyword Research
//         </Link>
//         <Link href='/competitor' className={`ai-left-dashboard-contents ${pathname.startsWith('/competitor') ? 'active' : ''}`}>
//           Competitor Analysis
//         </Link>
//       </div>

//       <div className='ai-left-dashboard-recent-searches'>
//         <h2>Recent Searches</h2>
//         <ul>
//           {/* Show recent prompts when in /content-generation */}
//           {pathname.startsWith('/content-generation') && recentPrompts.length > 0 ? (
//             recentPrompts.map((prompt) => (
//               <li key={prompt.chatId}>
//                 <Link href={`/content-generation/${prompt.chatId}`}>
//                   {prompt.message}
//                 </Link>
//               </li>
//             ))
//           ) : null}

//           {/* Show keyword searches when in /keyword */}
//           {pathname.startsWith('/keyword') && recentKeywords.length > 0 ? (
//             recentKeywords.map((keyword) => (
//               <li key={keyword.keywordId}>
//                 <Link href={`/keyword/${keyword.keywordId}`}>
//                   {keyword.id}
//                 </Link>
//               </li>
//             ))
//           ) : pathname.startsWith('/keyword') ? (
//             <p>No keyword searches found.</p>
//           ) : null}

//           {/* Show keyword searches when in /keyword */}
//           {pathname.startsWith('/competitor') && recentCompetitor.length > 0 ? (
//             recentCompetitor.map((competitor) => (
//               <li key={competitor.competitorId}>
//                 <Link href={`/competitor/${competitor.competitorId}`}>
//                   {competitor.id}
//                 </Link>
//               </li>
//             ))
//           ) : pathname.startsWith('/keyword') ? (
//             <p>No keyword searches found.</p>
//           ) : null}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default AiDashboard;


// 'use client';
// import '@styles/ai/Dashboard.css';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { getDatabase, ref, get } from 'firebase/database';
// import { useEffect, useState } from 'react';
// import { UserAuth } from '@context/AuthContext';

// const INITIAL_VISIBLE_CHATS = 5;

// const AiDashboard = () => {
//   const pathname = usePathname();
//   const { user } = UserAuth(); // Get user from context
//   const [recentPrompts, setRecentPrompts] = useState([]);
//   const [recentKeywords, setRecentKeywords] = useState([]);
//   const [recentCompetitor, setRecentCompetitor] = useState([]);
//   const [allRecentSearches, setAllRecentSearches] = useState([]);
//   const [recentChats, setRecentChats] = useState([]);
//   const [visibleChats, setVisibleChats] = useState(INITIAL_VISIBLE_CHATS);

//   useEffect(() => {
//     const fetchPrompts = async () => {
//       if (!user) return;

//       const db = getDatabase();
//       const userId = user.uid;

//       // If URL starts with /content-generation, fetch content-generation-prompts
//       if (pathname.startsWith('/content-generation')) {
//         try {
//           const promptsRef = ref(db, `content-generation-prompts/${userId}/`);
//           const snapshot = await get(promptsRef);

//           if (snapshot.exists()) {
//             const data = snapshot.val();
//             const userPrompts = [];

//             Object.keys(data).forEach((chatId) => {
//               const messages = data[chatId].messages;

//               if (messages) {
//                 // Get only messages sent by the user
//                 const userMessage = Object.values(messages).find((msg) => msg.sender === 'You');

//                 if (userMessage) {
//                   userPrompts.push({
//                     chatId,
//                     message: userMessage.text, // Store only user-sent messages
//                   });
//                 }
//               }
//             });

//             setRecentPrompts(userPrompts);
//           }
//         } catch (error) {
//           console.error('Error fetching user messages:', error);
//         }
//       }

//       if (pathname.startsWith('/keyword')) {
//         try {
//           const keywordsRef = ref(db, `keyword-research-prompts/${userId}/`);
//           const snapshot = await get(keywordsRef);

//           if (snapshot.exists()) {
//             const data = snapshot.val();
//             const keywordsList = [];

//             Object.keys(data).forEach((keywordId) => {
//               const { id, country, timestamp } = data[keywordId]; // Extract data
              

//               if (id ) {
//                 keywordsList.push({
//                   keywordId,
//                   id,
//                   country,
//                   timestamp,
//                 });
//               }
//             });
//             setRecentKeywords(keywordsList);

//           }
//         } catch (error) {
//           console.error('Error fetching keyword data:', error);
//         }
//       }

//       if (pathname.startsWith('/competitor')) {
//         try {
//           const competitorRef = ref(db, `competitor-analysis-prompts/${userId}/`);
//           const snapshot = await get(competitorRef);

//           if (snapshot.exists()) {
//             const data = snapshot.val();
//             const competitorList = [];

//             Object.keys(data).forEach((competitorId) => {
//               const { id, country, timestamp } = data[competitorId]; // Extract data
              

//               if (id ) {
//                competitorList.push({
//                   competitorId,
//                   id,
//                   country,
//                   timestamp,
//                 });
//               }
//             });
//             setRecentCompetitor(competitorList);

//           }
//         } catch (error) {
//           console.error('Error fetching competitor data:', error);
//         }
//       }

//     };

//     fetchPrompts();
//   }, [pathname, user]);

//   useEffect(() => {
//     const fetchAllData = async () => {
//       if (!user || pathname !== '/') return;

//       const db = getDatabase();
//       const userId = user.uid;
//       let allData = [];

//       const fetchContentGenerationData = async () => {
//         try {
//           const promptsRef = ref(db, `content-generation-prompts/${userId}/`);
//           const snapshot = await get(promptsRef);

//           if (snapshot.exists()) {
//             const data = snapshot.val();
//             Object.keys(data).forEach((chatId) => {
//               const messages = data[chatId].messages;
//               if (messages) {
//                 const userMessage = Object.values(messages).find((msg) => msg.sender === 'You');
//                 if (userMessage) {
//                   allData.push({
//                     id: userMessage.text,
//                     timestamp: data[chatId].timestamp || 0,
//                     link: `/content-generation/${chatId}`,
//                   });
//                 }
//               }
//             });
//           }
//         } catch (error) {
//           console.error('Error fetching content-generation data:', error);
//         }
//       };

//       const fetchData = async (path, type) => {
//         try {
//           const dataRef = ref(db, `${path}/${userId}/`);
//           const snapshot = await get(dataRef);

//           if (snapshot.exists()) {
//             const data = snapshot.val();
//             Object.keys(data).forEach((itemId) => {
//               const { id, timestamp } = data[itemId];
//               if (id) {
//                 allData.push({
//                   id,
//                   timestamp,
//                   link: `/${type}/${itemId}`,
//                 });
//               }
//             });
//           }
//         } catch (error) {
//           console.error(`Error fetching ${type} data:`, error);
//         }
//       };

//       await Promise.all([
//         fetchContentGenerationData(),
//         fetchData('keyword-research-prompts', 'keyword'),
//         fetchData('competitor-analysis-prompts', 'competitor'),
//       ]);

//       allData.sort((a, b) => b.timestamp - a.timestamp);
//       setAllRecentSearches(allData);
//     };

//     fetchAllData();
//   }, [pathname, user]);

//   return (
//     <div className='ai-left-dashboard'>
//       <div className='ai-left-dashboard-container'>
//         <div className='ai-left-dashboard-agents'>
//           <h2>Agents</h2>
//           <Link href='/' className={`ai-left-dashboard-contents ${pathname.startsWith('/') ? 'active' : ''}`}>
//             Content Generation
//           </Link>
//           <Link href='/keyword' className={`ai-left-dashboard-contents ${pathname.startsWith('/keyword') ? 'active' : ''}`}>
//             Keyword Research
//           </Link>
//           <Link href='/competitor' className={`ai-left-dashboard-contents ${pathname.startsWith('/competitor') ? 'active' : ''}`}>
//             Competitor Analysis
//           </Link>
//         </div>
      
       

//       <div className='chat-dashboard-recents'>
//         <h2>Recent Searches</h2>
//           <div className='chat-dashboard-recents-contents'>
//           {recentChats.length > 0 && (
//           {pathname.startsWith('/content-generation') && recentPrompts.length > 0 ? (
//             recentPrompts.map((prompt) => (
//                 <Link href={`/content-generation/${prompt.chatId}`} key={prompt.chatId}>
//                   {prompt.message}
//                 </Link>
//             ))
//           ) : null}
//           )}

//           {recentChats.length > 0 && (
//           {pathname.startsWith('/keyword') && recentKeywords.length > 0 ? (
//             recentKeywords.map((keyword) => (
//                 <Link href={`/keyword/${keyword.keywordId}`} key={keyword.keywordId}>
//                   {keyword.id}
//                 </Link>
//             ))
//           ) : null}
//                     )}

//           {recentChats.length > 0 && (
//           {pathname.startsWith('/competitor') && recentCompetitor.length > 0 ? (
//             recentCompetitor.map((competitor) => (
//                 <Link href={`/competitor/${competitor.competitorId}`} key={competitor.competitorId}>
//                   {competitor.id}
//                 </Link>
//             ))
//           ) : null}
//                     )}

//           {recentChats.length > 0 && (
//           {pathname === '/' && allRecentSearches.length > 0 ? (
//             allRecentSearches.map((search, index) => (
//                 <Link href={search.link}  key={index}>{search.id}</Link>
//             ))
//           ) : null}
//         )}
//                     {visibleChats < recentChats.length && (
//               <div className="char-dashboard-view-more-btn" onClick={() => setVisibleChats(prev => prev + INITIAL_VISIBLE_CHATS)}>
//                 <Image src={arrow} width={16} height={16} alt='view more'/>
//                 View More
//               </div>
//             )}
//           </div>

//       </div>
      
//     </div>
//     </div>
//   );
// };

// export default AiDashboard;



'use client';
import '@styles/ai/Dashboard.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDatabase, ref, get, onValue } from 'firebase/database';
import { useEffect, useState } from 'react';
import { UserAuth } from '@context/AuthContext';
import { PiChatCircleDotsLight } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";
import { useTheme } from 'next-themes';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { IoSettingsOutline } from "react-icons/io5";
import whiteLogo from '@public/Images/navbar/Prfec Logo White.png'
import blackLogo from '@public/Images/navbar/prfec-logo.png'
import Image from 'next/image';
const INITIAL_VISIBLE_CHATS = 5;

const AiDashboard = ({ menuOpen, setMenuOpen }) => {
  const pathname = usePathname();
  const { user } = UserAuth(); // Get user from context
  const [recentPrompts, setRecentPrompts] = useState([]);
  const [recentKeywords, setRecentKeywords] = useState([]);
  const [recentCompetitor, setRecentCompetitor] = useState([]);
  const [allRecentSearches, setAllRecentSearches] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [visibleChats, setVisibleChats] = useState(INITIAL_VISIBLE_CHATS);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  const [visiblePrompts, setVisiblePrompts] = useState(INITIAL_VISIBLE_CHATS);
  const [visibleKeywords, setVisibleKeywords] = useState(INITIAL_VISIBLE_CHATS);
  const [visibleCompetitor, setVisibleCompetitor] = useState(INITIAL_VISIBLE_CHATS);
  const [visibleSearches, setVisibleSearches] = useState(INITIAL_VISIBLE_CHATS);
  const [openSetting, setOpenSetting] = useState(false);
  const { logOut } = UserAuth();
  const { theme, setTheme, systemTheme } = useTheme();
  const currentChatId = pathname.split('/').pop();

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  
    return () => {
      document.body.style.overflow = ''; // Cleanup on unmount
    };
  }, [menuOpen]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen) {
        const dashboard = document.querySelector('.ai-left-dashboard');
  
        // Check if click is outside the menu
        if (dashboard && !dashboard.contains(event.target)) {
          setMenuOpen(false);
        }
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    const fetchPrompts = async () => {
      if (!user) return;

      const db = getDatabase();
      const userId = user.uid;

      // If URL starts with /content-generation, fetch content-generation-prompts
      if (pathname.startsWith('/content-generation')) {
        try {
          const promptsRef = ref(db, `content-generation-prompts/${userId}/`);
          const snapshot = await get(promptsRef);

          if (snapshot.exists()) {
            const data = snapshot.val();
            const userPrompts = [];

            Object.keys(data).forEach((chatId) => {
              const messages = data[chatId].messages;

              if (messages) {
                // Get only messages sent by the user
                const userMessage = Object.values(messages).find((msg) => msg.sender === 'You');

                if (userMessage) {
                  userPrompts.push({
                    chatId,
                    message: userMessage.text, // Store only user-sent messages
                  });
                }
              }
            });

            setRecentPrompts(userPrompts);
          }
        } catch (error) {
          console.error('Error fetching user messages:', error);
        }
      }

      if (pathname.startsWith('/keyword')) {
        try {
          const keywordsRef = ref(db, `keyword-research-prompts/${userId}/`);
          const snapshot = await get(keywordsRef);

          if (snapshot.exists()) {
            const data = snapshot.val();
            const keywordsList = [];

            Object.keys(data).forEach((keywordId) => {
              const { id, country, timestamp } = data[keywordId]; // Extract data
              

              if (id ) {
                keywordsList.push({
                  keywordId,
                  id,
                  country,
                  timestamp,
                });
              }
            });
            setRecentKeywords(keywordsList);

          }
        } catch (error) {
          console.error('Error fetching keyword data:', error);
        }
      }
    };

    fetchPrompts();
  }, [pathname, user]);
    
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUserEmail(user.email);
      } else {
        setUserEmail('');
      }
    });

    if (!auth.currentUser) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const database = getDatabase();
    const chatRef = ref(database, `chats/${auth.currentUser.uid}`);

    onValue(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const chatData = snapshot.val();
        const chatsArray = Object.entries(chatData).map(([id, chat]) => ({
          id,
          title: chat.title || "Untitled Chat",
          lastUpdated: chat.lastUpdated || 0,
        }));

        chatsArray.sort((a, b) => b.lastUpdated - a.lastUpdated);
        setRecentChats(chatsArray);
      } else {
        setRecentChats([]);
      }
      setLoading(false);
    }, (error) => {
      setError("Failed to load chats");
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    const fetchCompetitorData = async () => {
      if (!user) return; // Ensure user is available before fetching
  
      const db = getDatabase();
      const userId = user.uid;
      const competitorRef = ref(db, `competitor-analysis-prompts/${userId}/`);
  
      try {
        const snapshot = await get(competitorRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const competitorList = Object.keys(data).map(competitorId => ({
            competitorId,
            id: data[competitorId].id,
            timestamp: data[competitorId].timestamp,
          }));
  
          
          setRecentCompetitor(competitorList); // ✅ Update state properly
        } else {
          setRecentCompetitor([]); // ✅ Clear if no data
        }
      } catch (error) {
        console.error('Error fetching competitor data:', error);
      }
    };
  
    fetchCompetitorData(); // ✅ Call the function inside useEffect
  
  }, [pathname, user]); // ✅ Dependency array
  
  const toggleTheme = () => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };
    const Logo = theme === "dark" ? whiteLogo : blackLogo;
  return (
    <div className='ai-left-dashboard'>
      <div className='ai-left-dashboard-container'>

    <div className="ai-dashboard-logo" onClick={() => handleNavigation("/")}>
      <Image className="ai-prfec-logo" src={Logo} alt="Logo"  />
    </div>

      <div className="chat-dashboard-new-chat">
          <Link href='/'>
            <PiChatCircleDotsLight style={{fontSize:"16px",color:"var(--p-color)"}}/>
            New Chat
          </Link>
        </div>

        <div className='ai-left-dashboard-agents'>
          <h2>Agents</h2>
          <Link href='/content-generation' className={`ai-left-dashboard-contents ${pathname.startsWith('/content-generation') ? 'active' : ''}`}>
            Content Generation
          </Link>
          <Link href='/keyword' className={`ai-left-dashboard-contents ${pathname.startsWith('/keyword') ? 'active' : ''}`}>
            Keyword Research
          </Link>
          <Link href='/competitor' className={`ai-left-dashboard-contents ${pathname.startsWith('/competitor') ? 'active' : ''}`}>
            Competitor Analysis
          </Link>
        </div>
      
       

      <div className='chat-dashboard-recents'>
        <h2>Recent Searches</h2>
          <div className='chat-dashboard-recents-contents'>
          {pathname.startsWith('/content-generation') && recentPrompts.length > 0 && (
            <>
              {recentPrompts.slice(0, visiblePrompts).map((prompt) => (
                <Link 
  href={`/content-generation/${prompt.chatId}`} 
  key={prompt.chatId} 
  className={`content-generation-recent-search ${pathname.startsWith(`/content-generation/${prompt.chatId}`) ? 'active' : ''}`}
>
                  {prompt.message}
                </Link>
              ))}
              {visiblePrompts < recentPrompts.length && (
                <div className="chat-dashboard-view-more-btn" onClick={() => setVisiblePrompts(prev => prev + INITIAL_VISIBLE_CHATS)}>
                  View More
                </div>
              )}
            </>
          )}

          {pathname.startsWith('/keyword') && recentKeywords.length > 0 && (
            <>
              {recentKeywords.slice(0, visibleKeywords).map((keyword) => (
                <Link href={`/keyword/${keyword.keywordId}`} key={keyword.keywordId}
                className={`content-generation-recent-search ${pathname.startsWith(`/keyword/${keyword.keywordId}`) ? 'active' : ''}`}
>
                  {keyword.id}
                </Link>
              ))}
              {visibleKeywords < recentKeywords.length && (
                <div className="chat-dashboard-view-more-btn" onClick={() => setVisibleKeywords(prev => prev + INITIAL_VISIBLE_CHATS)}>
                  View More
                </div>
              )}
            </>
          )}

          {pathname.startsWith('/competitor') && recentCompetitor.length > 0 && (
            <>
              {recentCompetitor.slice(0, visibleCompetitor).map((competitor) => (
                <Link href={`/competitor/${competitor.competitorId}`} key={competitor.competitorId}
                className={`content-generation-recent-search ${pathname.startsWith(`/competitor/${competitor.competitorId}`) ? 'active' : ''}`}
>
                  {competitor.id}
                </Link>
              ))}
              {visibleCompetitor < recentCompetitor.length && (
                <div className="chat-dashboard-view-more-btn" onClick={() => setVisibleCompetitor(prev => prev + INITIAL_VISIBLE_CHATS)}>
                  View More
                </div>
              )}
            </>
          )}

          {/* {pathname === '/' && allRecentSearches.length > 0 && (
            <>
              {allRecentSearches.slice(0, visibleSearches).map((search, index) => (
                <Link href={search.link} key={index}>{search.id}</Link>
              ))}
              {visibleSearches < allRecentSearches.length && (
                <div className="chat-dashboard-view-more-btn" onClick={() => setVisibleSearches(prev => prev + INITIAL_VISIBLE_CHATS)}>
                  View More
                </div>
              )}
            </>
          )} */}
          {pathname === '/' || pathname.startsWith('/chat') && recentChats.length > 0 && (
            <>
          {/* <div className="chat-dashboard-recents">
            <h3>Recent Chats</h3>
            <div className='chat-dashboard-recents-contents'> */}
              {recentChats.slice(0, visibleChats).map(chat => (
                <Link 
                  key={chat.id} 
                  href={`/chat/${chat.id}`} 
                  className={`${chat.id === currentChatId ? "active" : ""}`}
                  // className={`content-generation-recent-search ${pathname.startsWith(`/chat/${chat.id}}`) ? 'active' : ''}`}

                >
                  {chat.title}
                </Link>
              ))}
            {/* </div> */}
            {visibleChats < recentChats.length && (
              <div className="chat-dashboard-view-more-btn" onClick={() => setVisibleChats(prev => prev + INITIAL_VISIBLE_CHATS)}>
                {/* <Image src={arrow} width={16} height={16} alt='view more'/> */}
                View More
              </div>
            )}
          {/* </div> */}
          </>
        )}


          </div>

      </div>

      <div className="chat-dashboard-account">
          {openSetting && (
          <div className='chat-dashboard-settings'>
            <div className='chat-dashboard-settings-container'>
              <div className='chat-dashboard-settings-theme' onClick={toggleTheme}>
                  <p>Theme</p>
                  <div className='settings-theme-indicator'>
                  <span className={`settings-theme-indicator-light ${theme === 'light' ? 'active' : ''}`}></span>
                  <span className={`settings-theme-indicator-dark ${theme === 'dark' ? 'active' : ''}`}></span>

                  </div>
              </div>
              <div className='chat-dashboard-settings-logout' onClick={logOut}>
                Logout
              </div>
            </div>
          </div>
          )}
          <div className='chat-dashboard-account-container' onClick={() => setOpenSetting(!openSetting)}>
            <div className='chat-dashboard-account-contents'>
              <div className='chat-dashboard-account-email'>
                Settings

              </div>
              <IoSettingsOutline 
            style={{fontSize:"16px",color:"var(--p-color)"}}/>
            </div>

          </div>
        </div>
      
    </div>
    </div>
  );
};

export default AiDashboard;


