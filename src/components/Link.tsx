import React, { useState } from 'react';

type LinkProps = {
  children: React.ReactNode,
  href: string,
};

export default function Link({ children, href }: LinkProps ) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      className="relative text-gray-700 hover:text-black no-underline transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      { children }
      <span
        className={`absolute left-0 bottom-0 h-0.5 bg-black transition-all duration-300 ease-in-out ${
          isHovered ? 'w-full' : 'w-0'
        }`}
      />
    </a>
  );
}
