"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  Settings,
  LogOut,
  User,
  NotebookIcon,
  User2Icon,
  HistoryIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { logOut } from "@/actions/admin";

interface SidebarProps {
  className?: string;
  username?: string;
}

export function Sidebar({ className = "", username }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 1024 &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isMounted]);

  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <Home className="w-5 h-5" />, href: "/" },

    {
      name: "Manajemen Data Penduduk",
      icon: <User2Icon className="w-5 h-5" />,
      href: "/residents",
    },

    {
      name: "Riwayat Aktivitas",
      icon: <HistoryIcon className="w-5 h-5" />,
      href: "/logs",
    },
    {
      name: "Panduan Aplikasi",
      icon: <NotebookIcon className="w-5 h-5" />,
      href: "/tutorials",
    },
    {
      name: "Akun Saya",
      icon: <Settings className="w-5 h-5" />,
      href: "/settings",
    },
  ];

  if (pathName === "/login") {
    return null;
  }

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 p-2.5 rounded-lg bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-colors duration-200 z-30 lg:hidden"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          fixed left-0 top-0 h-full z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform duration-300 ease-in-out
          w-72 bg-slate-50 border-r border-slate-200
          ${className}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-medium">DO</span>
              </div>
              <h1 className="text-lg font-semibold text-slate-800">
                DESA OENGKOLAKI
              </h1>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-slate-100 transition-colors lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <nav className="flex-1 pt-6 pb-4 overflow-y-auto">
            <div className="px-6 mb-8">
              <div className="py-3 px-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs font-medium text-blue-600">
                  Selamat datang kembali
                </p>
                <p className="text-sm text-slate-800 mt-1 font-medium">
                  {username || "Admin"}
                </p>
              </div>
            </div>
            <ul className="space-y-1 px-4">
              {menuItems.map((item, index) => {
                const isActive =
                  pathName === item.href ||
                  (pathName.startsWith(item.href) && item.href !== "/");

                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                      onClick={closeSidebarOnMobile}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className="ml-3 font-medium">{item.name}</span>
                      {isActive && (
                        <span className="ml-auto w-1 h-6 bg-white rounded-full" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-6 mt-auto border-t border-slate-100">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center text-slate-700 font-medium">
                {username ? (
                  username.charAt(0).toUpperCase()
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {username || "User"}
                </p>
              </div>
              <form action={logOut}>
                <button
                  className="p-2 cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 hover:text-slate-800 border border-slate-200 transition-colors duration-200"
                  title="Logout"
                  type="submit"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
