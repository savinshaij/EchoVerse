"use client";
import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-1">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex">
            <a href="/" className="text-white text-xl font-bold">Team KaSaRa</a>
          </div>

          {/* Links for larger screens */}
          <div className="hidden md:flex justify-center items-center space-x-4">
            <a href="#home" className="text-white hover:text-gray-200">Home</a>
            <a href="#about" className="text-white hover:text-gray-200">About</a>
            <a href="#services" className="text-white hover:text-gray-200">Services</a>
            <a href="#contact" className="text-white border py-2 px-3 bg-slate-400 rounded-xl hover:text-gray-200">Logout</a>
          </div>

          {/* Hamburger Menu for smaller screens */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300"
            >
              {isOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-400">
          <a href="#home" className="block px-4 py-2 text-white hover:bg-blue-300">Home</a>
          <a href="#about" className="block px-4 py-2 text-white hover:bg-blue-300">About</a>
          <a href="#services" className="block px-4 py-2 text-white hover:bg-blue-300">Services</a>
          <a href="#contact" className="block px-4 py-2 text-white hover:bg-blue-300">Contact</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
