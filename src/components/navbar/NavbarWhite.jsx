'use client';
import React, { useState, useEffect, useRef } from 'react';
import '@styles/navbar/NavbarWhite.css';
import Image from 'next/image';
import Logo from '@public/Images/ai/nohover.svg';
import Hamburger from '@public/Images/navbar/hamburger.png';
import Close from '@public/Images/navbar/close.png';
import DefaultProfile from '@public/Images/navbar/default.svg';
import profile from '@public/Images/ai/profile.svg';
import bell from '@public/Images/ai/bell.svg';
import drop from '@public/Images/ai/drop.svg';
import Theme from './Theme';
import { UserAuth } from '@context/AuthContext';
import { useRouter, usePathname } from "next/navigation";
import Link from 'next/link';
export const NavbarWhite = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [themeClick, setThemeClick] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); 
  const menuRef = useRef(null);
  const settingsRef = useRef(null);
  const { user, logOut, loading } = UserAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if ((settingsRef.current && !settingsRef.current.contains(event.target) && !event.target.closest('.settings')) || (menuRef.current && !menuRef.current.contains(event.target))) {
        setHover(false);
        setMenuOpen(false);
        setThemeClick(false); // Explicitly close menu when clicking outside
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close the menu when the pathname changes
  useEffect(() => {
    setMenuOpen(false);
    setHover(false); // Also reset hover state
    setThemeClick(false); // Reset theme click state
  }, [pathname]);

  const handleMenuClick = () => setMenuOpen(!menuOpen);
  const handleDropDown = () => setHover(!hover);
  const handleThemeClick = () => setThemeClick(!themeClick);
  const handleLogOut = async () => {
    try {
      await logOut();
      setHover(false);
      setMenuOpen(false); // Explicitly close menu on logout
      router.push("/");
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  // Handle navigation instead of Link
  const handleNavigation = (path) => {
    setMenuOpen(false); // Explicitly close menu on navigation
    setHover(false); // Close dropdown
    setThemeClick(false); // Close theme menu
    router.push(path); // Navigate to the specified path
  };

  if (loading) return null;

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => handleNavigation("/")}>
          <Image className="prfec-logo" src={Logo} alt="Logo" />
        </div>
        <div className="navbar-contents">
          <div className="navbar-contents-image">
            <Image src={bell} width={16} height={16} alt="notification" />
          </div>
          <div className="navbar-contents-image" onClick={handleDropDown}>
            <Image src={profile} width={16} height={16} alt="profile" /><Image src={drop} width={12} alt="dropdown" />
          </div>
          {hover && (
            <div className="navbar-profile-dropdown" ref={menuRef}>
              <div className="settings" onClick={() => handleNavigation("/settings/profile")}>Settings</div>
              {/* <div className="appearance" onClick={handleThemeClick}>Appearance {themeClick && <Theme />}</div>
              <div className="help">Help</div> */}
              <div onClick={handleLogOut}>Logout</div>
            </div>
          )}
        </div>

        <div className="navbar-menu-icons">
          {!menuOpen && <Image src={Hamburger} alt="Menu" onClick={handleMenuClick} />}
          {menuOpen && <Image src={Close} alt="Close" onClick={handleMenuClick} />}
        </div>
        {menuOpen && (
          <div ref={menuRef} className="navbar-menu">
            {/* <div className="settings" onClick={() => handleNavigation("/settings/general")}>Settings</div>
            <div className="appearance" onClick={handleThemeClick}>Appearance {themeClick && <Theme />}</div>
            <div className="help">Help</div>
            <div onClick={handleLogOut}>Logout</div> */}
            <p>Tools</p>
            <Link href='/'>Content Generation</Link>
            <Link href='/keyword'>Keyword Research</Link>
            <Link href='/competitor'>Competitor Analysis</Link>
            <div className='navbar-menu-contents'>
              <div className="settings" onClick={() => handleNavigation("/settings/profile")}>Settings</div>
              <div className='' onClick={handleLogOut}>Logout</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};