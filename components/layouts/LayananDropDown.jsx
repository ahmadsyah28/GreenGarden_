'use client';

import { useState, useContext } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import AuthContext from '@/context/AuthContext';

const LayananDropdown = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (path) => {
    setIsOpen(false);
    router.push(path);
  };

  // Determine the base path based on authentication and role
  const basePath = isAuthenticated && user?.role === 'customer' 
    ? '/customer/layanan' 
    : '/layanan';

  return (
    <div className="relative inline-block group">
      <button
        onClick={toggleDropdown}
        className="flex items-center px-3 py-2 text-gray-700 hover:text-[#50806B] relative z-10 transition-colors duration-300"
      >
        Layanan
        <FaChevronDown
          className={`ml-1 h-4 w-4 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <span
        className="absolute bottom-0 left-0 h-0.5 bg-[#50806B] transition-all duration-300 w-0 group-hover:w-full"
      ></span>

      {isOpen && (
        <div className="absolute z-50 w-48 bg-white rounded-md shadow-lg mt-2">
          <div className="py-1">
            <button
              onClick={() => handleItemClick(`${basePath}/tanaman-hias`)}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-[#50806B]/10 hover:text-[#50806B] transition-colors duration-200"
            >
              Tanaman Hias
            </button>
            <button
              onClick={() => handleItemClick(`${basePath}/design-taman`)}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-[#50806B]/10 hover:text-[#50806B] transition-colors duration-200"
            >
              Desain Taman
            </button>
            <button
              onClick={() => handleItemClick(`${basePath}/perawatan-taman`)}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-[#50806B]/10 hover:text-[#50806B] transition-colors duration-200"
            >
              Perawatan Taman
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayananDropdown;