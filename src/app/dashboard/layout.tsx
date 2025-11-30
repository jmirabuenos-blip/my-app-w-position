"use client";

import React from "react";
import { Sun, Moon } from 'lucide-react';
import { useTheme } from "@/context/ThemeContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLight, toggleTheme } = useTheme(); // use global theme

  // --- Theme Variables ---
  const bgColor = isLight ? "bg-gray-100" : "bg-gray-950";
  const textColor = isLight ? "text-gray-900" : "text-white";
  const accentColor = isLight ? "text-green-700" : "text-green-400";
  const headerBg = isLight ? "bg-white/80 backdrop-blur-sm" : "bg-gray-900/50 backdrop-blur-sm";
  const headerMutedText = isLight ? "text-gray-600" : "text-gray-400";
  const borderColor = isLight ? "border-gray-200" : "border-teal-500/40";
  const headerShadow = isLight ? '0 5px 15px rgba(0,0,0,0.1)' : '0 5px 15px rgba(17,247,182,0.15)';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} font-sans transition-colors duration-500`}>
      {/* Header */}
      <header 
        className={`sticky top-0 z-20 p-4 ${headerBg} border-b ${borderColor} transition-colors duration-500`}
        style={{ boxShadow: headerShadow }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className={`text-2xl font-extrabold tracking-widest ${accentColor}`}>
              SYSTEM ACCESS / CONSOLE
            </h1>
            <p className={`text-sm ${headerMutedText} mt-0.5`}>Secure operational viewport</p>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 ${
              isLight ? 'bg-gray-300 text-gray-800 hover:bg-gray-400' : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
            }`}
            aria-label="Toggle theme"
          >
            {isLight ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto">
        {children} {/* children pages will read theme from context themselves */}
      </main>
    </div>
  );
}
