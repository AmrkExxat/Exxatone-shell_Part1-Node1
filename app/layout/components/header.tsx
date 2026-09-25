'use client';

import { faMoon, faSun } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';

const Header = () => {
  const [isDarkModeChecked, setIsDarkModeChecked] = useState<boolean>(false);

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkModeChecked);
  }, [isDarkModeChecked]);

  const handleThemeModeChange = (event: any) => {
    const { checked } = event.target;
    setIsDarkModeChecked(checked);
  };

  return (
    <div className="bg-card sticky inset-x-0 top-0 z-30 w-full border-b border-gray-200 transition-all dark:border-white">
      <div className="flex h-[47px] items-center justify-end px-4">
        <div className="mt-1 mr-4">
          <input
            type="checkbox"
            className="checkbox"
            id="checkbox"
            onChange={handleThemeModeChange}
          />
          <label htmlFor="checkbox" className="checkbox-label dark:bg-hover shadow-md">
            <FontAwesomeIcon icon={faMoon} className="h-3 w-3" />
            <FontAwesomeIcon icon={faSun} className="h-3 w-3" />
            <span className="ball"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Header;
