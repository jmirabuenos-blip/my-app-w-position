"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getToken } from "@/lib/auth";

const BASE_API_URL = "https://trialnestjs-2-2tyc.onrender.com/positions/";

interface Position {
  id: number;
  code: string;
  name: string;
}

export default function DashboardPage() {
  const [token, setToken] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [createCode, setCreateCode] = useState("");
  const [createName, setCreateName] = useState("");
  const [createStatus, setCreateStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [createMsg, setCreateMsg] = useState("");
  const router = useRouter();

  const fetchPositions = useCallback(async () => {
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
      const data: Position[] = (result.data || []).map((p: Record<string, unknown>) => ({
        id: p.position_id || p.id,
        code: p.position_code || p.code,
        name: p.position_name || p.name,
      }));
      setPositions(data);
    } catch {
      setFetchError("Failed to load positions. Check your connection.");
      setPositions([]);
    }
  }, []);

  useEffect(() => {
    const saved = getToken();
    if (!saved) { router.push("/login"); return; }
    setToken(saved);
    fetchPositions().finally(() => setLoading(false));
  }, [router, fetchPositions]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createCode.trim() || !createName.trim() || !token) return;
    setCreateStatus("loading");
    try {
      const res = await fetch(BASE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: createCode.trim(), name: createName.trim() }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      setCreateStatus("success");
      setCreateMsg("Position added.");
      setCreateCode("");
      setCreateName("");
      fetchPositions();
    } catch (err) {
      setCreateStatus("error");
      setCreateMsg(err instanceof Error ? err.message : "Failed to create.");
    } finally {
      setTimeout(() => setCreateStatus("idle"), 3000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this position?")) return;
    try {
      const res = await fetch(`${BASE_API_URL}${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchPositions();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed.");
    }
  };

  const lastAdded = positions[positions.length - 1];

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
                  tab.label === "Positions"
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
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight mb-1">Positions</h1>
          <p className="text-sm text-white/40">Manage roles and designations across your organization.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-4">
            <p className="text-xs text-white/30 mb-2">Total positions</p>
            <p className="text-2xl font-semibold">{positions.length}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-4">
            <p className="text-xs text-white/30 mb-2">Last added</p>
            <p className="text-sm font-medium text-white/80 truncate mt-0.5">
              {lastAdded ? lastAdded.name : "—"}
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-4">
            <p className="text-xs text-white/30 mb-2">API status</p>
            <p className="text-sm font-medium text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Online
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-4">
            <p className="text-xs text-white/30 mb-2">Session</p>
            <p className="text-xs text-white/25 font-mono truncate mt-0.5">{token?.slice(0, 20)}…</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Add position</p>
          <form onSubmit={handleCreate} className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Code — e.g. ENG"
              value={createCode}
              onChange={(e) => setCreateCode(e.target.value)}
              required
              className="bg-white/[0.04] border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all w-36"
            />
            <input
              type="text"
              placeholder="Name — e.g. Engineer"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              required
              className="bg-white/[0.04] border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all flex-1 min-w-[160px]"
            />
            <button
              type="submit"
              disabled={createStatus === "loading"}
              className="bg-white text-black text-sm font-medium px-5 py-2 rounded-md hover:bg-white/90 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {createStatus === "loading" ? "Adding…" : "Add position"}
            </button>
          </form>
          {createStatus !== "idle" && (
            <p className={`text-xs mt-2 ${createStatus === "success" ? "text-emerald-400" : "text-red-400"}`}>
              {createMsg}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
              All positions ({positions.length})
            </p>
            <button onClick={fetchPositions} className="text-xs text-white/25 hover:text-white/50 transition-colors">
              ↻ Refresh
            </button>
          </div>

          {fetchError ? (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              {fetchError}
            </div>
          ) : positions.length === 0 ? (
            <div className="text-center py-16 text-white/20 text-sm border border-white/[0.06] rounded-lg">
              No positions yet. Add one above.
            </div>
          ) : (
            <div className="border border-white/[0.06] rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-5 py-3 text-xs text-white/25 font-medium uppercase tracking-wider w-14">ID</th>
                    <th className="text-left px-5 py-3 text-xs text-white/25 font-medium uppercase tracking-wider w-32">Code</th>
                    <th className="text-left px-5 py-3 text-xs text-white/25 font-medium uppercase tracking-wider">Name</th>
                    <th className="px-5 py-3 w-28" />
                  </tr>
                </thead>
                <tbody>
                  {positions.map((p, i) => (
                    <tr
                      key={p.id}
                      className={`group border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors ${
                        i % 2 !== 0 ? "bg-white/[0.01]" : ""
                      }`}
                    >
                      <td className="px-5 py-3.5 text-white/25 font-mono text-xs">{p.id}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-white/60 font-mono text-xs bg-white/[0.05] px-2 py-1 rounded">
                          {p.code}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-white/80">{p.name}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingPosition(p)}
                            className="text-xs text-white/40 hover:text-white/80 transition-colors px-2.5 py-1 border border-white/10 rounded hover:border-white/30"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-xs text-red-400/60 hover:text-red-400 transition-colors px-2.5 py-1 border border-red-500/10 rounded hover:border-red-500/30"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {editingPosition && (
        <EditModal
          token={token}
          position={editingPosition}
          onClose={() => setEditingPosition(null)}
          onUpdated={() => { setEditingPosition(null); fetchPositions(); }}
        />
      )}
    </div>
  );
}

function EditModal({
  token,
  position,
  onClose,
  onUpdated,
}: {
  token: string | null;
  position: Position;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [code, setCode] = useState(position.code);
  const [name, setName] = useState(position.name);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<Position> = {};
    if (code.trim() !== position.code) payload.code = code.trim();
    if (name.trim() !== position.name) payload.name = name.trim();
    if (Object.keys(payload).length === 0) { onClose(); return; }

    setStatus("loading");
    try {
      const res = await fetch(`${BASE_API_URL}${position.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      setStatus("success");
      setMsg("Updated.");
      setTimeout(onUpdated, 600);
    } catch (err) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Update failed.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#111] border border-white/10 rounded-xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold">Edit position</h2>
            <p className="text-xs text-white/30 mt-0.5">ID #{position.id}</p>
          </div>
          <button onClick={onClose} className="text-white/25 hover:text-white/60 transition-colors text-lg leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-white/40 uppercase tracking-wider">Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="bg-white/[0.04] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-all font-mono"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-white/40 uppercase tracking-wider">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-white/[0.04] border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-all"
            />
          </div>

          {status !== "idle" && (
            <p className={`text-xs ${status === "success" ? "text-emerald-400" : status === "error" ? "text-red-400" : "text-white/40"}`}>
              {status === "loading" ? "Saving…" : msg}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-sm text-white/40 border border-white/10 rounded-md py-2 hover:border-white/20 hover:text-white/60 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex-1 text-sm bg-white text-black font-medium rounded-md py-2 hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}