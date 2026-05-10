"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getToken } from "@/lib/auth";

const BASE_API_URL = "https://trialnestjs-2-2tyc.onrender.com/users/";

interface User {
  id: number;
  username: string;
  role: string;
}

export default function UsersPage() {
  const [token, setToken] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUsers = useCallback(async () => {
    setFetchError(null);
    try {
      const res = await fetch(BASE_API_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      const data: User[] = (result.data || result).map((u: Record<string, unknown>) => ({
        id: u.user_id || u.id,
        username: u.username,
        role: u.role || "user",
      }));
      setUsers(data);
    } catch {
      setFetchError("Failed to load users.");
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    const saved = getToken();
    if (!saved) { router.push("/login"); return; }
    setToken(saved);
    fetchUsers().finally(() => setLoading(false));
  }, [router, fetchUsers]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  const getInitials = (username: string) =>
    username.slice(0, 2).toUpperCase();

  const getRoleColor = (role: string) => {
    if (role === "admin") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-white/40 bg-white/[0.04] border-white/10";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <svg className="animate-spin w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

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
                  tab.label === "Users"
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

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight mb-1">Users</h1>
          <p className="text-sm text-white/40">All registered accounts in the system.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-4">
            <p className="text-xs text-white/30 mb-2">Total users</p>
            <p className="text-2xl font-semibold">{users.length}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-4">
            <p className="text-xs text-white/30 mb-2">Admins</p>
            <p className="text-2xl font-semibold">
              {users.filter((u) => u.role === "admin").length}
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-4 col-span-2 sm:col-span-1">
            <p className="text-xs text-white/30 mb-2">Standard users</p>
            <p className="text-2xl font-semibold">
              {users.filter((u) => u.role !== "admin").length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
              All users ({users.length})
            </p>
            <button
              onClick={fetchUsers}
              className="text-xs text-white/25 hover:text-white/50 transition-colors"
            >
              ↻ Refresh
            </button>
          </div>

          {fetchError ? (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              {fetchError}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 text-white/20 text-sm border border-white/[0.06] rounded-lg">
              No users found.
            </div>
          ) : (
            <div className="border border-white/[0.06] rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-5 py-3 text-xs text-white/25 font-medium uppercase tracking-wider w-14">ID</th>
                    <th className="text-left px-5 py-3 text-xs text-white/25 font-medium uppercase tracking-wider">User</th>
                    <th className="text-left px-5 py-3 text-xs text-white/25 font-medium uppercase tracking-wider w-28">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr
                      key={u.id}
                      className={`border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors ${
                        i % 2 !== 0 ? "bg-white/[0.01]" : ""
                      }`}
                    >
                      <td className="px-5 py-3.5 text-white/25 font-mono text-xs">{u.id}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-xs font-medium text-white/60 flex-shrink-0">
                            {getInitials(u.username)}
                          </div>
                          <span className="text-white/80 font-mono text-sm">{u.username}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2 py-1 rounded border font-medium ${getRoleColor(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}