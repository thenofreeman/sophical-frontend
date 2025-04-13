import { useState } from 'react';
import { User, ChevronDown } from 'lucide-react';
import Link from './Link';

// Main Navbar component
export default function Navbar({ style = 'normal' }) {
  const [leftHovered, setLeftHovered] = useState(false);
  const [rightHovered, setRightHovered] = useState(false);

  // Navigation links data
  const navLinks = [
    { name: 'Discover', href: '#' },
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

  const getNavlinksStyle = (hoveredState: boolean) => {
    if (style !== 'normal') {
      return `transition-all duration-500 overflow-hidden whitespace-nowrap ${hoveredState ? 'max-w-lg opacity-100' : 'max-w-0 opacity-0 pointer-events-none'}`;
    }
    return "";
  }

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
          <div className="flex items-center justify-center w-6 h-6 bg-black rounded mr-2">
            <span className="text-white font-bold">S</span>
          </div>
        </div>
          <div className={`${getNavlinksStyle(leftHovered)} flex space-x-6 items-center`}>
            <a href='/'>
              <span className='font-semibold'>Sophical</span>
            </a>
            {navLinks.map((link, index) => (
              <Link key={index} href={link.href} >
                <span className={'text-base'}>
                  {link.name}
                </span>
              </Link>
            ))}
          </div>
      </div>

      {/* Right side - User profile */}
      <div
        className="flex items-center relative px-4 py-8 w-full justify-end"
        onMouseEnter={() => setRightHovered(true)}
        onMouseLeave={() => setRightHovered(false)}
      >
        {/* User Menu */}
        <div className={`${getNavlinksStyle(rightHovered)} flex space-x-6 items-center`}>
          {userMenuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              {item.name}
            </Link>
          ))}
          <button className='flex items-center'>
            <span className="font-semibold text-black">freeman</span>
            <ChevronDown size={16} className="text-gray-700" />
          </button>
        </div>
        <button className={`flex items-center ${getUserIconOpacity()} transition-opacity duration-300 ml-2`}>
          <User size={20} className="text-gray-700" />
        </button>
      </div>
    </nav>
  );
}
