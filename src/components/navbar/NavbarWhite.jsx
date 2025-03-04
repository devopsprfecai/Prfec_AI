'use client';
import React, { useState, useEffect, useRef } from 'react';
import '@styles/navbar/NavbarWhite.css';
import Image from 'next/image';
// import Logo from '@public/Images/ai/nohover.svg';
import whiteLogo from '@public/Images/navbar/Prfec Logo White.svg'
import blackLogo from '@public/Images/navbar/prfec-logo.svg'
import { useTheme } from "next-themes";

import Hamburger from '@public/Images/navbar/hamburger.png';
import Close from '@public/Images/navbar/close.png';
import { UserAuth } from '@context/AuthContext';
import { useRouter, usePathname } from "next/navigation";
import Link from 'next/link';
import { CgProfile } from "react-icons/cg";
import { RiMenu4Fill } from "react-icons/ri";
import AiDashboard from '@components/ai/Dashboard';

export const NavbarWhite = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [themeClick, setThemeClick] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); 
  const menuRef = useRef(null);
  const settingsRef = useRef(null);
  const { user, logOut, loading } = UserAuth();
  const { theme , systemTheme } = useTheme();
  const dashboardRef = useRef(null);


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

  const handleMenuOpen = () => {
    setMenuOpen(!menuOpen);
  };

  if (loading) return null;
  const currentTheme = theme === "system" ? systemTheme : theme;
  const Logo = currentTheme === "dark" ? whiteLogo : blackLogo;

  // const Logo = theme === "dark" ? whiteLogo : blackLogo;

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => handleNavigation("/")}>
          <Image className="prfec-logo" src={Logo} alt="Logo" height={20} />
        </div>
        <div className="navbar-contents">
          <Link href='https://business.prfec.ai/'>Services</Link>
          <Link href='https://blog.prfec.ai/'>Resources</Link>
          <Link href='/pricing'>Pricing</Link>

          {/* <div className="navbar-contents-image">
            <Image src={bell} width={16} height={16} alt="notification" />
          </div> */}
          <div className="navbar-contents-image" onClick={handleDropDown}>
            {/* <Image src={profile} width={16} height={16} alt="profile" /><Image src={drop} width={12} alt="dropdown" /> */}
            <CgProfile  style={{color:"var(--dashboard-h-color)",width:"22px",height:"22px"}}/>

          </div>
          {hover && (
            <div className="navbar-profile-dropdown" ref={menuRef}>
              <div className="settings" onClick={() => handleNavigation("/settings/profile")}>Settings</div>
              {/* <div className="appearance" onClick={handleThemeClick}>Appearance {themeClick && <Theme />}</div>
              <div className="help">Help</div> */}
              <div className="pricing" onClick={() => handleNavigation("/pricing")}>Pricing</div>
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
              <div className="pricing" onClick={() => handleNavigation("/pricing")}>Pricing</div>
              <div className='' onClick={handleLogOut}>Logout</div>
            </div>
          </div>
        )}
      </div>

      <div className='prfec-chat-dashboard-hamburger' >
        {/* Menu icon always visible on mobile */}
        <RiMenu4Fill
          className='prfec-chat-dashboard-menu-icon'
          onClick={handleMenuOpen}
          style={{ color: "var(--p-color)",width:"24px",height:"24px" }}
        />
                  <Link href='/settings/profile'> <CgProfile  style={{color:"var(--dashboard-h-color)",width:"22px",height:"22px"}}/></Link> 


        {/* Show AiDashboard only for mobile (width <= 800px) and when menuOpen is true */}
        {menuOpen && (
          <div className='prfec-chat-dashboard-mobile' ref={dashboardRef}>
            <AiDashboard menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          </div>
        )}
      </div>
    </div>
  );
};