"use client";
import Link from "next/link";
import { LogIn, UserPlus, AlertTriangle, Cpu, Zap, Shield, Database } from 'lucide-react';

// --- Sci-Fi Background Grid ---
const PulseGrid = () => (
  <div className="absolute inset-0 z-0 opacity-10">
    <div 
      className="w-full h-full"
      style={{
        backgroundImage: 'radial-gradient(#34d399 0.5px, transparent 0.5px)',
        backgroundSize: '30px 30px',
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950 opacity-50" />
  </div>
);

// --- Floating Particles ---
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    width: Math.random() * 4 + 2,
    height: Math.random() * 4 + 2,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-teal-400/20 animate-float-particle"
          style={{
            width: `${particle.width}px`,
            height: `${particle.height}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// --- Scanning Lines ---
const ScanLines = () => (
  <>
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-scan-horizontal opacity-30" />
    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-green-400 to-transparent animate-scan-vertical opacity-30" />
  </>
);

export default function Home() {
  const bgColor = "bg-gray-950";
  const mainTextColor = "text-white";
  const accentColor = "text-teal-400";
  const panelBg = "bg-gray-900/80 backdrop-blur-sm";
  const holoBorder = "border-2 border-transparent relative after:absolute after:inset-0 after:rounded-2xl after:border-2 after:border-teal-400 after:animate-pulse after:opacity-50 after:z-[-1]";

  return (
    <div className={`relative flex min-h-screen items-center justify-center ${bgColor} ${mainTextColor} font-sans overflow-hidden`}>
      {/* Background Effects */}
      <PulseGrid />
      <FloatingParticles />
      <ScanLines />

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <main className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center py-20 px-8 sm:px-16 md:py-32">

        {/* --- System Title & Motto --- */}
        <div className="flex flex-col items-center gap-4 text-center mb-16 md:mb-20">
          <div className="relative">
            <Cpu className={`w-16 h-16 ${accentColor} animate-spin-slow`} />
            <div className="absolute inset-0 w-16 h-16 border-2 border-teal-400/30 rounded-full animate-ping" />
          </div>
          <h1 className="text-6xl sm:text-7xl font-black tracking-widest uppercase relative">
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-green-400 to-teal-300 animate-gradient-x"
              style={{ 
                textShadow: '0 0 30px rgba(52, 211, 235, 0.9), 0 0 60px rgba(52, 211, 235, 0.5)',
                backgroundSize: '200% auto'
              }}
            >
              AETHER CORE
            </span>
            <div className="absolute -inset-2 bg-teal-400/5 blur-xl rounded-full -z-10" />
          </h1>
          <p className="max-w-xl text-xl leading-8 text-green-500/90 font-mono mt-2 animate-pulse-text" 
             style={{ textShadow: '0 0 10px rgba(110, 231, 183, 0.5)' }}>
            &gt; Unified Access & Data Integrity Hub
          </p>
          
          {/* Status Indicators */}
          <div className="flex gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm font-mono">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
              <span className="text-green-400">SYSTEMS ONLINE</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-mono">
              <Shield className="w-4 h-4 text-teal-400" />
              <span className="text-teal-400">SECURE</span>
            </div>
          </div>
        </div>

        {/* --- Central Access Panel --- */}
        <div className={`w-full max-w-sm p-10 rounded-2xl ${panelBg} shadow-3xl shadow-teal-900/50 ${holoBorder} transform hover:scale-[1.02] transition-transform duration-300`}>
          
          {/* Panel Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-teal-400/30">
            <span className="text-xs font-mono text-teal-400 tracking-wider">ACCESS TERMINAL</span>
            <Database className="w-4 h-4 text-teal-400 animate-pulse" />
          </div>

          {/* Login Button */}
          <Link
            href="/login"
            className="group flex h-16 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 px-8 text-xl font-extrabold text-white transition-all duration-300 hover:from-teal-500 hover:to-teal-400 hover:shadow-2xl hover:shadow-teal-700/70 mb-5 relative overflow-hidden active:scale-[0.98]"
          >
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            <LogIn className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            INITIATE LOGIN
            <div className="absolute inset-0 border border-white/20 rounded-xl group-hover:border-white/40 transition-colors" />
          </Link>

          {/* Register Button */}
          <Link
            href="/register"
            className="group flex h-16 items-center justify-center gap-3 rounded-xl border-2 border-green-500/70 bg-gray-800/70 px-8 text-xl font-bold text-green-400 transition-all duration-300 hover:bg-green-900/30 hover:border-green-400 hover:shadow-xl hover:shadow-green-500/30 active:scale-[0.98] relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-green-400/0 group-hover:bg-green-400/10 transition-all duration-300"></span>
            <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" 
                      style={{ filter: 'drop-shadow(0 0 6px rgba(74, 222, 128, 0.7))' }} />
            <span className="group-hover:text-green-300 transition-colors relative z-10" 
                  style={{ textShadow: '0 0 8px rgba(74, 222, 128, 0.6)' }}>
              CREATE NEW PROFILE
            </span>
          </Link>
        </div>

        {/* --- Access Warning Note --- */}
        <div className="mt-14 max-w-md p-5 border-l-4 border-red-500 bg-red-900/40 rounded-r-lg text-left shadow-lg shadow-red-900/30 hover:shadow-red-900/50 transition-shadow duration-300 backdrop-blur-sm">
          <p className="text-sm font-semibold text-red-400 flex items-center mb-1 font-mono"
             style={{ textShadow: '0 0 8px rgba(248, 113, 113, 0.7)' }}>
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500 animate-pulse" />
            SECURITY PROTOCOL ALERT [Active]
          </p>
          <p className="text-base text-gray-300 font-mono leading-relaxed">
            Dashboard access is strictly restricted. You must complete <strong className="text-red-300">authentication</strong> before viewing the operational console.
          </p>
        </div>

        {/* --- Footer --- */}
        <p className="mt-16 text-xs text-gray-500 font-mono tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse" />
          Aether Core v3.1.2 - All Rights Reserved
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse" />
        </p>
      </main>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
        }
        @keyframes scan-horizontal {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes scan-vertical {
          0% { top: -100%; }
          100% { top: 200%; }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes pulse-text {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .animate-float-particle { animation: float-particle 15s ease-in-out infinite; }
        .animate-scan-horizontal { animation: scan-horizontal 4s linear infinite; }
        .animate-scan-vertical { animation: scan-vertical 6s linear infinite; }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-text { animation: pulse-text 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
      `}</style>
    </div>
  );
}