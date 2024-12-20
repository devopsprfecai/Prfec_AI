"use client"; // Make this component run on the client side only

import { Navbar } from './Navbar';
import { NavbarWhite } from './NavbarWhite';
import { usePathname } from 'next/navigation';
import { UserAuth } from '@context/AuthContext';  // Import UserAuth to access the user state

export default function ConditionalNavbar() {
  const { user } = UserAuth();  // Access the user state from the context
  const pathname = usePathname();
  const footerHiddenPaths = ['/ai','/content-generation-ai','/login','/signup'];

  // Return nothing (null) if the user is not authenticated
  if (!user) return null;

  // Show the navbar if the pathname is not in the list of paths to hide it
  return !footerHiddenPaths.includes(pathname) ? <NavbarWhite /> : <NavbarWhite />;
}
