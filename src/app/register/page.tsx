"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { User, Lock, LogIn, Loader2, Zap, Sun, Moon, Database, Aperture } from 'lucide-react'; 
import { useTheme } from '@/context/ThemeContext'; // Make sure path is correct

// --- API Call Function (Unchanged) ---
const registerUser = async (username: string, password: string) => {
  const res = await fetch("https://trialnestjs-2-2tyc.onrender.com/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed.");
  }
  
  return data;
};

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false); 

  // --- Use Global Theme ---
  const { isLight, toggleTheme } = useTheme(); 

  const router = useRouter();

  // --- Dynamic Colors (THEME INTEGRATED) ---
  const bgColor = isLight ? "bg-gray-100" : "bg-gray-950";
  const formBg = isLight ? "bg-white/90 backdrop-blur-lg" : "bg-gray-900/80 backdrop-blur-md"; 
  const headerBg = isLight ? "bg-white/80 backdrop-blur-sm" : "bg-gray-900/50 backdrop-blur-sm";
  const textColor = isLight ? "text-gray-900" : "text-white";
  const mutedTextColor = isLight ? "text-gray-600" : "text-white/80";
  const accentColor = isLight ? "text-green-700" : "text-green-400"; 
  const secondaryAccent = isLight ? "text-teal-600" : "text-teal-400";

  const inputBg = isLight ? "bg-gray-50 border-gray-300" : "bg-gray-800 border-gray-700";
  const inputFocus = isLight 
    ? "focus:border-green-600 focus:ring-2 focus:ring-green-300" 
    : "focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50";
  
  const buttonBg = "bg-gradient-to-r from-teal-500 to-green-600";
  const buttonHover = "hover:from-teal-600 hover:to-green-700";
  const buttonShadow = isLight ? '0 5px 20px rgba(16, 185, 129, 0.3)' : '0 0 15px rgba(52, 211, 153, 0.7)';
  const formShadow = isLight ? '0 10px 40px rgba(0, 0, 0, 0.15)' : '0 0 50px rgba(17, 247, 182, 0.3)'; 
  const formBorder = isLight ? "border-gray-200" : "border-teal-500/20";

  // --- Effects ---
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timeout);
  }, []);
  
  // --- Registration Handler ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (username.length < 8 || username.length > 15 || !/\d/.test(username)) {
      setError(
        username.length < 8 
          ? "Username must be at least 8 characters."
          : username.length > 15
          ? "Username cannot exceed 15 characters."
          : "Username must contain at least one number."
      );
      setLoading(false);
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      const data = await registerUser(username, password);
      console.log("User registered:", data.user);
      router.push("/login");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen ${bgColor} font-sans transition-colors duration-500`}>
      {/* Background */}
      <div className="absolute inset-0 z-0 space-debris-container">
        {!isLight && <div id="debris-layer" className="space-debris" />}
        {isLight && (
          <div className="w-full h-full opacity-30" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #d3d3d3, #d3d3d3 1px, #f4f4f4 1px, #f4f4f4 50px)',
            backgroundSize: '50px 50px',
          }}/>
        )}
      </div>

      <style jsx global>{`
        @keyframes animDebris {
          0% { transform: translateY(0px) rotateZ(0deg) scale(0.8); }
          50% { transform: translateY(-1500px) rotateZ(180deg) scale(1.1); }
          100% { transform: translateY(-3000px) rotateZ(360deg) scale(0.8); }
        }
        .space-debris-container { perspective: 800px; overflow: hidden; }
        .space-debris {
          position: absolute; top: -1000px; left: -1000px;
          width: 3000px; height: 3000px; background: transparent;
          animation: animDebris 60s linear infinite;
          will-change: transform;
          box-shadow: 100px 100px 5px 3px rgba(52, 211, 235, 0.9),
                      400px 800px 8px 5px rgba(16, 185, 129, 0.8),
                      850px 200px 3px 2px rgba(255, 255, 255, 0.7),
                      2000px 1500px 6px 4px rgba(52, 211, 235, 0.6),
                      1200px 2300px 2px 1px rgba(16, 185, 129, 0.5);
          filter: drop-shadow(0 0 8px rgba(52, 211, 235, 0.7));
        }
      `}</style>

      {/* Header */}
      <header className={`sticky top-0 z-20 p-4 ${headerBg} border-b ${formBorder} shadow-lg transition-colors duration-500`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className={`text-2xl font-extrabold tracking-widest ${accentColor}`}>
              <Aperture className="inline-block w-6 h-6 mr-2 text-teal-500" /> SYSTEM REGISTRATION PORTAL
            </h1>
          </div>
          <button
            onClick={toggleTheme}
            className={`z-30 p-2 rounded-full transition-all duration-300 ${
              isLight ? 'bg-gray-300 text-gray-800 hover:bg-gray-400' : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
            }`}
            aria-label="Toggle theme"
          >
            {isLight ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Main Form */}
      <main className="flex justify-center w-full min-h-[calc(100vh-80px)] p-8">
        <form
          className={`z-10 w-full max-w-xl p-10 rounded-2xl shadow-2xl ${formBg} ${textColor} ${formBorder} border 
            transition-all duration-700 ease-out relative overflow-hidden h-fit`}
          onSubmit={handleRegister}
          style={{
            boxShadow: formShadow,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.95) translateY(20px)',
          }}
        >
          {!isLight && (
            <>
              <div className="absolute inset-0 border-4 border-teal-500/10 rounded-2xl pointer-events-none"/>
              <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-teal-400/50 shadow-neon animate-pulse-slow"/>
            </>
          )}

          <h2 className={`text-4xl font-extrabold mb-1 text-center tracking-wider ${accentColor}`}>
            <Database className="inline-block w-8 h-8 mb-1 mr-2 text-teal-500" />
            USER DATA INITIALIZATION
          </h2>
          <h3 className={`text-xl text-center mb-8 font-medium ${mutedTextColor}`}>
            Secure Entity Creation Protocol
          </h3>

          {error && (
            <p className={`mb-4 p-3 rounded-xl border font-medium text-sm ${
              isLight ? 'bg-red-100 text-red-700 border-red-400' : 'bg-red-800/50 text-red-400 border-red-500'
            }`}>
              🚨 VIOLATION: {error}
            </p>
          )}

          {/* Username Input */}
          <div className="mb-6">
            <label className={`text-sm font-semibold ${secondaryAccent} flex flex-col mb-1`}>
              <div className="flex items-center">
                <User className={`w-4 h-4 mr-2`} /> USERNAME IDENTIFIER
              </div>
              <span className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-400'} ml-6 mt-0.5`}>
                (8-15 chars, numeric key required)
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                maxLength={15} 
                required
                className={`w-full px-4 py-3 pl-10 rounded-lg border-2 ${inputBg} ${textColor} placeholder:${mutedTextColor} transition-all duration-300 ${inputFocus}`}
                disabled={loading}
                placeholder="e.g., PhantomKey17"
              />
              <Zap className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${secondaryAccent}`} />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-8">
            <label className={`text-sm font-semibold ${secondaryAccent} flex items-center mb-1`}>
              <Lock className={`w-4 h-4 mr-2`} /> SECURITY KEY INPUT
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className={`w-full px-4 py-3 pl-10 rounded-lg border-2 ${inputBg} ${textColor} placeholder:${mutedTextColor} transition-all duration-300 ${inputFocus}`}
                disabled={loading}
                placeholder="Min 8 characters"
              />
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${secondaryAccent}`} />
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg ${buttonBg} ${buttonHover} text-white font-bold text-lg 
              transform transition-all duration-300 ease-in-out enabled:hover:scale-[1.02] disabled:opacity-50 
              flex items-center justify-center tracking-wider`}
            style={{ boxShadow: buttonShadow }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                INITIATING SEQUENCE...
              </>
            ) : (
              <>
                <Database className="w-5 h-5 mr-3" />
                CREATE ENTITY
              </>
            )}
          </button>

          {/* Login Link */}
          <div className={`text-center mt-8 text-sm ${mutedTextColor}`}>
            <div className={`flex justify-center items-center space-x-1 border-t border-dashed ${isLight ? 'border-gray-300' : 'border-gray-700/50'} pt-4`}>
              <span>Already have an account?</span> 
              <button 
                type="button" 
                onClick={() => router.push("/login")} 
                className={`font-semibold flex items-center ${accentColor} hover:text-green-500 transition`}
              >
                <LogIn className="w-4 h-4 mr-1" /> JUMP TO LOGIN
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
