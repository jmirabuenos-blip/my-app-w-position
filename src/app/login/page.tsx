// app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { User, Lock, LogIn, Loader2, Zap, Sun, Moon, Aperture } from 'lucide-react'; 
// *** 1. Import the global useTheme hook ***
import { useTheme } from '@/context/ThemeContext'; // Ensure this path is correct

// --- Utility Function: Save Tokens (Unchanged) ---
export const saveTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export default function LoginPage() {
  // --- 1. Login Logic State ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false); 
  
  // *** 2. Use Global Theme State instead of local useState ***
  const { isLight, toggleTheme } = useTheme(); 

  const router = useRouter();

  // --- 2. Dynamic Sci-Fi Theme Configuration ---
  // isLight is now sourced directly from the global context
  
  // Dynamic Background and Text Colors
  const bgColor = isLight ? "bg-gray-100" : "bg-gray-950";
  const formBg = isLight ? "bg-white/90 backdrop-blur-lg" : "bg-gray-900/80 backdrop-blur-md"; 
  const headerBg = isLight ? "bg-white/80 backdrop-blur-sm" : "bg-gray-900/50 backdrop-blur-sm";
  const textColor = isLight ? "text-gray-900" : "text-white";
  const mutedTextColor = isLight ? "text-gray-600" : "text-white/80";
  const accentColor = isLight ? "text-green-700" : "text-green-400"; 
  
  // Dynamic Input Styling
  const inputBg = isLight ? "bg-gray-50 border-gray-300" : "bg-gray-800 border-gray-700";
  const inputFocus = "focus:border-green-400 focus:ring-1 focus:ring-green-400";
  
  // Consistent Button and Shadow
  const buttonBg = "bg-gradient-to-r from-teal-500 to-green-600";
  const buttonShadow = isLight ? '0 0 10px rgba(16, 185, 129, 0.5)' : '0 0 10px rgba(52, 211, 153, 0.7)';
  const formShadow = isLight ? '0 10px 30px rgba(0, 0, 0, 0.1)' : '0 0 40px rgba(17, 247, 182, 0.2)'; 
  const formBorder = isLight ? "border-gray-200" : "border-gray-700";

  // --- 3. Effects ---
  // Entrance Transition Effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      setMounted(true);
    }, 50); 
    return () => clearTimeout(timeout);
  }, []);

  // *** The local toggleTheme function is now replaced by the one from useTheme() ***

  // --- 4. Authentication Handler (Unchanged) ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic frontend validation (KEEPING THE MIN LENGTH FOR SECURITY)
    if (username.length < 8) {
      setError("Username must be at least 8 characters.");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://trialnestjs-2-2tyc.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      // CUSTOM SWAPPED ERROR LOGIC (based on backend response)
      if (!res.ok) {
        let displayError;
        if (data.message === "User not found") {
          displayError = "Incorrect username. Please try again."; 
        } else if (data.message === "Incorrect password") {
          displayError = "Incorrect password. Please try again."; 
        } else {
          displayError = "Login failed. Check your credentials.";
        }
        setError(displayError);
        setLoading(false);
        return;
      }

      // SUCCESSFUL LOGIN: SAVE TOKENS AND REDIRECT DIRECTLY
      if (data.accessToken && data.refreshToken) {
        console.log("Access Granted. Successfully logged in as:", username);
        
        saveTokens(data.accessToken, data.refreshToken);
        router.push("/dashboard"); 
      } else {
        setError("Login successful, but failed to establish a secure session. Please try again.");
      }

    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = (err as Error).message || "Network error. The server may be offline.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- 5. Component Render (Dynamic Theming) ---
  return (
    // 1. Main container takes full width/height
    <div className={`relative min-h-screen ${bgColor} font-sans transition-colors duration-500`}>
      
      {/* 🌌 Animated Background (Dynamic based on theme) - Stays as a background layer */}
      <div className="absolute inset-0 z-0 space-debris-container">
        {/* Dark Mode: Existing animated debris */}
        {!isLight && <div id="debris-layer" className="space-debris" />}
        {/* Light Mode: Subtle Grid/Circuit pattern */}
        {isLight && (
            <div className="w-full h-full opacity-30" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, #d3d3d3, #d3d3d3 1px, #f4f4f4 1px, #f4f4f4 50px)',
                backgroundSize: '50px 50px',
            }}/>
        )}
      </div>
      
      {/* --- Global Styles for Space Debris (Only for Dark Mode) --- */}
      <style jsx global>{`
        @keyframes animDebris {
          0% { transform: translateY(0px) rotateZ(0deg) scale(0.8); }
          50% { transform: translateY(-1500px) rotateZ(180deg) scale(1.1); }
          100% { transform: translateY(-3000px) rotateZ(360deg) scale(0.8); }
        }
        .space-debris-container {
          perspective: 800px; 
          overflow: hidden; 
        }
        .space-debris {
          position: absolute;
          top: 0;
          left: 0;
          width: 3000px;
          height: 3000px;
          background: transparent;
          animation: animDebris 60s linear infinite; 
          will-change: transform; 
          top: -1000px;
          left: -1000px;
          /* Box shadows are omitted here for brevity, assuming they are defined elsewhere or correctly applied via CSS-in-JS/Tailwind */
          filter: drop-shadow(0 0 5px rgba(52, 211, 235, 0.5));
        }
      `}</style>
      
      {/* 2. Full-Width Header */}
      <header className={`sticky top-0 z-20 p-4 ${headerBg} border-b ${formBorder} shadow-lg transition-colors duration-500`}>
          <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div>
                  <h1 className={`text-2xl font-extrabold tracking-widest ${accentColor}`}>
                      <Aperture className="inline-block w-6 h-6 mr-2 text-teal-500" /> SYSTEM ACCESS PORTAL
                  </h1>
              </div>
              
              {/* --- Theme Toggle Button --- */}
              <button
                // Calls the global toggleTheme function
                onClick={toggleTheme}
                className={`z-30 p-2 rounded-full transition-all duration-300 ${
                  isLight 
                    ? 'bg-gray-300 text-gray-800 hover:bg-gray-400' 
                    : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                }`}
                aria-label="Toggle theme"
              >
                {isLight ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
              </button>
          </div>
      </header>

      {/* 3. Main Content Area - Centering the Form within the flow */}
      <main className="flex justify-center w-full min-h-[calc(100vh-80px)] p-8">
          {/* The Login Form */}
          <form
            className={`z-10 w-full max-w-md p-10 rounded-2xl shadow-2xl ${formBg} ${textColor} ${formBorder} border
              transition-all duration-700 ease-out h-fit`} 
            onSubmit={handleLogin}
            style={{ 
              boxShadow: formShadow,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'scale(1)' : 'scale(0.95) translateY(20px)',
            }}
          >
            <h2 className={`text-3xl font-extrabold mb-2 text-center tracking-tight ${accentColor}`}>
              LOGIN PROTOCOL <Zap className="inline-block w-6 h-6 mb-1 ml-1 text-teal-500" />
            </h2>
            <h3 className={`text-lg text-center mb-8 ${mutedTextColor}`}>Secure Credentials Required</h3>

            {error && (
              <p className={`mb-4 p-3 rounded-xl border font-medium ${
                isLight ? 'bg-red-100 text-red-700 border-red-400' : 'bg-red-800/50 text-red-400 border-red-500'
              }`}>
                🚨 **ERROR:** {error}
              </p>
            )}

            {/* --- Username Input (Themed) --- */}
            <div className="mb-5">
              <label className={`text-sm font-medium ${mutedTextColor} flex items-center mb-1`}>
                <User className={`w-4 h-4 mr-2 ${accentColor}`} /> Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={`w-full px-4 py-3 pl-10 rounded-lg border-2 ${inputBg} ${textColor} placeholder:${mutedTextColor} transition-all duration-300 ${inputFocus}`}
                  disabled={loading}
                  placeholder="Enter System Alias"
                />
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${accentColor}`} />
              </div>
            </div>

            {/* --- Password Input (Themed) --- */}
            <div className="mb-6">
              <label className={`text-sm font-medium ${mutedTextColor} flex items-center mb-1`}>
                <Lock className={`w-4 h-4 mr-2 ${accentColor}`} /> Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full px-4 py-3 pl-10 rounded-lg border-2 ${inputBg} ${textColor} placeholder:${mutedTextColor} transition-all duration-300 ${inputFocus}`}
                  disabled={loading}
                  placeholder="Enter Security Key"
                />
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${accentColor}`} />
              </div>
            </div>

            {/* --- Login Button (Unchanged) --- */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg ${buttonBg} text-white font-bold text-lg hover:from-teal-600 hover:to-green-700 transform transition-all duration-300 ease-in-out enabled:hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center`}
              style={{ boxShadow: buttonShadow }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-3" />
                  INITIATE LOGIN
                </>
              )}
            </button>

            {/* --- Register Link (Themed for consistency) --- */}
            <div className={`text-center mt-6 text-sm ${mutedTextColor}`}>
              <div className="flex justify-center items-center space-x-1">
                <span>Don't have an account?</span>
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className={`${accentColor} hover:text-green-500 transition font-semibold flex items-center`}
                >
                  <Zap className="w-4 h-4 mr-1" /> [REGISTER_ACCESS]
                </button>
              </div>
            </div>

          </form>
      </main>
    </div>
  );
}