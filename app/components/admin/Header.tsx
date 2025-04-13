"use client";

import { FiSearch, FiBell, FiSettings, FiMenu, FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Header({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userName, setUserName] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Chỉ thực thi sau khi client đã mount
    setIsMounted(true);
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserName(parsed.ho_ten || "Admin");
      } catch (err) {
        console.error("Lỗi parse user:", err);
        setUserName("Admin");
      }
    } else {
      setUserName("Admin");
    }
  }, []);

  // Không render gì khi chưa mount hoặc đang ở trang login
  if (!isMounted || pathname === "/login") return null;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout");
      localStorage.removeItem("user");
      toast.success("Đăng xuất thành công!");
      router.replace("/login");
    } catch (err) {
      toast.error("Lỗi khi đăng xuất!");
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-30">
      {/* Left section - Menu button and title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <FiMenu className="text-xl" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 hidden md:block">
          {pathname.split("/")[1] === "admin"
            ? "Admin Dashboard"
            : "Hệ Thống Quản Lý"}
        </h1>
      </div>

      {/* Right section - Search and profile */}
      <div className="flex items-center space-x-4">
        {/* Search bar */}
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <FiBell className="text-xl text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <FiSettings className="text-xl text-gray-600" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <FaUserCircle className="text-2xl text-gray-600" />
              <span className="hidden md:inline-block text-gray-700">
                {userName}
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <a
                  href="#"
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FaUserCircle className="mr-2" /> Hồ sơ
                </a>
                <a
                  href="#"
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FiSettings className="mr-2" /> Cài đặt
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FiLogOut className="mr-2" /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
