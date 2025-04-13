import React, { useState } from 'react';
import { Menu, User, Home, BookOpen, Code, Beaker, ChevronDown } from 'lucide-react';

// Main Navbar component
export default function Navbar({ size = 'normal', style = 'normal' }) {
  const [leftHovered, setLeftHovered] = useState(false);
  const [rightHovered, setRightHovered] = useState(false);

  // Navigation links data
  const navLinks = [
    { name: 'Home', icon: <Home size={18} /> },
    { name: 'Learn', icon: <BookOpen size={18} /> },
    { name: 'Develop', icon: <Code size={18} /> },
    { name: 'Research', icon: <Beaker size={18} /> }
  ];

  // User menu items
  const userMenuItems = [
    { name: 'Profile' },
    { name: 'Settings' },
    { name: 'Logout' }
  ];

  // Determine navbar height and styling based on size prop
  const getNavHeight = () => {
    return size === 'small' ? 'h-8' : 'h-12';
  };

  // Determine icon size based on navbar size
  const getIconSize = () => {
    return size === 'small' ? 16 : 20;
  };

  // Get navigation links container class
  const getNavLinksClass = () => {
    // Base classes that are always applied
    let classes = "transition-all duration-500 flex z-10";

    // Modify layout based on style
    if (style === 'normal') {
      classes += " ml-6 space-x-6 flex-row items-center";
    } else {
      classes += " absolute top-full left-0 mt-1 bg-white p-3 shadow-lg rounded-md flex-col space-y-3 origin-top-left";

      // Apply sliding animation based on hover state
      if (leftHovered) {
        classes += " opacity-100 translate-x-0";  // Visible and in final position
      } else {
        classes += " opacity-0 -translate-x-8 pointer-events-none";  // Hidden and shifted left (sliding effect)
      }
    }

    return classes;
  };

  // Determine styling for collapsed and minimal modes
  const getNavbarStyle = () => {
    if (style === 'normal') {
      return 'bg-white';
    } else if (style === 'collapsed') {
      return 'bg-white';
    } else if (style === 'minimal') {
      return 'bg-white';
    }
    return 'bg-white shadow-md';
  };

  // Logo opacity for minimal mode
  const getLogoOpacity = () => {
    if (style === 'minimal' && !leftHovered) {
      return 'opacity-40';
    }
    return 'opacity-100';
  };

  // Show the navigation links based on style
  const showNavLinks = () => {
    return style === 'normal' || (leftHovered && (style === 'collapsed' || style === 'minimal'));
  };

  return (
    <nav
      className={`w-full ${getNavHeight()} flex items-center justify-between px-4 ${getNavbarStyle()} transition-all duration-300`}
    >
      {/* Left side - Logo and navigation links */}
      <div className="flex items-center"
           onMouseEnter={() => setLeftHovered(true)}
           onMouseLeave={() => setLeftHovered(false)}>
        {/* Website Logo */}
        <div className={`mr-4 flex items-center transition-opacity duration-300 ${getLogoOpacity()}`}>
          <div className="flex items-center justify-center w-6 h-6 bg-black rounded">
            <span className="text-white font-bold">S</span>
          </div>
          {(style === 'normal' || leftHovered) && (
            <span className="ml-2 font-semibold text-black">Sophical</span>
          )}
        </div>

        {/* Navigation Links - Single implementation with conditional classes */}
        <div className={getNavLinksClass()}>
          {navLinks.map((link, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center text-gray-700 hover:text-black transition-colors whitespace-nowrap"
            >
              <span className="mr-2">{link.icon}</span>
              <span className={size === 'small' ? 'text-sm' : 'text-base'}>
                {link.name}
              </span>
            </a>
          ))}
        </div>
        {/* {/* Navigation Links */}
        {showNavLinks() && (
          <div
            className={`flex space-x-4 transition-all duration-300 ${leftHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none' }`}
          >
            {navLinks.map((link, index) => (
              <a
                key={index}
                href="#"
                className="flex items-center text-gray-700 hover:text-black transition-colors"
              >
                <span className="mr-1">{link.icon}</span>
                <span className={size === 'small' ? 'text-sm' : 'text-base'}>
                  {link.name}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Right side - User profile */}
      <div className="flex items-center"
        onMouseEnter={() => setRightHovered(true)}
        onMouseLeave={() => setRightHovered(false)}>
        <div className="relative group">
          <button className={`flex items-center ${getLogoOpacity()} transition-opacity duration-300`}>
            <User size={getIconSize()} className="text-gray-700" />
            {(style === 'normal' || rightHovered) && (
              <>
                <span className="ml-2 text-gray-700">User</span>
                <ChevronDown size={16} className="ml-1 text-gray-700" />
              </>
            )}
          </button>

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
            <div className="py-1">
              {userMenuItems.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
