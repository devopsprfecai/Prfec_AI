'use client';
import React, { createContext, useState, useEffect } from 'react';
import { ref, set, get } from 'firebase/database';
import { database } from '@firebase';
import { UserAuth } from './AuthContext';

const PromptContext = createContext();

const getNextMinute = () => {
  const now = Date.now();
  // return now + 60 * 1000; // Add 1 minute in milliseconds
  return now + 24 * 60 * 60 * 1000;
};

export const PromptProvider = ({ children }) => {
  const [promptCount, setPromptCount] = useState(0);
  const [resetTime, setResetTime] = useState(null);
  const { user } = UserAuth();

  useEffect(() => {
    const initializeData = async () => {
      if (user?.uid) {
        const userRef = ref(database, `contentPromptCount/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setPromptCount(data.promptCount || 0);
          setResetTime(data.resetTime || getNextMinute());
        } else {
          const initialResetTime = getNextMinute();
          setResetTime(initialResetTime);
          await set(userRef, {
            promptCount: 0,
            resetTime: initialResetTime,
            userId: user.uid,
            email: user.email,
          });
        }
      }
    };

    initializeData();
  }, [user]);

  useEffect(() => {
    const checkResetTime = () => {
      if (resetTime && Date.now() >= resetTime) {
        // Reset promptCount if current time >= resetTime
        setPromptCount(0);
        const nextReset = getNextMinute();
        setResetTime(nextReset);
        if (user?.uid) {
          const userRef = ref(database, `contentPromptCount/${user.uid}`);
          set(userRef, {
            promptCount: 0,
            resetTime: nextReset,
            userId: user.uid,
            email: user.email,
          });
        }
      }
    };

    const interval = setInterval(checkResetTime, 1000); // Check every second

    return () => clearInterval(interval); // Clean up on component unmount
  }, [resetTime, user]);

  useEffect(() => {
    if (user?.uid) {
      const userRef = ref(database, `contentPromptCount/${user.uid}`);
      set(userRef, {
        promptCount,
        resetTime,
        userId: user.uid,
        email: user.email,
      });
    }
  }, [promptCount, resetTime, user]);

  return (
    <PromptContext.Provider value={{ promptCount, setPromptCount }}>
      {children}
    </PromptContext.Provider>
  );
};

export const usePrompt = () => React.useContext(PromptContext);

// 'use client';
// import React, { createContext, useState, useEffect } from 'react';
// import { ref, set, get } from 'firebase/database';
// import { database } from '@firebase';
// import { UserAuth } from './AuthContext';

// const PromptContext = createContext();

// const getNextMinute = () => {
//   const now = Date.now();
//   return now + 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
// };

// export const PromptProvider = ({ children }) => {
//   const [promptCount, setPromptCount] = useState(0);
//   const [resetTime, setResetTime] = useState(null);
//   const [keywordPromptCount, setKeywordPromptCount] = useState(0);
//   const [keywordResetTime, setKeywordResetTime] = useState(null);
//   const { user } = UserAuth();

//   // Initialize data for both prompt counts and reset times
//   useEffect(() => {
//     const initializeData = async () => {
//       if (user?.uid) {
//         const userRef = ref(database, `contentPromtCount/${user.uid}`);
//         const snapshot = await get(userRef);
//         console.log('PRomt Count from init');

//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           setPromptCount(data.promptCount || 0);
//           setResetTime(data.resetTime || getNextMinute());
//           setKeywordPromptCount(data.keywordPromptCount || 0);
//           setKeywordResetTime(data.keywordResetTime || getNextMinute());
//         } else {
//           const initialResetTime = getNextMinute();
//           setResetTime(initialResetTime);
//           setKeywordResetTime(initialResetTime);
//           await set(userRef, {
//             promptCount: 0,
//             resetTime: initialResetTime,
//             keywordPromptCount: 0,
//             keywordResetTime: initialResetTime,
//             userId: user.uid,
//             email: user.email,
//           });
//         }
//       }
//     };
//     initializeData();
//   }, [user]);

//   useEffect(() => {
//     const checkResetTime = () => {
//       if (resetTime && Date.now() >= resetTime) {
//         const nextReset = getNextMinute();
//         setPromptCount(promptCount);
//         setResetTime(nextReset);
//         console.log('PRomt Count from reset');


//         if (user?.uid) {
//           const userRef = ref(database, `contentPromtCount/${user.uid}`);
//           set(userRef, {
//             promptCount: promptCount,
//             resetTime: nextReset,
//             keywordPromptCount,
//             keywordResetTime,
//             userId: user.uid,
//             email: user.email,
//           });
//         }
//       }
//     };

//     const interval = setInterval(checkResetTime, 1000);

//     return () => clearInterval(interval);
//   }, [user, keywordPromptCount, keywordResetTime]);


//   useEffect(() => {
//     const checkKeywordResetTime = () => {
//       if (keywordResetTime && Date.now() >= keywordResetTime) {
//         const nextReset = getNextMinute();
//         setKeywordPromptCount(keywordPromptCount);
//         setKeywordResetTime(nextReset);
//         console.log('PRomt Count from keyreset');

//         if (user?.uid) {
//           const userRef = ref(database, `contentPromtCount/${user.uid}`);
//           set(userRef, {
//             promptCount,
//             resetTime,
//             keywordPromptCount: keywordPromptCount,
//             keywordResetTime: nextReset,
//             userId: user.uid,
//             email: user.email,
//           });
//         }

//       }
//     };

//     const interval = setInterval(checkKeywordResetTime, 1000);

//     return () => clearInterval(interval);
//   }, [user, promptCount, resetTime]);


//   useEffect(() => {
//     if (user?.uid) {
//       const userRef = ref(database, `contentPromtCount/${user.uid}`);
//       console.log('PRomt Count from all useeefect');

//       set(userRef, {
//         promptCount,
//         resetTime,
//         keywordPromptCount,
//         keywordResetTime,
//         userId: user.uid,
//         email: user.email,
//       });
//     }

//   }, [promptCount, resetTime, keywordPromptCount, keywordResetTime, user]);

//   return (
//     <PromptContext.Provider
//       value={{
//         promptCount,
//         setPromptCount,
//         keywordPromptCount,
//         setKeywordPromptCount,
//       }}
//     >
//       {children}
//     </PromptContext.Provider>
//   );
// };

// export const usePrompt = () => React.useContext(PromptContext);

// 'use client';
// import React, { createContext, useState, useEffect } from 'react';
// import { ref, set, get } from 'firebase/database';
// import { database } from '@firebase';
// import { UserAuth } from './AuthContext';
// import next from 'next';

// const PromptContext = createContext();

// const getNextMinute = () => {
//   const now = Date.now();
//   return now + 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
// };

// export const PromptProvider = ({ children }) => {
//   const [promptCount, setPromptCount] = useState(0);
//   const [resetTime, setResetTime] = useState(null);
//   const [keywordPromptCount, setKeywordPromptCount] = useState(0);
//   const [keywordResetTime, setKeywordResetTime] = useState(null);
//   const { user } = UserAuth();

//   // Initialize data for both prompt counts and reset times
//   useEffect(() => {
//     const initializeData = async () => {
//       if (user?.uid) {
//         const userRef = ref(database, `contentPromtCount/${user.uid}`);
//         const snapshot = await get(userRef);

//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           setPromptCount(data.promptCount || 0);
//           setResetTime(data.resetTime || getNextMinute());
//           setKeywordPromptCount(data.keywordPromptCount || 0);
//           setKeywordResetTime(data.keywordResetTime || getNextMinute());
//         } else {
//           const initialResetTime = getNextMinute();
//           setResetTime(initialResetTime);
//           setKeywordResetTime(initialResetTime);
//           await set(userRef, {
//             promptCount: 0,
//             resetTime: initialResetTime,
//             keywordPromptCount: 0,
//             keywordResetTime: initialResetTime,
//             userId: user.uid,
//             email: user.email,
//           });
//         }
//       }
//     };
//     initializeData();
//   }, [user]);

//   useEffect(() => {
//     const checkResetTime = () => {
//       if (resetTime && Date.now() >= resetTime) {
//         const nextReset = getNextMinute();
//         setPromptCount(0);
//         setResetTime(nextReset);


//         if (user?.uid) {
//           const userRef = ref(database, `contentPromtCount/${user.uid}`);
//           set(userRef, {
//             promptCount: 0,
//             resetTime : nextReset,
//             keywordPromptCount,
//             keywordResetTime,
//             userId: user.uid,
//             email: user.email,
//           });
//         }
//       }
//     };

//     const interval = setInterval(checkResetTime, 1000);

//     return () => clearInterval(interval);
//   }, [resetTime, user]);


//   useEffect(() => {
//     const checkKeywordResetTime = () => {
//       if (keywordResetTime && Date.now() >= keywordResetTime) {
//         const nextReset = getNextMinute();
//         setKeywordPromptCount(0);
//         setKeywordResetTime(nextReset);

//         if (user?.uid) {
//           const userRef = ref(database, `contentPromtCount/${user.uid}`);
//           set(userRef, {
//             promptCount,
//             resetTime,
//             keywordPromptCount: 0,
//             keywordResetTime: nextReset,
//             userId: user.uid,
//             email: user.email,
//           });
//         }

//       }
//     };

//     const interval = setInterval(checkKeywordResetTime, 1000);

//     return () => clearInterval(interval);
//   }, [keywordResetTime, user]);


//   useEffect(() => {
//     if (user?.uid) {
//       const userRef = ref(database, `contentPromtCount/${user.uid}`);
// 0
//       set(userRef, {
//         promptCount,
//         resetTime,
//         keywordPromptCount,
//         keywordResetTime,
//         userId: user.uid,
//         email: user.email,
//       });
//     }

//   }, [promptCount, resetTime, keywordPromptCount, keywordResetTime, user]);

//   return (
//     <PromptContext.Provider
//       value={{
//         promptCount,
//         setPromptCount,
//         keywordPromptCount,
//         setKeywordPromptCount,
//       }}
//     >
//       {children}
//     </PromptContext.Provider>
//   );
// };

// export const usePrompt = () => React.useContext(PromptContext);

