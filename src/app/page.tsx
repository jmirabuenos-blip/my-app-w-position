import Link from "next/link"; 
import { LogIn, UserPlus, AlertTriangle, Cpu } from 'lucide-react';

export default function Home() {
  
  // Hardcoded Sci-Fi Dark Theme variables for visual consistency
  const bgColor = "bg-gray-950";
  const accentColor = "text-teal-400"; // Changed accent color for stronger visual punch
  const mainTextColor = "text-white";
  const panelBg = "bg-gray-900/70 backdrop-blur-sm";

  return (
    // Set the overall background and base text styles
    <div className={`flex min-h-screen items-center justify-center ${bgColor} ${mainTextColor} font-sans`}>
      <main className="flex w-full max-w-4xl flex-col items-center justify-center py-20 px-8 sm:px-16 md:py-32">
        
        {/* --- 1. System Title and Motto (Sci-Fi Header with Glow) --- */}
        <div className="flex flex-col items-center gap-4 text-center mb-16 md:mb-20">
            <Cpu className={`w-16 h-16 ${accentColor} animate-pulse`} />
            
            <h1 className={`text-6xl sm:text-7xl font-black tracking-widest uppercase`}>
                <span className={`text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-500`}
                      style={{ textShadow: '0 0 10px rgba(52, 211, 235, 0.5)' }}>
                    AETHER CORE
                </span>
            </h1>
            <p className="max-w-xl text-xl leading-8 text-green-500/90 font-mono mt-2">
                Unified Access & Data Integrity Hub
            </p>
        </div>

        {/* --- 2. Central Access Panel (Enhanced Design) --- */}
        <div className={`w-full max-w-sm p-8 rounded-2xl border border-teal-500/40 ${panelBg} shadow-2xl shadow-teal-900/30`}>
            
            {/* Login Button */}
            <Link
                href="/login"
                className="flex h-14 items-center justify-center gap-3 rounded-xl bg-teal-600 px-8 text-xl font-bold text-white transition-all duration-300 hover:bg-teal-500 hover:shadow-md hover:shadow-teal-700/50 mb-4"
            >
                <LogIn className="w-6 h-6" />
                INITIATE LOGIN
            </Link>

            {/* Register Button */}
            <Link
                href="/register"
                className="flex h-14 items-center justify-center gap-3 rounded-xl bg-gray-800 border border-green-500/50 px-8 text-xl font-bold text-green-400 transition-all duration-300 hover:bg-gray-700 hover:border-green-400/80"
            >
                <UserPlus className="w-6 h-6" />
                CREATE NEW PROFILE
            </Link>
        </div>
        
        {/* --- 3. Access Warning Note (Clearer Separation) --- */}
        <div className="mt-12 max-w-md p-4 border-l-4 border-red-500 bg-red-900/30 rounded-r-lg text-left">
            <p className="text-sm font-semibold text-red-400 flex items-center mb-1">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                SECURITY PROTOCOL ALERT
            </p>
            <p className="text-base text-gray-300">
                Dashboard access is strictly restricted. You must complete **authentication** before viewing the operational console.
            </p>
        </div>
        
      </main>
    </div>
  );
}