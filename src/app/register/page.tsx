"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const registerUser = async (username: string, password: string) => {
  const res = await fetch("https://trialnestjs-2-2tyc.onrender.com/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed.");
  return data;
};

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (username.length < 8) return setError("Username must be at least 8 characters.");
    if (username.length > 15) return setError("Username cannot exceed 15 characters.");
    if (!/\d/.test(username)) return setError("Username must contain at least one number.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");

    setLoading(true);
    try {
      await registerUser(username, password);
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setLoading(false);
    }
  };

  const usernameValid = username.length >= 8 && username.length <= 15 && /\d/.test(username);
  const passwordValid = password.length >= 8;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/[0.06]">
        <Link href="/" className="text-sm font-semibold tracking-tight text-white/90">
          Mirabuenos
        </Link>
        <span className="text-xs text-white/30">
          Already have an account?{" "}
          <Link href="/login" className="text-white/60 hover:text-white transition-colors underline underline-offset-2">
            Sign in
          </Link>
        </span>
      </nav>

      {/* Form */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div
          className="w-full max-w-sm transition-all duration-500"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)" }}
        >
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight mb-1">Create an account</h1>
            <p className="text-sm text-white/40">Set up your credentials to get access.</p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-4 py-3">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/40 font-medium uppercase tracking-wider">Username</label>
                {username.length > 0 && (
                  <span className={`text-xs ${usernameValid ? "text-emerald-500" : "text-white/20"}`}>
                    {username.length}/15
                  </span>
                )}
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. johndoe42"
                maxLength={15}
                required
                disabled={loading}
                className="bg-white/[0.04] border border-white/10 rounded-md px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all disabled:opacity-50"
              />
              <p className="text-xs text-white/25 mt-0.5">8–15 characters, must include a number.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/40 font-medium uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="bg-white/[0.04] border border-white/10 rounded-md px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all disabled:opacity-50"
              />
              {password.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-0.5 flex-1 rounded-full transition-colors ${
                        password.length >= (i + 1) * 3
                          ? passwordValid
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-white text-black text-sm font-medium py-2.5 rounded-md hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}