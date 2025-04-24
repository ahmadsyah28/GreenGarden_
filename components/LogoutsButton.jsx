// components/LogoutButton.jsx
'use client';

import { useContext } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import AuthContext from '@/context/AuthContext';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center text-red-600 hover:bg-red-50 px-4 py-2 rounded-md"
    >
      <FaSignOutAlt className="mr-2" />
      Logout
    </button>
  );
};

export default LogoutButton;