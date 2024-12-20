'use client';
import React, { useState } from 'react';
import '@styles/ai/settings/Settings.css';
import Image from 'next/image';
import drop from '@public/Images/ai/settings/drop.svg';
import system from '@public/Images/ai/settings/system.svg';
import light from '@public/Images/ai/settings/light.svg';
import dark from '@public/Images/ai/settings/dark.svg';
import key from '@public/Images/ai/settings/key.svg';

const General = () => {
  const [themeClick, setThemeClick] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('System'); // Default theme

  const handleThemeChangeClick = () => {
    setThemeClick(!themeClick);
  };

  const handleThemeSelection = (theme) => {
    setSelectedTheme(theme); // Update selected theme
    setThemeClick(false); // Close dropdown after selection
  };

  return (
    <div className="settings-general-contents">
      <div className="settings-general-theme">
        <p>Theme</p>
        <div className="theme-change" onClick={handleThemeChangeClick}>
          {selectedTheme} {/* Display selected theme */}
          <Image src={drop} width={16} height={16} alt="dropdown icon" />

          {themeClick && (
            <div className="theme-change-contents">
              <div className="system" onClick={() => handleThemeSelection('System')}>
                <Image src={system} width={16} height={16} alt="system" />
                System
              </div>
              <div className="light" onClick={() => handleThemeSelection('Light')}>
                <Image src={light} width={16} height={16} alt="light mode" />
                Light
              </div>
              <div className="dark" onClick={() => handleThemeSelection('Dark')}>
                <Image src={dark} width={16} height={16} alt="dark mode" />
                Dark
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="settings-general-language">
        <p>Language</p>
        <div className="language-change">
          English
          <Image src={drop} width={16} height={16} alt="dropdown" />
        </div>
      </div>
      <div className="settings-general-shared-links">
        <p>Shared links</p>
        <div className="shared-links">Manage</div>
      </div>
      <div className="settings-general-api">
        <p>API access</p>
        <div className="api-access">
          <Image src={key} width={16} height={16} alt="api key" />
          Get API key
        </div>
      </div>
    </div>
  );
};

export default General;
