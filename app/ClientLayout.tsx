"use client";

import { useState } from "react";
import Sidebar from "./components/admin/Sidebar";
import Header from "./components/admin/Header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-6 overflow-y-auto pt-20">
          <div className="max-w-7xl mx-auto w-full">
            <div className="animate-fadeIn">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
