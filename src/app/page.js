'use client';  // Indicate that this file is client-side
import '@styles/ai/Dashboard.css';
import '@styles/prfec-chat-ai/ChatAi.css';

import React from 'react';
import dynamic from 'next/dynamic';
import { UserAuth } from '@context/AuthContext';
import '@styles/ai/BetaAi.css'
// import PrfecAi from '@components/prfec-chat-ai/PrfecAi';

// Dynamically import the PuterChat and Login components
const PrfecAi = dynamic(() => import('@components/prfec-chat-ai/PrfecAi'), { ssr: false });
// const Login = dynamic(() => import('@components/auth/login/Login'), { ssr: false });
const Signin = dynamic(() => import('@components/auth/signup/signup'), { ssr: false });

const Page = () => {
  const { user } = UserAuth();
  const currentPath ='/'
  return user ? <PrfecAi currentPath={currentPath} /> : <Signin />;

}

export default Page;

