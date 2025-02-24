'use client';
import React, { createContext, useState, useEffect } from 'react';
import { ref, set, get } from 'firebase/database';
import { database } from '@firebase';
import { UserAuth } from './AuthContext';

const CompetitorPromptContext = createContext();

export const CompetitorPromptProvider = ({ children }) => {
  const [competitorPromptCount, setCompetitorPromptCount] = useState(0);
  const [competitorResetTime, setCompetitorResetTime] = useState(null);
  const { user } = UserAuth();

  const getNextMinute = () => Date.now() + 24 * 60 * 60 * 1000;

  useEffect(() => {
    const initializeData = async () => {
      if (user?.uid) {
        const userRef = ref(database, `competitorPromptCount/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          setCompetitorPromptCount(data.competitorPromptCount || 0);
          setCompetitorResetTime(data.competitorResetTime || getNextMinute());
        } else {
          const initialResetTime = getNextMinute();
          setCompetitorResetTime(initialResetTime);
          await set(userRef, {
            competitorPromptCount: 0,
            competitorResetTime: initialResetTime,
            userId: user.uid,
            email: user.email,
          });
        }
      }
    };

    initializeData();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (competitorResetTime && Date.now() >= competitorResetTime) {
        const nextReset = getNextMinute();
        setCompetitorPromptCount(0);
        setCompetitorResetTime(nextReset);

        if (user?.uid) {
          const userRef = ref(database, `competitorPromptCount/${user.uid}`);
          set(userRef, {
            competitorPromptCount: 0,
            competitorResetTime: nextReset,
            userId: user.uid,
            email: user.email,
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [competitorResetTime, user]);

  useEffect(() => {
    if (user?.uid) {
      const userRef = ref(database, `competitorPromptCount/${user.uid}`);
      set(userRef, {
        competitorPromptCount,
        competitorResetTime,
        userId: user.uid,
        email: user.email,
      });
    }
  }, [competitorPromptCount, competitorResetTime, user]);

  return (
    <CompetitorPromptContext.Provider value={{ competitorPromptCount, setCompetitorPromptCount }}>
      {children}
    </CompetitorPromptContext.Provider>
  );
};

export const useCompetitorPrompt = () => React.useContext(CompetitorPromptContext);
