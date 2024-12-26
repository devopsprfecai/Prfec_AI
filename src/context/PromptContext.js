// 'use client';
// import React, { createContext, useState, useEffect } from 'react';
// import { ref, set, get } from 'firebase/database';
// import { database } from '@firebase';
// import { UserAuth } from './AuthContext';

// const PromptContext = createContext();

// // Helper function to calculate the next midnight
// const getNextMidnight = () => {
//   const now = new Date();
//   const nextMidnight = new Date();
//   nextMidnight.setHours(24, 0, 0, 0); // Set to next midnight
//   return nextMidnight.getTime(); // Return timestamp for storage
// };

// export const PromptProvider = ({ children }) => {
//   const [promptCount, setPromptCount] = useState(0);
//   const [resetTime, setResetTime] = useState(() => {
//     const storedResetTime = localStorage.getItem('resetTime');
//     return storedResetTime ? new Date(Number(storedResetTime)) : getNextMidnight(); // Ensure consistency
//   });

//   const { user } = UserAuth(); // Get user info

//   // Fetch and initialize promptCount from Firebase if available
//   useEffect(() => {
//     const fetchPromptCount = async () => {
//       if (user?.uid) {
//         const userRef = ref(database, `usersData/${user.uid}/promptCount`);
//         const snapshot = await get(userRef);
//         if (snapshot.exists()) {
//           setPromptCount(snapshot.val());
//         }
//       }
//     };

//     fetchPromptCount();
//   }, [user]);

//   // Reset the prompt count at midnight
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = Date.now();
//       if (now > resetTime) {
//         setPromptCount(0); // Reset prompt count
//         const nextReset = getNextMidnight();
//         setResetTime(nextReset); // Update reset time
//         localStorage.setItem('resetTime', nextReset); // Persist reset time
//       }
//     }, 1000); // Check every second for better accuracy
  
//     return () => clearInterval(interval); // Clean up interval
//   }, [resetTime]);
  

//   // Persist prompt count in Firebase
//   useEffect(() => {
//     if (user?.uid) {
//       const userRef = ref(database, `usersData/${user.uid}/promptCount`);
//       set(userRef, promptCount);
//     }
//   }, [promptCount, user]);

//   // Persist prompt count in localStorage as fallback
//   useEffect(() => {
//     localStorage.setItem('promptCount', promptCount);
//   }, [promptCount]);

//   return (
//     <PromptContext.Provider value={{ promptCount, setPromptCount }}>
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

// const PromptContext = createContext();

// // Helper function to calculate the next 24-hour reset time
// const getNext24Hours = () => {
//   const now = Date.now(); // Current timestamp
//   return now + 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
// };

// export const PromptProvider = ({ children }) => {
//   const [promptCount, setPromptCount] = useState(0);
//   const [resetTime, setResetTime] = useState(() => {
//     const storedResetTime = localStorage.getItem('resetTime');
//     return storedResetTime ? new Date(Number(storedResetTime)) : getNext24Hours(); // Default to 24 hours from now
//   });
//   console.log(Date(Number(localStorage.getItem('resetTime'))) );
//   console.log(getNext24Hours());

//   const { user } = UserAuth(); // Get user info

//   // Fetch and initialize promptCount from Firebase if available
//   useEffect(() => {
//     const fetchPromptCount = async () => {
//       if (user?.uid) {
//         const userRef = ref(database, `usersData/${user.uid}/promptCount`);
//         const snapshot = await get(userRef);
//         if (snapshot.exists()) {
//           setPromptCount(snapshot.val());
//         }
//       }
//     };

//     fetchPromptCount();
//   }, [user]);

//   // Reset the prompt count every 24 hours
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const now = Date.now();
//       if (now > resetTime) {
//         setPromptCount(0); // Reset prompt count
//         const nextReset = getNext24Hours();
//         setResetTime(nextReset); // Update reset time
//         localStorage.setItem('resetTime', nextReset); // Persist reset time
//       }
//     }, 1000); // Check every second for better accuracy
  
//     return () => clearInterval(interval); // Clean up interval
//   }, [resetTime]);

//   // Persist prompt count in Firebase
//   useEffect(() => {
//     if (user?.uid) {
//       const userRef = ref(database, `usersData/${user.uid}/promptCount`);
//       set(userRef, promptCount);
//     }
//   }, [promptCount, user]);

//   // Persist prompt count in localStorage as fallback
//   useEffect(() => {
//     localStorage.setItem('promptCount', promptCount);
//   }, [promptCount]);

//   return (
//     <PromptContext.Provider value={{ promptCount, setPromptCount }}>
//       {children}
//     </PromptContext.Provider>
//   );
// };

// export const usePrompt = () => React.useContext(PromptContext);


// 'use client';
// import React, { createContext, useState, useEffect } from 'react';
// import { ref, set, get, serverTimestamp } from 'firebase/database';
// import { database } from '@firebase';
// import { UserAuth } from './AuthContext';

// const PromptContext = createContext();

// const getNext24Hours = () => {
//   const now = Date.now();
//   // return now + 24 * 60 * 60 * 1000;
//   return now + 60 * 1000; // Add 1 minute in milliseconds
// };

// export const PromptProvider = ({ children }) => {
//   const [promptCount, setPromptCount] = useState(0);
//   const [resetTime, setResetTime] = useState(null); // Initialize without default
//   const { user } = UserAuth();

//   useEffect(() => {
//     const initializeData = async () => {
//       if (user?.uid) {
//         const userRef = ref(database, `usersData/${user.uid}`);
//         const snapshot = await get(userRef);
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           setPromptCount(data.promptCount || 0);
//           setResetTime(data.resetTime || getNext24Hours());
//         } else {
//           const initialResetTime = getNext24Hours();
//           setResetTime(initialResetTime);
//           await set(userRef, { promptCount: 0, resetTime: initialResetTime });
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
//           const nextReset = getNext24Hours();
//           setPromptCount(0);
//           setResetTime(nextReset);
//           if (user?.uid) {
//             const userRef = ref(database, `usersData/${user.uid}`);
//             set(userRef, { promptCount: 0, resetTime: nextReset });
//           }
//         }, delay);

//         return () => clearTimeout(timeout);
//       }
//     }
//   }, [resetTime, user]);

//   useEffect(() => {
//     if (user?.uid) {
//       const userRef = ref(database, `usersData/${user.uid}/promptCount`);
//       set(userRef, promptCount);
//     }
//   }, [promptCount, user]);

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

const getNext24Hours = () => {
  const now = Date.now();
  return now + 24 * 60 * 60 * 1000;
};

export const PromptProvider = ({ children }) => {
  const [promptCount, setPromptCount] = useState(0);
  const [resetTime, setResetTime] = useState(null); // Initialize without default
  const { user } = UserAuth();

  useEffect(() => {
    const initializeData = async () => {
      if (user?.uid) {
        const userRef = ref(database, `prompts/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setPromptCount(data.promptCount || 0);
          setResetTime(data.resetTime || getNext24Hours());
        } else {
          const initialResetTime = getNext24Hours();
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
    if (resetTime) {
      const now = Date.now();
      const delay = resetTime - now;

      if (delay > 0) {
        const timeout = setTimeout(() => {
          const nextReset = getNext24Hours();
          setPromptCount(0);
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
        }, delay);

        return () => clearTimeout(timeout);
      }
    }
  }, [resetTime, user]);

  useEffect(() => {
    if (user?.uid) {
      const userRef = ref(database, `prompts/${user.uid}`);
      set(userRef, {
        promptCount,
        userId: user.uid,
        email: user.email,
      });
    }
  }, [promptCount, user]);

  return (
    <PromptContext.Provider value={{ promptCount, setPromptCount }}>
      {children}
    </PromptContext.Provider>
  );
};

export const usePrompt = () => React.useContext(PromptContext);
