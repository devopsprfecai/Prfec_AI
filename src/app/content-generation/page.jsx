'use client';  // Indicate that this file is client-side
import '@styles/ai/Dashboard.css';

import React from 'react';
import PuterChat from '@components/ai/ContentGenAi';
import '@styles/ai/BetaAi.css'


const page = () => {
      const currentPath ='/content-generation'
  return (
    <PuterChat currentPath={currentPath} />
  )
}

export default page


