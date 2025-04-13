import { useState } from 'react';
import { User, ChevronDown } from 'lucide-react';

// Main Navbar component
export default function Navbar({ style = 'normal' }) {
  const [leftHovered, setLeftHovered] = useState(false);
  const [rightHovered, setRightHovered] = useState(false);

  // Navigation links data
  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Learn', href: '#' },
    { name: 'Develop', href: '#' },
    { name: 'Research', href: '#' }
  ];

  // User menu items
  const userMenuItems = [
    { name: 'Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Logout', href: '#' }
  ];

  // Logo opacity for minimal mode
  const getLogoOpacity = () => {
    if (style === 'minimal' && !leftHovered) {
      return 'opacity-40';
    }
    return 'opacity-100';
  };

  // User icon opacity for minimal mode
  const getUserIconOpacity = () => {
    if (style === 'minimal' && !rightHovered) {
      return 'opacity-40';
    }
    return 'opacity-100';
  };

  return (
    <nav className={`w-full h-12 flex items-center justify-between bg-white transition-all duration-300`}>
      {/* Left side - Logo and navigation links */}
      <div
        className="flex items-center relative px-4 py-8 w-full"
        onMouseEnter={() => setLeftHovered(true)}
        onMouseLeave={() => setLeftHovered(false)}
      >
        {/* Website Logo */}
        <div className={`flex items-center transition-opacity duration-300 ${getLogoOpacity()}`}>
          <div className="flex items-center justify-center w-6 h-6 bg-black rounded">
            <span className="text-white font-bold">S</span>
          </div>
        </div>

        {/* Navigation Links - Inline with logo */}
        {style === 'normal' && (
          <div className="flex space-x-6 items-center">
            <a href='/' className="ml-2 font-semibold text-black">Sophical</a>
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="flex items-center text-gray-700 hover:text-black transition-colors"
              >
                <span className={'text-base'}>
                  {link.name}
                </span>
              </a>
            ))}
          </div>
        )}

        {/* Navigation Links - Sliding out for collapsed/minimal */}
        {style !== 'normal' && (
          <div className={`
            transition-all duration-500 flex items-center space-x-6 pl-6
            overflow-hidden whitespace-nowrap
            ${leftHovered ? 'max-w-lg opacity-100' : 'max-w-0 opacity-0 pointer-events-none'}
          `}>
            <span className="font-semibold text-black">Sophical</span>
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="flex items-center text-gray-700 hover:text-black transition-colors"
              >
                <span className={'text-base'}>
                  {link.name}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Right side - User profile */}
      <div
        className="flex items-center relative px-4 py-8 w-full justify-end"
        onMouseEnter={() => setRightHovered(true)}
        onMouseLeave={() => setRightHovered(false)}
      >
        {/* User Menu */}
        {style === 'normal' && (
          <div className="ml-6 flex space-x-6 items-center">
            {userMenuItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className="flex items-center text-gray-700 hover:text-black transition-colors"
              >
                {item.name}
              </a>
            ))}
            <button className='flex items-center mr-2'>
              <span className="font-semibold text-black">freeman</span>
              <ChevronDown size={16} className="text-gray-700" />
            </button>
          </div>
        )}
        {style !== 'normal' && (
          <div className={`
          transition-all duration-500 flex items-center space-x-6 pl-6
          overflow-hidden whitespace-nowrap
          ${rightHovered ? 'max-w-lg opacity-100' : 'max-w-0 opacity-0 pointer-events-none'}
        `}>
            {userMenuItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className="flex items-center text-gray-700 hover:text-black transition-colors"
              >
                {item.name}
              </a>
            ))}
            <button className='flex items-center mr-2'>
              <span className="font-semibold text-black">freeman</span>
              <ChevronDown size={16} className="text-gray-700" />
            </button>
          </div>)}
        <button className={`flex items-center ${getUserIconOpacity()} transition-opacity duration-300`}>
          <User size={20} className="text-gray-700" />
        </button>
      </div>
    </nav>
  );
}
