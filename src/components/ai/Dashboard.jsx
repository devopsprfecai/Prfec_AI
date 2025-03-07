'use client';
import '@styles/ai/Dashboard.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDatabase, ref, get, onValue, off } from 'firebase/database';
import { useEffect, useState,useRef } from 'react';
import { UserAuth } from '@context/AuthContext';
import { PiChatCircleDotsLight } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";
import { useTheme } from 'next-themes';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { IoSettingsOutline } from "react-icons/io5";
import whiteLogo from '@public/Images/navbar/Prfec Logo White.svg'
import blackLogo from '@public/Images/navbar/prfec-logo.svg'
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
  const [planType, setPlanType] = useState(null);
  const [planCount, setPlanCount] = useState(3);
  const [promptCount, setPromptCount] = useState();
  const [visiblePrompts, setVisiblePrompts] = useState(INITIAL_VISIBLE_CHATS);
  const [visibleKeywords, setVisibleKeywords] = useState(INITIAL_VISIBLE_CHATS);
  const [visibleCompetitor, setVisibleCompetitor] = useState(INITIAL_VISIBLE_CHATS);
  const [visibleSearches, setVisibleSearches] = useState(INITIAL_VISIBLE_CHATS);
  const [openSetting, setOpenSetting] = useState(false);
  const { logOut } = UserAuth();
  const { theme, setTheme, systemTheme } = useTheme();
  const [dashboardHeight, setDashboardHeight] = useState(null);
  const currentChatId = pathname.split('/').pop();
  const dashboardRef = useRef(null);


  useEffect(() => { //for full height of the dashboard
    const updateHeight = () => {
      if (window.innerWidth <= 800) {
        setDashboardHeight(window.innerHeight + 'px');
      } else {
        setDashboardHeight(null); // Reset when above 800px
      }
    };

    updateHeight(); // Set initial height
    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

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
      // Only run if menu is open and we have a dashboard reference
      if (menuOpen && dashboardRef.current) {
        // Check if click target is outside the dashboard
        if (!dashboardRef.current.contains(event.target)) {
          // Click is outside, close the menu
          setMenuOpen(false);
        }
      }
    };

    // Add event listener with capture phase to handle it before other listeners
    document.addEventListener('mousedown', handleClickOutside, true);
    
    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [menuOpen, setMenuOpen]);
  
  
  

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

 

  useEffect(() => {
    if (!user) return;
    const db = getDatabase();
    const userId = user.uid;
    let promptPath = null;
    let promptKey = "promptCount"; // Default key
  
    if (pathname.startsWith('/content-generation')) {
      promptPath = `/contentPromptCount/${userId}`;
      promptKey = "promptCount";
    } else if (pathname.startsWith('/keyword')) {
      promptPath = `/keywordPromptCount/${userId}`;
      promptKey = "keywordPromptCount";
    } else if (pathname.startsWith('/competitor')) {
      promptPath = `/competitorPromptCount/${userId}`;
      promptKey = "competitorPromptCount";
    } else if (pathname === '/' || pathname.startsWith('/chat') ) {
      promptPath = `/ChatPromptCount/${userId}`;
      promptKey = "chatPromptCount";
    }
  
    if (!promptPath) return;
  
    const promptRef = ref(db, promptPath);
    onValue(
      promptRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setPromptCount(data[promptKey] ?? 0); // Dynamically select the correct key
        } else {
          setPromptCount(0);
        }
      },
      (error) => {
        console.error("Error fetching prompt count:", error);
        setPromptCount(0);
      }
    );
  
    return () => off(promptRef); // Clean up listener when component unmounts
  }, [pathname, user]);

  useEffect(() => {
    if (planType === 'starter') {
      setPlanCount(50);
    } else if (planType === 'pro') {
      setPlanCount(150);
    } else {
      setPlanCount(3); // Default value
    }
  }, [planType]);
  
  const toggleTheme = () => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };
  const currentTheme = theme === "system" ? systemTheme : theme;
  const Logo = currentTheme === "dark" ? whiteLogo : blackLogo;

    // const Logo = theme === "dark" ? whiteLogo : blackLogo;
    const promptLeft = planCount - promptCount;


  return (
    <div className='ai-left-dashboard' ref={dashboardRef} style={dashboardHeight ? { height: dashboardHeight } : {}}>
      <div className='ai-left-dashboard-container'>

    <Link href='/' className="ai-dashboard-logo" >
      <Image className="ai-prfec-logo" src={Logo} alt="Logo"  />
    </Link>

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
                {competitor.id.replace(/_/g, ".")}
                </Link>
              ))}
              {visibleCompetitor < recentCompetitor.length && (
                <div className="chat-dashboard-view-more-btn" onClick={() => setVisibleCompetitor(prev => prev + INITIAL_VISIBLE_CHATS)}>
                  View More
                </div>
              )}
            </>
          )}


          {(pathname === '/' || pathname.startsWith('/chat')) && recentChats.length > 0 && (
            <>

              {recentChats.slice(0, visibleChats).map(chat => (
                <Link 
                  key={chat.id} 
                  href={`/chat/${chat.id}`} 
                  className={`${chat.id === currentChatId ? "active" : ""}`}
                >
                  {chat.title}
                </Link>
              ))}
            {visibleChats < recentChats.length && (
              <div className="chat-dashboard-view-more-btn" onClick={() => setVisibleChats(prev => prev + INITIAL_VISIBLE_CHATS)}>
                View More
              </div>
            )}
          </>
        )}

          </div>

      </div>

{/* <div className='chat-dashboard-recents'>
  <h2>Recent Searches</h2>
  <div className='chat-dashboard-recents-contents'>
    {pathname.startsWith('/content-generation') && recentPrompts.length > 0 ? (
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
    ) : pathname.startsWith('/content-generation') && (
      <div className='chat-dashboard-view-more-btn'>No recent searches</div>
    )}

    {pathname.startsWith('/keyword') && recentKeywords.length > 0 ? (
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
    ) : pathname.startsWith('/keyword') && (
      <div className='chat-dashboard-view-more-btn'>No recent searches</div>
    )}

    {pathname.startsWith('/competitor') && recentCompetitor.length > 0 ? (
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
    ) : pathname.startsWith('/competitor') && (
      <div className='chat-dashboard-view-more-btn'>No recent searches</div>
    )}

    {(pathname === '/' || pathname.startsWith('/chat')) && recentChats.length > 0 ? (
      <>
        {recentChats.slice(0, visibleChats).map(chat => (
          <Link 
            key={chat.id} 
            href={`/chat/${chat.id}`} 
            className={`${chat.id === currentChatId ? "active" : ""}`}
          >
            {chat.title}
          </Link>
        ))}
        {visibleChats < recentChats.length && (
          <div className="chat-dashboard-view-more-btn" onClick={() => setVisibleChats(prev => prev + INITIAL_VISIBLE_CHATS)}>
            View More
          </div>
        )}
      </>
    ) : (pathname === '/' || pathname.startsWith('/chat')) && (
      <div className='chat-dashboard-view-more-btn'>No recent searches</div>
    )}
  </div>
</div> */}

      <div className='chat-dashboard-prompts-left'>
        <p>Remaining Prompts: {promptLeft}/{planCount}</p>
      </div>

      <div className="chat-dashboard-account">
          {openSetting && (
          <div className='chat-dashboard-settings'>
            <div className='chat-dashboard-settings-container'>
              <div className='chat-dashboard-settings-theme' onClick={toggleTheme}>
                  <p>Theme</p>
                  <div className='settings-theme-indicator'>
                  <span className={`settings-theme-indicator-light ${currentTheme === 'light' ? 'active' : ''}`}></span>
                  <span className={`settings-theme-indicator-dark ${currentTheme === 'dark' ? 'active' : ''}`}></span>

                  </div>
              </div>
              <Link href='/pricing' className='chat-dashboard-settings-logout' style={{paddingBottom:"10px"}}>
                Upgrade
              </Link>
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


