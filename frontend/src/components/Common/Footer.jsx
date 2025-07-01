import React, { useState } from 'react';
import { IoLogoInstagram } from 'react-icons/io';
import { RiTwitterXLine } from 'react-icons/ri';
import { TbBrandMeta } from 'react-icons/tb';
import { FiPhoneCall, FiMail, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // TODO: Implement newsletter subscription
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const categories = [
    { name: 'Competitive Exams', path: '/competitive_exams' },
    { name: 'Tech', path: '/tech' },
    { name: 'Skills', path: '/skills' },
    { name: 'School', path: '/school' }
  ];

  const supportLinks = [
    { name: 'Contact Us', path: '/contact' },
    { name: 'About Us', path: '/about' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Features', path: '/features' }
  ];

  const socialLinks = [
    { icon: TbBrandMeta, href: 'https://facebook.com', label: 'Facebook' },
    { icon: IoLogoInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: RiTwitterXLine, href: 'https://twitter.com', label: 'Twitter' }
  ];

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Newsletter Section */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Be the first to hear about new courses, exclusive events, and special offers.
            </p>
            <p className="font-medium text-sm text-blue-400 mb-6">
              Sign up and get 10% off your first course!
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-600 rounded-l-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-r-md transition-colors duration-200"
                >
                  Subscribe
                </button>
              </div>
              {isSubscribed && (
                <p className="text-green-400 text-sm">Thank you for subscribing!</p>
              )}
            </form>
          </div>

          {/* Categories Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link 
                    to={category.path} 
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4 mb-6">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300 text-sm">
                <FiPhoneCall className="mr-2 h-4 w-4" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors duration-200">
                  +91 987-654-3210
                </a>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <FiMail className="mr-2 h-4 w-4" />
                <a href="mailto:info@coursify.com" className="hover:text-white transition-colors duration-200">
                  info@coursify.com
                </a>
              </div>
              <div className="flex items-start text-gray-300 text-sm">
                <FiMapPin className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2025 Coursify. All Rights Reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;