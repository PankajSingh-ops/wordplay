"use client"
import React from 'react';
import Link from 'next/link';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  AutoAwesome,
  Menu as MenuIcon,
  Home,
  Info,
  ContactSupport
} from '@mui/icons-material';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const navItems = [
    { label: 'Home', icon: <Home />, path: '/' },
    { label: 'About', icon: <Info />, path: '/about' },
    { label: 'Contact', icon: <ContactSupport />, path: '/contact' }
  ];

  return (
    <header className="bg-gradient-to-r from-pink-500 to-purple-600">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <AutoAwesome className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white">WORD PLAY</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.path}
                className="flex items-center space-x-1 text-white hover:text-pink-200 transition-colors duration-200"
              >
                <span className="text-sm">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {isMobile && (
            <button className="text-white p-2">
              <MenuIcon className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;