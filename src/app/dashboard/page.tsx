"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";
import { Settings, LogOut, CheckCircle, PlusCircle, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

// --- Configuration ---
// ✅ UPDATED: Connecting to your live Render API endpoint
const BASE_API_URL = 'https://trialnestjs-2-2tyc.onrender.com/positions/';

// --- Positions Interface ---
interface Position {
  id: number;
  code: string;
  name: string;
}

// --- Theme Colors Interface ---
interface ThemeColors {
  mainTextColor: string;
  mutedTextColor: string;
  accentColor: string;
  warningColor: string;
  highlightColor: string;
  tokenBg: string;
  tokenTextColor: string;
  logoutButtonBg: string;
  buttonActive: string;
  buttonInactive: string;
  loadingBgColor: string;
  tableHeaderBg: string;
  tableRowBg: string;
}

// --- Dashboard Page ---
export default function DashboardPage() {
  const { isLight } = useTheme();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'status' | 'positions'>('status');
  const [positions, setPositions] = useState<Position[]>([]);
  // Updated fetchError message to reference the online URL
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ⭐️ NEW STATE for Edit Modal Management
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);

  const router = useRouter();

  // --- Theme Colors (Optimized for reuse) ---
  const colors: ThemeColors = useMemo(() => ({
    mainTextColor: isLight ? "text-gray-900" : "text-white",
    mutedTextColor: isLight ? "text-gray-600" : "text-gray-400",
    accentColor: isLight ? "text-green-700" : "text-green-400",
    warningColor: isLight ? "text-red-600" : "text-red-400",
    highlightColor: isLight ? "text-yellow-700" : "text-yellow-400",
    tokenBg: isLight ? "bg-white/80 border border-gray-300" : "bg-gray-900/80 border border-teal-500/30",
    tokenTextColor: isLight ? "text-gray-800" : "text-cyan-400",
    logoutButtonBg: isLight ? "bg-red-600 hover:bg-red-500" : "bg-red-700 hover:bg-red-600",
    buttonActive: isLight ? "bg-green-500/30 text-green-700" : "bg-teal-500/30 text-teal-400",
    buttonInactive: isLight ? "bg-gray-200 hover:bg-gray-300 text-gray-700" : "bg-gray-800 hover:bg-gray-700/50 text-gray-400",
    loadingBgColor: isLight ? "bg-gray-100" : "bg-gray-950",
    tableHeaderBg: isLight ? "bg-gray-100" : "bg-gray-700/50",
    tableRowBg: isLight ? "hover:bg-gray-50" : "hover:bg-gray-800",
  }), [isLight]);

  const {
    mainTextColor,
    mutedTextColor,
    accentColor,
    warningColor,
    highlightColor,
    tokenBg,
    tokenTextColor,
    logoutButtonBg,
    buttonActive,
    buttonInactive,
    loadingBgColor
  } = colors;

  // --- Data Fetching Logic ---
  const fetchPositions = useCallback(async () => {
    setFetchError(null);
    try {
      const response = await fetch(BASE_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const data: Position[] = (result.data || []).map((p: any) => ({
        id: p.position_id || p.id,
        code: p.position_code || p.code,
        name: p.position_name || p.name,
      }));

      setPositions(data);
    } catch (error) {
      console.error("Error fetching positions:", error);
      setFetchError("Failed to load positions data. Check if the NestJS server is running on Render and CORS is enabled.");
      setPositions([]);
    }
  }, []);

  // --- Auth Check & Mount ---
  useEffect(() => {
    const savedToken = getToken();
    if (!savedToken) {
      router.push("/login");
      return;
    }
    setToken(savedToken);

    setTimeout(() => {
      setLoading(false);
      setMounted(true);
    }, 100);

    fetchPositions();
  }, [router, fetchPositions]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    router.push("/login");
  };

  const handlePositionCreated = () => {
    fetchPositions();
  };

  // ⭐️ NEW: Handler for successful update (called from the Edit Modal)
  const handlePositionUpdated = () => {
    setIsEditModalOpen(false); // Close the modal
    setEditingPosition(null);  // Clear the state
    fetchPositions();          // Refresh the list
  };

  // ⭐️ UPDATED: Implement Edit and Delete Logic
  const handleAction = async (action: 'Edit' | 'Delete', id: number) => {
    if (!token) return alert("Session expired. Please log in.");

    if (action === 'Edit') {
      const positionToEdit = positions.find(p => p.id === id);
      if (positionToEdit) {
        // Set the data and open the modal
        setEditingPosition(positionToEdit);
        setIsEditModalOpen(true);
      } else {
        alert(`Error: Position ID ${id} not found locally.`);
      }
      return;
    }

    if (action === 'Delete') {
      if (!confirm(`Are you sure you want to delete Position ID ${id} (${positions.find(p => p.id === id)?.name})? This action cannot be undone.`)) {
        return;
      }

      try {
        const response = await fetch(`${BASE_API_URL}${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorJson = await response.json();
          const errorMessage = errorJson.message || `Status ${response.status}`;
          throw new Error(errorMessage);
        }

        alert(`Position ID ${id} deleted successfully!`);
        fetchPositions(); // Refresh the list

      } catch (error) {
        console.error("Error deleting position:", error);
        alert(`Deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };


  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${loadingBgColor} ${mainTextColor} font-sans`}>
        <svg className="animate-spin h-8 w-8 text-green-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className={`${mutedTextColor}`}>Securing connection handshake...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center font-sans p-6 min-h-screen">
      <div
        className={`w-full max-w-4xl p-8 rounded-xl transition-all duration-1000 ease-out`}
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
        {/* Header/Tabs */}
        <p className={`text-xl text-center mb-2 font-mono ${accentColor}`}>
          Access Granted: Authorized User
        </p>

        <h1 className={`text-6xl font-extrabold mb-8 text-center tracking-wide ${accentColor}`}>
          [SYSTEM] DASHBOARD
        </h1>
        <div className="flex justify-center space-x-4 mb-10">
          <button className={`flex items-center px-6 py-2 rounded-lg font-bold transition-all duration-300 ${activeTab === 'status' ? buttonActive : buttonInactive}`} onClick={() => setActiveTab('status')}>
            <CheckCircle className="w-5 h-5 mr-2" />
            SYSTEM STATUS
          </button>
          <button className={`flex items-center px-6 py-2 rounded-lg font-bold transition-all duration-300 ${activeTab === 'positions' ? buttonActive : buttonInactive}`} onClick={() => setActiveTab('positions')}>
            <Settings className="w-5 h-5 mr-2" />
            POSITIONS DASHBOARD
          </button>
        </div>
        {/* End Tabs */}

        {/* Tab Content (Simplified) */}
        {activeTab === 'status' && (
          <>
            <div className={`flex justify-around items-center mb-12 p-4 ${isLight ? 'bg-white/80 border border-gray-300' : 'bg-gray-900/50 border border-green-500/30'} rounded-lg`}>
              <div className="text-center">
                <p className={`text-3xl font-bold ${accentColor}`}>STATUS: ONLINE</p>
                <p className={`text-sm ${mutedTextColor}`}>Access Node Operational</p>
              </div>
              <div className="text-center">
                <p className={`text-3xl font-bold ${highlightColor}`}>LEVEL: 5</p>
                <p className={`text-sm ${mutedTextColor}`}>Security Clearance</p>
              </div>
            </div>

            {token ? (
              <div className={`text-center mb-12 p-8 rounded-xl max-w-full ${tokenBg}`} style={{ boxShadow: '0 0 15px rgba(52, 211, 235, 0.5)', backdropFilter: 'blur(5px)' }}>
                <p className={`text-2xl font-semibold mb-4 border-b pb-3 ${mainTextColor}`}>
                  SESSION KEY DATA STREAM (Access Token):
                </p>
                <div className={`text-left overflow-hidden rounded-md p-3 ${tokenTextColor} bg-white/10`}>
                  <p className="text-xs lg:text-sm font-mono tracking-wide break-all h-24 overflow-y-auto custom-scrollbar">
                    {/* CSS for custom scrollbar remains here */}
                    <style jsx>{`
                      .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 255, 255, 0.3); border-radius: 3px; }
                      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    `}</style>
                    {token}
                  </p>
                </div>
              </div>
            ) : (
              <p className={`text-lg font-medium text-center ${warningColor} mb-12`}>Authentication failed. Please log in again.</p>
            )}
          </>
        )}

        {activeTab === 'positions' && (
          <div className={`p-8 rounded-xl max-w-4xl ${tokenBg} border-green-500/30`} style={{ boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)' }}>
            <h2 className={`text-3xl font-bold mb-6 border-b border-gray-700 pb-2`}>
              <Settings className="inline-block w-7 h-7 mr-3 mb-1" />
              Positions Dashboard
            </h2>

            <CreatePositionForm
              token={token}
              onPositionCreated={handlePositionCreated}
              isLight={isLight}
              colors={colors}
            />

            {fetchError && (
              <div className={`p-4 my-4 rounded-md bg-red-800/20 ${colors.warningColor} border border-red-600`}>
                <p className="font-semibold">{fetchError}</p>
                <p className="text-sm">If your NestJS server is online, please ensure **CORS** allows requests from your frontend's origin (e.g., your Next.js domain).</p>
              </div>
            )}

            <PositionsList
              positions={positions}
              handleAction={handleAction}
              isLight={isLight}
              colors={colors}
              onRefresh={fetchPositions}
            />
          </div>
        )}
        {/* End Positions Dashboard Content */}

        {/* Logout */}
        <div className="flex justify-center mt-12">
          <button className={`px-10 py-4 rounded-full ${logoutButtonBg} font-extrabold text-xl text-white transition duration-300 transform hover:scale-[1.03] shadow-lg shadow-red-900/50`} onClick={handleLogout}>
            <LogOut className="inline-block w-6 h-6 mr-3" />
            TERMINATE SESSION & LOGOUT
          </button>
        </div>
      </div>

      {/* ⭐️ NEW: Render the Edit Modal */}
      {isEditModalOpen && editingPosition && (
        <EditPositionModal
          token={token}
          position={editingPosition}
          onUpdate={handlePositionUpdated}
          onClose={() => setIsEditModalOpen(false)}
          isLight={isLight}
          colors={colors}
        />
      )}
    </div>
  );
}

// --------------------------------------------------------------------------------
// --- CreatePositionForm Component ---
// --------------------------------------------------------------------------------

interface CreatePositionProps {
  token: string | null;
  onPositionCreated: () => void;
  isLight: boolean;
  colors: ThemeColors;
}

const CreatePositionForm: React.FC<CreatePositionProps> = ({ token, onPositionCreated, isLight, colors }) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const inputClasses = isLight
    ? 'p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900'
    : 'p-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-teal-400 focus:border-teal-400';

  const createButtonClasses = isLight
    ? 'bg-green-600 hover:bg-green-700'
    : 'bg-teal-600 hover:bg-teal-500';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = JSON.stringify({ code: code.trim(), name: name.trim() });
    console.log("Submitting payload:", payload);
    console.log("Authorization token:", token ? token.substring(0, 10) + '...' : 'MISSING');

    if (!code.trim() || !name.trim() || !token) {
      setStatus('error');
      setMessage('Token or required fields are missing.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch(BASE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: payload,
      });

      let errorDetail = '';

      if (!response.ok) {
        const errorText = await response.text();

        try {
          const errorJson = JSON.parse(errorText);
          errorDetail = errorJson.message || errorJson.error || errorText;
        } catch {
          errorDetail = errorText;
        }

        throw new Error(`[Status ${response.status}] ${errorDetail}`);
      }

      await response.json();

      setStatus('success');
      setMessage(`Position '${name}' created successfully!`);
      setCode('');
      setName('');
      onPositionCreated();

    } catch (error) {
      console.error("Error creating position:", error);
      setStatus('error');
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className={`mb-10 p-6 rounded-lg ${isLight ? 'bg-white shadow-md' : 'bg-gray-800 border border-teal-500/30'}`}>
      <h3 className={`text-2xl font-bold mb-4 ${colors.mainTextColor}`}>Create Position</h3>
      <form onSubmit={handleSubmit} className="flex space-x-4 items-center">
        <input
          type="text"
          placeholder="Position Code (e.g., Pres)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={`${inputClasses} flex-1`}
          required
        />
        <input
          type="text"
          placeholder="Position Name (e.g., President)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${inputClasses} flex-1`}
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`flex items-center justify-center px-6 py-2 rounded-md font-bold text-white transition duration-200 ${createButtonClasses} disabled:opacity-50`}
        >
          {status === 'loading' ? 'Creating...' : <><PlusCircle className="w-5 h-5 mr-2" /> Create</>}
        </button>
      </form>
      {status !== 'idle' && (
        <div className={`mt-3 p-2 rounded-md text-sm ${
          status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

// --------------------------------------------------------------------------------
// --- PositionsList Component ---
// --------------------------------------------------------------------------------

interface PositionsListProps {
  positions: Position[];
  handleAction: (action: 'Edit' | 'Delete', id: number) => void;
  isLight: boolean;
  colors: ThemeColors;
  onRefresh: () => void;
}

const PositionsList: React.FC<PositionsListProps> = ({ positions, handleAction, isLight, colors, onRefresh }) => {
  const { mainTextColor, mutedTextColor, tableHeaderBg, tableRowBg } = colors;

  return (
    <div className={`mt-8 ${isLight ? 'bg-white' : 'bg-gray-800'} p-4 rounded-lg shadow-xl`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-2xl font-bold ${mainTextColor}`}>Positions List ({positions.length})</h3>
        <button
          onClick={onRefresh}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition duration-200 ${isLight ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-sky-700 text-white hover:bg-sky-600'}`}
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className={tableHeaderBg}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${mutedTextColor}`}>ID</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${mutedTextColor}`}>Code</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${mutedTextColor}`}>Name</th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${mutedTextColor}`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {positions.length > 0 ? (
              positions.map((position) => (
                <tr key={position.id} className={`${tableRowBg} transition duration-150`}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${mainTextColor}`}>{position.id}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${mainTextColor}`}>{position.code}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${mainTextColor}`}>{position.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleAction('Edit', position.id)}
                      className={`inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white ${isLight ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-700 hover:bg-yellow-600'}`}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleAction('Delete', position.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className={`px-6 py-4 text-center ${mutedTextColor}`}>
                  No positions found. Create a new one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// --------------------------------------------------------------------------------
// ⭐️ NEW: EditPositionModal Component (Handles PUT Request)
// --------------------------------------------------------------------------------

interface EditPositionProps {
  token: string | null;
  position: Position;
  onUpdate: () => void;
  onClose: () => void;
  isLight: boolean;
  colors: ThemeColors;
}

const EditPositionModal: React.FC<EditPositionProps> = ({ token, position, onUpdate, onClose, isLight, colors }) => {
  // Initialize form fields with the current position data
  const [code, setCode] = useState(position.code);
  const [name, setName] = useState(position.name);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const inputClasses = isLight
    ? 'p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 w-full'
    : 'p-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-teal-400 focus:border-teal-400 w-full';

  const saveButtonClasses = isLight
    ? 'bg-blue-600 hover:bg-blue-700'
    : 'bg-blue-500 hover:bg-blue-600';

  const cancelButtonClasses = isLight ? 'bg-gray-400 hover:bg-gray-500' : 'bg-gray-600 hover:bg-gray-700';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedCode = code.trim();
    const trimmedName = name.trim();

    if (!token) {
      setStatus('error');
      setMessage('Authentication token is missing.');
      return;
    }

    // Only send fields that have changed
    const payload: { code?: string, name?: string } = {};
    if (trimmedCode !== position.code) payload.code = trimmedCode;
    if (trimmedName !== position.name) payload.name = trimmedName;

    // Prevent sending an empty body if no actual changes were made
    if (Object.keys(payload).length === 0) {
      setMessage('No changes detected.');
      setStatus('idle');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // ⬇️ API URL for PUT request uses the specific position ID
      const response = await fetch(`${BASE_API_URL}${position.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorText;
        } catch {
          errorMessage = errorText;
        }
        throw new Error(errorMessage);
      }

      setStatus('success');
      setMessage(`Position ID ${position.id} updated successfully!`);

      // Wait briefly before closing to show success message
      setTimeout(() => {
        onUpdate();
      }, 800);

    } catch (error) {
      console.error("Error updating position:", error);
      setStatus('error');
      setMessage(`Update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  // --- Modal Structure ---
  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className={`p-8 rounded-xl w-full max-w-md ${isLight ? 'bg-white shadow-2xl' : 'bg-gray-900 border border-blue-500/50'} ${colors.mainTextColor}`}>

        <h2 className="text-3xl font-bold mb-6 border-b pb-2 flex items-center">
          <Pencil className="w-6 h-6 mr-3 text-blue-400" />
          Edit Position: {position.id}
        </h2>
        <p className={`${colors.mutedTextColor} mb-4`}>Modifying **{position.name}**</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClasses}
              required
            />
          </div>

          {status !== 'idle' && (
            <div className={`p-3 rounded-md text-sm font-medium ${
              status === 'success' ? 'bg-green-500/20 text-green-400' :
              status === 'error' ? 'bg-red-500/20 text-red-400' :
              'bg-blue-500/20 text-blue-400 flex items-center'
            }`}>
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Update...
                </>
              ) : status === 'error' ? (
                <><AlertTriangle className="w-4 h-4 mr-2"/> {message}</>
              ) : (
                <><CheckCircle className="w-4 h-4 mr-2"/> {message}</>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md font-semibold text-white transition duration-200 ${cancelButtonClasses}`}
              disabled={status === 'loading'}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`flex items-center px-4 py-2 rounded-md font-bold text-white transition duration-200 ${saveButtonClasses} disabled:opacity-50`}
            >
              {status === 'loading' ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};