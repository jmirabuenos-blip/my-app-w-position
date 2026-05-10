"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/[0.06]">
        <span className="text-sm font-semibold tracking-tight text-white/90">Mirabuenos</span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-white/50 hover:text-white/90 transition-colors px-3 py-1.5"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm bg-white text-black font-medium px-4 py-1.5 rounded-md hover:bg-white/90 transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 text-center max-w-3xl mx-auto w-full">
        <div className="mb-4 inline-flex items-center gap-2 border border-white/10 rounded-full px-3 py-1 text-xs text-white/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          v1.0 — Positions Management System
        </div>

        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.1] mb-6">
          Manage your org&apos;s
          <br />
          <span className="text-white/30">structure with clarity.</span>
        </h1>

        <p className="text-base text-white/40 max-w-md mb-10 leading-relaxed">
          A clean, fast platform for managing positions and user access.
          Built on NestJS and Next.js.
        </p>

        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="bg-white text-black text-sm font-medium px-5 py-2.5 rounded-md hover:bg-white/90 transition-colors"
          >
            Create an account
          </Link>
          <Link
            href="/login"
            className="text-sm text-white/40 hover:text-white/70 transition-colors px-5 py-2.5"
          >
            Sign in →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-5 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-xs text-white/20">© 2025 Mirabuenos</span>
        <span className="text-xs text-white/20">NestJS · PostgreSQL · Next.js</span>
      </footer>
    </div>
  );
}