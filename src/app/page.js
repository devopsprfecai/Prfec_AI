'use client';  // Indicate that this file is client-side

import React from 'react';
import dynamic from 'next/dynamic';
import { UserAuth } from '@context/AuthContext';
import '@styles/ai/BetaAi.css'

// Dynamically import the PuterChat and Login components
const PuterChat = dynamic(() => import('@components/ai/ContentGenAi'), { ssr: false });
// const Login = dynamic(() => import('@components/auth/login/Login'), { ssr: false });
const Signin = dynamic(() => import('@components/auth/signup/signup'), { ssr: false });

const Page = () => {
  const { user } = UserAuth();
  const currentPath ='/'
  return user ? <PuterChat currentPath={currentPath} /> : <Signin />;

}

export default Page;

