"use client";

import React from "react";
// Removed Moon import as it's no longer used
// import { Moon } from 'lucide-react'; 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    // Theme is now hardcoded to 'dark'

    // --- 2. Dynamic Sci-Fi Theme Variables (HARDCODED DARK) ---
    // Core Colors
    const bgColor = "bg-gray-950";
    const textColor = "text-white";
    // Primary accent color (Dark Mode value)
    const accentColor = "text-green-400"; 
    
    // Header Styles (Dark Mode values)
    const headerBg = "bg-gray-900/50 backdrop-blur-sm";
    const headerMutedText = "text-gray-500";
    // Subtle border that changes color based on theme
    const borderColor = "border-teal-500/40";
    // Subtle glow shadow that changes color based on theme
    const headerShadow = '0 5px 15px rgba(17, 247, 182, 0.15)';

    return (
        // Removed group/layout and data-light attribute
        <div 
            className={`min-h-screen ${bgColor} ${textColor} font-sans transition-colors duration-500`}
        >
            
            {/* Header: Sci-Fi Console Style (Hardcoded Dark) */}
            <header 
                className={`sticky top-0 z-20 p-4 ${headerBg} border-b ${borderColor} transition-colors duration-500`}
                style={{ boxShadow: headerShadow }} 
            >
                {/* Simplified div to only include logo/text on the left */}
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div>
                        <h1 className={`text-2xl font-extrabold tracking-widest ${accentColor}`}>
                            SYSTEM ACCESS / CONSOLE
                        </h1>
                        <p className={`text-sm ${headerMutedText} mt-0.5`}>Secure operational viewport</p>
                    </div>
                    
                    {/* --- Theme Toggle Button / Icon DIV REMOVED HERE --- */}
                </div>
            </header>

            {/* Main Content Area: Renders the child page content */}
            <main className="p-8 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}