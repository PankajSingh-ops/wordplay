import React from 'react';
import {
  Instagram,
  Favorite,
  Create,
  AutoAwesome
} from '@mui/icons-material';

const Footer = () => {
  const socialLinks = [
    { icon: <Instagram />, label: 'Instagram' },
    { icon: <Favorite />, label: 'Like' },
    { icon: <Create />, label: 'Blog' }
  ];

  const quickLinks = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Contact Us', path: '/contact' }
  ];

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <AutoAwesome className="text-pink-400" />
              <h3 className="text-xl font-bold">Word Play</h3>
            </div>
            <p className="text-gray-400">
              Create, generate, and play with words in creative ways.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.path}
                    className="text-gray-400 hover:text-pink-400 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <button
                  key={social.label}
                  className="p-2 text-gray-400 hover:text-pink-400 transition-colors duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Word Play. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;