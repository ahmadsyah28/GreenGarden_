"use client";

import { useState, useEffect, useContext } from "react";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import Link from "next/link";
import AuthContext from '@/context/AuthContext';
import LayananDropdown from "./LayananDropDown";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("beranda");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  // Arahkan admin ke dashboard admin, bukan tampilan customer
  if (isAuthenticated && user?.role === 'admin') {
    return null; // Admin menggunakan sidebar, bukan navbar
  }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-white/80 backdrop-blur-md shadow-lg" 
        : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo with gradient effect */}
          <Link href="/" className="relative flex items-center ml-4 md:ml-20 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#50806B]/50 to-[#6A9B85]/50 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-1000"></div>
            <span className="relative text-2xl font-bold bg-gradient-to-r from-[#50806B] to-[#6A9B85] bg-clip-text text-transparent">
              Green<span className="bg-gradient-to-r from-[#404041] to-[#5C5C5D] bg-clip-text text-transparent">Garden</span>
            </span>
          </Link>
          
          {/* Navigation Items with animated underline effect */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-10 mr-4 md:mr-20">
            <Link 
              href="/" 
              className="relative overflow-hidden group px-3 py-2 text-gray-700"
              onClick={() => setActiveItem("beranda")}
            >
              <span className={`relative z-10 transition-colors duration-300 ${
                activeItem === "beranda" ? "text-[#50806B] font-semibold" : "group-hover:text-[#50806B]"
              }`}>
                Beranda
              </span>
              <span className={`absolute bottom-0 left-0 h-0.5 bg-[#50806B] transition-all duration-300 ${
                activeItem === "beranda" ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
            
            {/* Layanan Dropdown - with custom styling */}
            <div className="relative group">
              {/* You can integrate your existing LayananDropdown component here */}
              <LayananDropdown />
            </div>
            
            <Link 
              href="/blog" 
              className="relative overflow-hidden group px-3 py-2 text-gray-700"
              onClick={() => setActiveItem("blog")}
            >
              <span className={`relative z-10 transition-colors duration-300 ${
                activeItem === "blog" ? "text-[#50806B] font-semibold" : "group-hover:text-[#50806B]"
              }`}>
                Blog
              </span>
              <span className={`absolute bottom-0 left-0 h-0.5 bg-[#50806B] transition-all duration-300 ${
                activeItem === "blog" ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link>
            
            {/* <Link 
              href="/kontak" 
              className="relative overflow-hidden group px-3 py-2 text-gray-700"
              onClick={() => setActiveItem("kontak")}
            >
              <span className={`relative z-10 transition-colors duration-300 ${
                activeItem === "kontak" ? "text-[#50806B] font-semibold" : "group-hover:text-[#50806B]"
              }`}>
                Kontak
              </span>
              <span className={`absolute bottom-0 left-0 h-0.5 bg-[#50806B] transition-all duration-300 ${
                activeItem === "kontak" ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </Link> */}
            
            {/* Shopping Cart with subtle animation */}
            <Link 
              href={isAuthenticated ? "/customer/keranjang" : "/register"} 
              className="relative group p-2 text-gray-700"
              aria-label="Shopping Cart"
            >
              <span className="absolute inset-0 w-full h-full transition duration-300 rounded-full group-hover:bg-[#50806B]/10"></span>
              <FaShoppingCart className="relative z-10 text-xl group-hover:text-[#50806B] transition-colors duration-300" />
              {!isAuthenticated && (<span className="absolute -top-1 -right-1 w-4 h4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"></span>)}
            </Link>
            
            {/* Conditional rendering based on authentication status */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={toggleProfileMenu}
                  className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#50806B]/10 hover:bg-[#50806B]/20 transition-all duration-300"
                >
                  <FaUser className="text-[#50806B]" />
                </button>
                
                {/* Profile dropdown menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-700">Hello, {user?.name || 'Customer'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                    </div>
                    
                    <Link 
                      href="/customer/profil" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Profil Saya
                    </Link>
                    
                    <Link 
                      href="/customer/orders" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Pesanan Saya
                    </Link>
                    
                    {/* Admin Dashboard Link (hanya muncul jika user adalah admin) */}
                    {user?.role === 'admin' && (
                      <Link 
                        href="/admin/dashboard" 
                        className="block px-4 py-2 text-sm text-[#50806B] hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <FaTachometerAlt className="mr-2" />
                          Admin Dashboard
                        </div>
                      </Link>
                    )}
                    
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="relative inline-flex items-center justify-center p-4 px-6 py-2 overflow-hidden font-medium text-[#50806B] transition duration-300 ease-out border-2 border-[#50806B] rounded-full shadow-md group"
              >
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-[#50806B] group-hover:translate-x-0 ease">
                  <span>Masuk</span>
                </span>
                <span className="absolute flex items-center justify-center w-full h-full text-[#50806B] transition-all duration-300 transform group-hover:translate-x-full ease">Masuk</span>
                <span className="relative invisible">Masuk</span>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center mr-4">
            <button className="outline-none p-2 rounded-md hover:bg-gray-100">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;