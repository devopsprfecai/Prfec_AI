
// 'use client';
// import React, { createContext, useState, useEffect } from 'react';
// import { ref, set, get } from 'firebase/database';
// import { database } from '@firebase';
// import { UserAuth } from './AuthContext';

// const PromptContext = createContext();

// const getNextMinute = () => {
//   const now = Date.now();
//   return now + 60 * 1000; // Add 1 minute in milliseconds
//   // return now + 24 * 60 * 60 * 1000;
// };

// export const PromptProvider = ({ children }) => {
//   const [promptCount, setPromptCount] = useState(0);
//   const [resetTime, setResetTime] = useState(null);
//   const { user } = UserAuth();

//   useEffect(() => {
//     const initializeData = async () => {
//       if (user?.uid) {
//         const userRef = ref(database, `prompts/${user.uid}`);
//         const snapshot = await get(userRef);
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           setPromptCount(data.promptCount || 0);
//           setResetTime(data.resetTime || getNextMinute());
//         } else {
//           const initialResetTime = getNextMinute();
//           setResetTime(initialResetTime);
//           await set(userRef, {
//             promptCount: 0,
//             resetTime: initialResetTime,
//             userId: user.uid,
//             email: user.email,
//           });
//         }
//       }
//     };

//     initializeData();
//   }, [user]);

//   useEffect(() => {
//     if (resetTime) {
//       const now = Date.now();
//       const delay = resetTime - now;

//       if (delay > 0) {
//         const timeout = setTimeout(() => {
//           const nextReset = getNextMinute();
//           setPromptCount(0);
//           setResetTime(nextReset);
//           if (user?.uid) {
//             const userRef = ref(database, `prompts/${user.uid}`);
//             set(userRef, {
//               promptCount: 0,
//               resetTime: nextReset,
//               userId: user.uid,
//               email: user.email,
//             });
//           }
//         }, delay);

//         return () => clearTimeout(timeout);
//       }
//     }
//   }, [resetTime, user]);

//   useEffect(() => {
//     if (user?.uid) {
//       const userRef = ref(database, `prompts/${user.uid}`);
//       set(userRef, {
//         promptCount,
//         resetTime, // Ensure resetTime is updated in Firebase on promptCount change
//         userId: user.uid,
//         email: user.email,
//       });
//     }
//   }, [promptCount, resetTime, user]);

//   return (
//     <PromptContext.Provider value={{ promptCount, setPromptCount }}>
//       {children}
//     </PromptContext.Provider>
//   );
// };

// export const usePrompt = () => React.useContext(PromptContext);

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
        const userRef = ref(database, `prompts/${user.uid}`);
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
          const userRef = ref(database, `prompts/${user.uid}`);
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
      const userRef = ref(database, `prompts/${user.uid}`);
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
