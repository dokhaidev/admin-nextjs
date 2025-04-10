"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBox,
  FiList,
  FiUsers,
  FiShoppingCart,
  FiBarChart2,
  FiHome,
  FiFileText,
  FiLogOut,
} from "react-icons/fi";
import { useState } from "react";

export default function Sidebar({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const menuItems = [
    {
      name: "Tổng quan",
      path: "/",
      icon: <FiHome className="text-lg" />,
    },
    {
      name: "Sản phẩm",
      path: "/san-pham",
      icon: <FiBox className="text-lg" />,
      submenu: [{ name: "Thống kê", path: "/san-pham/thongke" }],
    },
    {
      name: "Danh mục",
      path: "/loai",
      icon: <FiList className="text-lg" />,
      submenu: [{ name: "Thống kê", path: "/loai/thongke" }],
    },
    {
      name: "Người dùng",
      path: "/users",
      icon: <FiUsers className="text-lg" />,
      submenu: [
        { name: "Danh sách", path: "/admin/users" },
        { name: "Thêm mới", path: "/admin/users/new" },
        { name: "Phân quyền", path: "/admin/users/roles" },
      ],
    },
    {
      name: "Đơn hàng",
      path: "/admin/orders",
      icon: <FiShoppingCart className="text-lg" />,
    },
    {
      name: "Báo cáo",
      path: "/admin/reports",
      icon: <FiBarChart2 className="text-lg" />,
    },
    {
      name: "Bài viết",
      path: "/tin-tuc",
      icon: <FiFileText className="text-lg" />,
      submenu: [{ name: "Thống kê", path: "/tin-tuc/thongke" }],
    },
  ];

  const toggleSubmenu = (name: string) => {
    setActiveSubmenu(activeSubmenu === name ? null : name);
  };

  return (
    <div
      className={`bg-gray-800 text-white h-screen fixed top-0 left-0 shadow-lg transition-all duration-300 ease-in-out z-20 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo/Sidebar header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {isOpen ? (
          <h1 className="text-xl font-bold">Admin Panel</h1>
        ) : (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            AP
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-gray-700"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Menu items */}
      <nav className="mt-4">
        {menuItems.map((item) => (
          <div key={item.path}>
            <Link
              href={item.path}
              onClick={() => item.submenu && toggleSubmenu(item.name)}
              className={`flex items-center px-4 py-3 hover:bg-gray-700 transition-colors ${
                pathname === item.path ||
                (item.submenu &&
                  item.submenu.some((sub) => pathname === sub.path))
                  ? "bg-gray-700 border-l-4 border-blue-500"
                  : ""
              }`}
            >
              <span className={`${isOpen ? "mr-3" : "mx-auto"}`}>
                {item.icon}
              </span>
              {isOpen && (
                <>
                  <span>{item.name}</span>
                  {item.submenu && (
                    <span className="ml-auto">
                      {activeSubmenu === item.name ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                  )}
                </>
              )}
            </Link>

            {/* Submenu items */}
            {isOpen && item.submenu && activeSubmenu === item.name && (
              <div className="bg-gray-900 pl-12">
                {item.submenu.map((subItem) => (
                  <Link
                    key={subItem.path}
                    href={subItem.path}
                    className={`block py-2 px-4 text-sm hover:bg-gray-800 ${
                      pathname === subItem.path
                        ? "text-blue-400"
                        : "text-gray-300"
                    }`}
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom section - Logout */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        <Link
          href="/login"
          className="flex items-center px-4 py-2 hover:bg-gray-700 rounded transition-colors"
        >
          <FiLogOut className={`text-lg ${isOpen ? "mr-3" : "mx-auto"}`} />
          {isOpen && <span>Đăng xuất</span>}
        </Link>
      </div>
    </div>
  );
}
