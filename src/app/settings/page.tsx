"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getToken } from "@/lib/auth";

export default function SettingsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwStatus, setPwStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [pwMsg, setPwMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const saved = getToken();
    if (!saved) { router.push("/login"); return; }
    setToken(saved);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg("");

    if (newPassword.length < 8) {
      setPwStatus("error");
      setPwMsg("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwStatus("error");
      setPwMsg("Passwords do not match.");
      return;
    }

    setPwStatus("loading");
    try {
      const res = await fetch("https://trialnestjs-2-2tyc.onrender.com/users/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update password.");
      }

      setPwStatus("success");
      setPwMsg("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwStatus("error");
      setPwMsg(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setTimeout(() => setPwStatus("idle"), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.06] sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-sm z-10">
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold tracking-tight">Mirabuenos</span>
          <div className="hidden sm:flex items-center gap-1">
            {[
              { label: "Positions", href: "/dashboard" },
              { label: "Users", href: "/users" },
              { label: "Settings", href: "/settings" },
            ].map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                  tab.label === "Settings"
                    ? "text-white bg-white/[0.08]"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            API online
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 border border-white/[0.06] rounded-md hover:border-white/20"
          >
            Sign out
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight mb-1">Settings</h1>
          <p className="text-sm text-white/40">Manage your account and system configuration.</p>
        </div>

        {/* API Info */}
        <div className="mb-8">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">API configuration</p>
          <div className="border border-white/[0.06] rounded-lg overflow-hidden">
            {[
              { label: "Base URL", value: "https://trialnestjs-2-2tyc.onrender.com" },
              { label: "Version", value: "v1.0.0" },
              { label: "Auth", value: "JWT Bearer Token" },
              { label: "Hosting", value: "Render (free tier)" },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-5 py-3.5 ${
                  i !== arr.length - 1 ? "border-b border-white/[0.04]" : ""
                } hover:bg-white/[0.02] transition-colors`}
              >
                <span className="text-xs text-white/30 uppercase tracking-wider">{row.label}</span>
                <span className="text-sm font-mono text-white/60">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Session */}
        <div className="mb-8">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Session</p>
          <div className="border border-white/[0.06] rounded-lg px-5 py-4">
            <p className="text-xs text-white/30 mb-2">Access token</p>
            <p className="text-xs font-mono text-white/25 break-all leading-relaxed">
              {token || "—"}
            </p>
          </div>
        </div>

        {/* Change Password */}
        <div className="mb-8">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Change password</p>
          <form
            onSubmit={handleChangePassword}
            className="border border-white/[0.06] rounded-lg p-5 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/40 uppercase tracking-wider">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-white/[0.04] border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/40 uppercase tracking-wider">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-white/[0.04] border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-white/40 uppercase tracking-wider">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-white/[0.04] border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
              />
            </div>

            {pwStatus !== "idle" && (
              <p className={`text-xs ${pwStatus === "success" ? "text-emerald-400" : pwStatus === "error" ? "text-red-400" : "text-white/40"}`}>
                {pwStatus === "loading" ? "Updating…" : pwMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={pwStatus === "loading"}
              className="bg-white text-black text-sm font-medium py-2 rounded-md hover:bg-white/90 transition-colors disabled:opacity-50 self-start px-6"
            >
              {pwStatus === "loading" ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div>
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Account</p>
          <div className="border border-white/[0.06] rounded-lg p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80 mb-0.5">Sign out</p>
              <p className="text-xs text-white/30">End your current session.</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-red-400/70 hover:text-red-400 transition-colors px-4 py-2 border border-red-500/20 hover:border-red-500/40 rounded-md"
            >
              Sign out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}