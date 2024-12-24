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


'use client';
import React, { createContext, useState, useEffect } from 'react';
import { ref, set, get } from 'firebase/database';
import { database } from '@firebase';
import { UserAuth } from './AuthContext';

const PromptContext = createContext();

// Helper function to calculate the next 24-hour reset time
const getNext24Hours = () => {
  const now = Date.now(); // Current timestamp
  return now + 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
};

export const PromptProvider = ({ children }) => {
  const [promptCount, setPromptCount] = useState(0);
  const [resetTime, setResetTime] = useState(() => getNext24Hours());
  const { user } = UserAuth(); // Get user info

  // Fetch and initialize promptCount and resetTime from Firebase for the current user
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const userRef = ref(database, `usersData/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setPromptCount(userData.promptCount || 0);
          setResetTime(userData.resetTime || getNext24Hours());
        } else {
          // Initialize for new user
          const initialResetTime = getNext24Hours();
          setResetTime(initialResetTime);
          await set(userRef, { promptCount: 0, resetTime: initialResetTime });
        }
      } else {
        // Reset states if no user is logged in
        setPromptCount(0);
        setResetTime(getNext24Hours());
      }
    };

    fetchUserData();
  }, [user]);

  // Reset the prompt count every 24 hours
  useEffect(() => {
    if (user?.uid) {
      const interval = setInterval(() => {
        const now = Date.now();
        if (now > resetTime) {
          const nextReset = getNext24Hours();
          setPromptCount(0); // Reset prompt count
          setResetTime(nextReset); // Update reset time
          // Update Firebase for the current user
          const userRef = ref(database, `usersData/${user.uid}`);
          set(userRef, { promptCount: 0, resetTime: nextReset });
        }
      }, 1000); // Check every second for better accuracy

      return () => clearInterval(interval); // Clean up interval
    }
  }, [resetTime, user]);

  // Persist prompt count in Firebase whenever it changes
  useEffect(() => {
    if (user?.uid) {
      const userRef = ref(database, `usersData/${user.uid}/promptCount`);
      set(userRef, promptCount);
    }
  }, [promptCount, user]);

  return (
    <PromptContext.Provider value={{ promptCount, setPromptCount }}>
      {children}
    </PromptContext.Provider>
  );
};

export const usePrompt = () => React.useContext(PromptContext);
