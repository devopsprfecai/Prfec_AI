'use client';
import React, { createContext, useState, useEffect } from 'react';
import { ref, set, get } from 'firebase/database';
import { database } from '@firebase';
import { UserAuth } from './AuthContext';

const KeywordPromptContext = createContext();

const getNextMinute = () => {
  const now = Date.now();
  // return now + 60 * 1000; // Add 1 minute in milliseconds
  return now + 24 * 60 * 60 * 1000;
};
export const KeywordPromptProvider = ({ children }) => {
    const [keywordPromptCount, setKeywordPromptCount] = useState(0);
    const [KeywordresetTime, setKeywordResetTime] = useState(null);
    const { user } = UserAuth();
  
    useEffect(() => {
      const initializeData = async () => {
        if (user?.uid) {
          const userRef = ref(database, `keywordPromptCount/${user.uid}`);
          const snapshot = await get(userRef);
  
          if (snapshot.exists()) {
            const data = snapshot.val();
            setKeywordPromptCount(data.keywordPromptCount || 0);
            setKeywordResetTime(data.KeywordresetTime || getNextMinute());
          } else {
            const initialKeywordResetTime = getNextMinute();
            setKeywordResetTime(initialKeywordResetTime);
            await set(userRef, {
              keywordPromptCount: 0,
              KeywordresetTime: initialKeywordResetTime,
              userId: user.uid,
              email: user.email,
            });
          }
        }
      };
  
      initializeData();
    }, [user]);
  
    useEffect(() => {
      const checkKeywordResetTime = () => {
        if (KeywordresetTime && Date.now() >= KeywordresetTime) {
          const nextReset = getNextMinute();
          setKeywordPromptCount(0);
          setKeywordResetTime(nextReset);
  
          if (user?.uid) {
            const userRef = ref(database, `keywordPromptCount/${user.uid}`);
            set(userRef, {
              keywordPromptCount: 0,
              KeywordresetTime: nextReset,
              userId: user.uid,
              email: user.email,
            });
          }
        }
      };
  
      const interval = setInterval(checkKeywordResetTime, 1000);
  
      return () => clearInterval(interval);
    }, [KeywordresetTime, user]);
  
    useEffect(() => {
      if (user?.uid) {
        const userRef = ref(database, `keywordPromptCount/${user.uid}`);
        set(userRef, {
          keywordPromptCount,
          KeywordresetTime,
          userId: user.uid,
          email: user.email,
        });
      }
    }, [keywordPromptCount, KeywordresetTime, user]);
  
    return (
      <KeywordPromptContext.Provider
        value={{ keywordPromptCount, setKeywordPromptCount }}
      >
        {children}
      </KeywordPromptContext.Provider>
    );
  };
  export const useKeyPrompt = () => React.useContext(KeywordPromptContext);
