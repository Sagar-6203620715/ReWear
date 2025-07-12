import React from 'react';
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const Topbar = () => {
  return (
    <div className="bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center py-2 px-4">
        {/* Social Links */}
        <div className="hidden md:flex items-center space-x-4 mb-2 sm:mb-0">
          <a 
            href="#" 
            className="hover:text-blue-400 transition-colors duration-200"
            aria-label="Follow us on Meta"
          >
            <TbBrandMeta className="h-5 w-5" />
          </a>
          <a 
            href="#" 
            className="hover:text-pink-400 transition-colors duration-200"
            aria-label="Follow us on Instagram"
          >
            <IoLogoInstagram className="h-5 w-5" />
          </a>
          <a 
            href="#" 
            className="hover:text-gray-300 transition-colors duration-200"
            aria-label="Follow us on Twitter"
          >
            <RiTwitterXLine className="h-4 w-4" />
          </a>
        </div>
        
        {/* Tagline */}
        <div className="text-xs sm:text-sm text-center flex-grow px-2">
          <span className="font-medium">
            Sustainable Fashion Through Community Clothing Exchange
          </span>
        </div>
        
        {/* Contact Info */}
        <div className="text-xs sm:text-sm hidden md:block">
          <a 
            href="tel:+919876543210" 
            className="hover:text-blue-400 transition-colors duration-200"
            aria-label="Call us at +91 987-654-3210"
          >
            +91 987-654-3210
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;