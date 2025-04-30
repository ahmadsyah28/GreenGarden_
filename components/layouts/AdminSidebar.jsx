"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthContext from '@/context/AuthContext';
import { 
  FaHome, 
  FaUsers, 
  FaBlog, 
  FaBoxes, 
  FaClipboardList, 
  FaBars, 
  FaTimes,
  FaHands,
  FaLeaf,
  FaPaintBrush,
  FaSignOutAlt
} from "react-icons/fa";

const AdminSidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  
  // Handle logout function
  const handleLogout = () => {
    logout();
  };

  // Check if current route is active
  const isActive = (path) => {
    return pathname === path;
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    // Initial check
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar on mobile
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Menu items configuration
  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaHome className="text-xl" />,
      path: "/admin/dashboard",
    },
    {
      name: "Kelola Pengguna",
      icon: <FaUsers className="text-xl" />,
      path: "/admin/users",
    },
    {
      name: "Kelola Blog",
      icon: <FaBlog className="text-xl" />,
      path: "/admin/blog",
    },
    {
      name: "Kelola Tanaman Hias",
      icon: <FaLeaf className="text-xl" />,
      path: "/admin/tanaman-hias",
    },
    {
      name: "Kelola Desain Taman",
      icon: <FaPaintBrush className="text-xl" />,
      path: "/admin/desain-taman",
    },
    {
      name: "Kelola Perawatan Taman",
      icon: <FaHands className="text-xl" />,
      path: "/admin/perawatan-tanaman",
    },
    {
      name: "Lihat Semua Pesanan",
      icon: <FaClipboardList className="text-xl" />,
      path: "/admin/orders",
    },
  ];

  // Mobile toggle button
  const MobileToggle = () => (
    <button
      onClick={toggleMobileSidebar}
      className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#50806B] text-white shadow-lg"
      aria-label={isMobileOpen ? "Close sidebar" : "Open sidebar"}
    >
      {isMobileOpen ? <FaTimes /> : <FaBars />}
    </button>
  );

  // Sidebar content
  const SidebarContent = () => (
    <div
      className={`h-screen relative transition-all duration-300 ease-in-out 
        ${isCollapsed ? "w-20" : "w-64"} 
        bg-gradient-to-r from-[#3d6854] via-[#5a9078] to-[#4d8067] 
        shadow-xl border-r-2 border-[#358663] overflow-hidden`}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10 mix-blend-overlay"
        style={{
          backgroundImage: 'url("/images/leaf-pattern.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Logo and collapse toggle */}
      <div className="relative flex items-center justify-between px-4 py-6 border-b border-[#358663]/30">
        <Link href="/admin/dashboard" className="flex items-center">
          <span
            className={`text-white font-bold text-xl transition-opacity duration-300 ${
              isCollapsed ? "opacity-0 w-0" : "opacity-100"
            }`}
          >
            Green<span className="text-[#e0e0e0]">Garden</span>
          </span>
          <span
            className={`text-white font-bold text-xl transition-opacity duration-300 ${
              isCollapsed ? "opacity-100" : "opacity-0 w-0"
            }`}
          >
            GG
          </span>
        </Link>
        <button
          onClick={toggleSidebar}
          className="hidden md:block text-white hover:bg-white/10 rounded-full p-2 transition-all duration-300"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FaBars className="text-white" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="relative mt-6 px-2">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className={`flex items-center py-3 px-4 rounded-lg transition-all duration-300 ${
                isActive(item.path)
                  ? "bg-white/20 text-white font-medium"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3">{item.icon}</span>
                <span
                  className={`transition-all duration-300 ${
                    isCollapsed ? "opacity-0 w-0" : "opacity-100"
                  }`}
                >
                  {item.name}
                </span>
              </div>
            </Link>
          ))}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center py-3 px-4 rounded-lg transition-all duration-300 text-white/80 hover:bg-red-500/20 hover:text-white mt-8`}
          >
            <div className="flex items-center">
              <span className="mr-3"><FaSignOutAlt className="text-xl" /></span>
              <span
                className={`transition-all duration-300 ${
                  isCollapsed ? "opacity-0 w-0" : "opacity-100"
                }`}
              >
                Logout
              </span>
            </div>
          </button>
        </div>
      </nav>

      {/* Admin info at bottom */}
      <div
        className={`absolute bottom-0 left-0 right-0 relative p-4 border-t border-[#358663]/30 ${
          isCollapsed ? "hidden" : "block"
        }`}
      >
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
            <FaUsers />
          </div>
          <div className="ml-3">
            <p className="text-white font-medium text-sm">{user?.name || 'Admin'}</p>
            <p className="text-white/70 text-xs">{user?.email || 'admin@greengarden.com'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render appropriate sidebar based on screen size
  return (
    <>
      <MobileToggle />
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar - with overlay */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-40 transition-all duration-300 ${
            isMobileOpen ? "visible" : "invisible"
          }`}
        >
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              isMobileOpen ? "opacity-50" : "opacity-0"
            }`}
            onClick={toggleMobileSidebar}
          />
          
          {/* Sidebar */}
          <div
            className={`absolute top-0 left-0 h-full transition-transform duration-300 ease-in-out ${
              isMobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;