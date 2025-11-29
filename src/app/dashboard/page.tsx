"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth"; 
import { Settings, LogOut, CheckCircle, AlertTriangle } from 'lucide-react';

// --- Mock Settings State for professionalism ---
interface SystemSettings {
    dataEncryption: boolean;
    autoRefresh: boolean;
    displayMode: 'Dark' | 'Holo';
    securityProtocol: 'Active' | 'Passive';
}

export default function DashboardPage() {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); 
    const [mounted, setMounted] = useState<boolean>(false); 
    const [activeTab, setActiveTab] = useState<'status' | 'settings'>('status'); 
    const [systemSettings, setSystemSettings] = useState<SystemSettings>({
        dataEncryption: true,
        autoRefresh: false,
        displayMode: 'Dark',
        securityProtocol: 'Active',
    });
    
    const router = useRouter();

    // --- Sci-Fi Theme Variables (HARDCODED DARK) ---
    const accentColor = "text-green-400"; 
    const tokenBg = "bg-gray-900/80 border border-teal-500/30"; 
    const tokenTextColor = "text-cyan-400"; 
    const logoutButtonBg = "bg-red-700 hover:bg-red-600"; 
    const buttonActive = "bg-teal-500/30 text-teal-400"; 
    const buttonInactive = "bg-gray-800 hover:bg-gray-700/50 text-gray-400"; 
    
    const loadingBgColor = "bg-gray-950";


    // --- 1. Authentication Check & Transition Setup ---
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
    }, [router]);
    
    // --- 2. Handlers ---
    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken"); 
            localStorage.removeItem("refreshToken"); 
        }
        router.push("/login"); 
    };

    const handleSettingChange = (key: keyof SystemSettings, value: any) => {
        setSystemSettings(prev => ({ ...prev, [key]: value }));
    };


    // --- Loading State ---
    if (loading) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center ${loadingBgColor} text-white font-sans`}>
                <svg className="animate-spin h-8 w-8 text-green-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-400">Securing connection handshake...</p>
            </div>
        );
    }

    // --- 3. Component Render ---
    return (
        // Removed fixed bg-gray-950 and text-white, relying on parent Layout
        <div className="flex flex-col items-center justify-center font-sans p-6">
            
            {/* --- Main Dashboard Container with Transition --- */}
            <div 
                className={`w-full max-w-4xl p-8 rounded-xl transition-all duration-1000 ease-out`}
                style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                }}
            >
                
                {/* Simple Welcome Text */}
                <p className="text-xl text-center text-teal-400/90 mb-2 font-mono h-6">
                    Access Granted: Authorized User
                </p>
                
                <h1 className={`text-6xl font-extrabold mb-8 text-center tracking-wide ${accentColor}`}>
                    [SYSTEM] DASHBOARD
                </h1>
                
                {/* --- Tab Navigation --- */}
                <div className="flex justify-center space-x-4 mb-10">
                    <button
                        className={`flex items-center px-6 py-2 rounded-lg font-bold transition-all duration-300 ${activeTab === 'status' ? buttonActive : buttonInactive}`}
                        onClick={() => setActiveTab('status')}
                    >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        SYSTEM STATUS
                    </button>
                    <button
                        className={`flex items-center px-6 py-2 rounded-lg font-bold transition-all duration-300 ${activeTab === 'settings' ? buttonActive : buttonInactive}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <Settings className="w-5 h-5 mr-2" />
                        SYSTEM SETTINGS
                    </button>
                </div>

                {/* --- Tab Content --- */}
                {activeTab === 'status' && (
                    <>
                        {/* System Status Panel (Dark Mode) */}
                        <div className="flex justify-around items-center mb-12 p-4 
                                        bg-gray-900/50 border border-green-500/30 rounded-lg">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-green-400">STATUS: ONLINE</p>
                                <p className="text-sm text-gray-500">Access Node Operational</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-yellow-400">LEVEL: 5</p>
                                <p className="text-sm text-gray-500">Security Clearance</p>
                            </div>
                        </div>

                        {token ? (
                            <div 
                                className={`text-center mb-12 p-8 rounded-xl max-w-full ${tokenBg}`}
                                style={{ 
                                    boxShadow: '0 0 15px rgba(52, 211, 235, 0.5)', 
                                    backdropFilter: 'blur(5px)' 
                                }}
                            >
                                <p className="text-2xl font-semibold mb-4 text-white/90 border-b border-gray-700/50 pb-3">
                                    SESSION KEY DATA STREAM (Access Token):
                                </p>
                                <div className={`text-left overflow-hidden rounded-md p-3 ${tokenTextColor}/90 bg-gray-950`}>
                                    <p className="text-xs lg:text-sm font-mono tracking-wide break-all h-24 overflow-y-auto custom-scrollbar">
                                        {/* Custom scrollbar styles (fixed dark mode color) */}
                                        <style jsx>{`
                                            .custom-scrollbar::-webkit-scrollbar {
                                                width: 6px;
                                                height: 6px;
                                            }
                                            .custom-scrollbar::-webkit-scrollbar-thumb {
                                                background: rgba(0, 255, 255, 0.3); /* Cyan color */
                                                border-radius: 3px;
                                            }
                                            .custom-scrollbar::-webkit-scrollbar-track {
                                                background: transparent;
                                            }
                                        `}</style>
                                        {token} 
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-red-400 text-lg font-medium text-center mb-12">Authentication failed. Please log in again.</p>
                        )}
                    </>
                )}

                {activeTab === 'settings' && (
                    <div 
                        className={`p-8 rounded-xl max-w-full ${tokenBg} border-green-500/30`}
                        style={{ boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)' }} // Yellow/Gold glow for settings
                    >
                        <h2 className="text-3xl font-bold mb-6 text-yellow-400 border-b border-gray-700 pb-2">
                            <Settings className="inline-block w-7 h-7 mr-3 mb-1" />
                            Configuration Console
                        </h2>
                        
                        {/* Setting 1: Data Encryption */}
                        <SettingToggle
                            label="Data Stream Encryption"
                            description="Toggle real-time data scrambling for heightened security."
                            checked={systemSettings.dataEncryption}
                            onChange={() => handleSettingChange('dataEncryption', !systemSettings.dataEncryption)}
                            accentColor={systemSettings.dataEncryption ? accentColor : 'text-red-400'}
                        />

                        {/* Setting 2: Auto Refresh */}
                        <SettingToggle
                            label="Status Auto-Refresh"
                            description="Automatically fetch telemetry data every 5 seconds."
                            checked={systemSettings.autoRefresh}
                            onChange={() => handleSettingChange('autoRefresh', !systemSettings.autoRefresh)}
                            accentColor={systemSettings.autoRefresh ? accentColor : 'text-gray-500'}
                        />

                        {/* Setting 3: Display Mode (Radio/Select style) */}
                        <SettingSelect
                            label="Interface Display Mode"
                            description="Change the visual rendering protocol."
                            value={systemSettings.displayMode}
                            options={['Dark', 'Holo']}
                            onChange={(value) => handleSettingChange('displayMode', value as 'Dark' | 'Holo')}
                        />
                        
                        {/* Setting 4: Security Protocol Status (Info Only) */}
                        <div className="mt-8 pt-4 border-t border-gray-700">
                            <p className="text-lg font-semibold text-white/90 mb-2 flex items-center">
                                Security Protocol Status: 
                                <span className={`ml-3 font-mono px-3 py-1 rounded-full text-sm font-bold ${systemSettings.securityProtocol === 'Active' ? 'bg-green-600/30 text-green-400' : 'bg-red-600/30 text-red-400'}`}>
                                    {systemSettings.securityProtocol}
                                </span>
                                {systemSettings.securityProtocol === 'Active' ? 
                                    <CheckCircle className="w-5 h-5 ml-2 text-green-400" /> : 
                                    <AlertTriangle className="w-5 h-5 ml-2 text-red-400" />
                                }
                            </p>
                            <p className="text-sm text-gray-500">Security protocols are managed by the main network core and cannot be manually overridden.</p>
                        </div>


                    </div>
                )}

                {/* --- Logout Button --- */}
                <div className="flex justify-center mt-12">
                    <button
                        className={`px-10 py-4 rounded-full ${logoutButtonBg} font-extrabold text-xl text-white transition duration-300 transform hover:scale-[1.03] shadow-lg shadow-red-900/50`}
                        onClick={handleLogout}
                    >
                        <LogOut className="inline-block w-6 h-6 mr-3" />
                        TERMINATE SESSION & LOGOUT
                    </button>
                </div>
            </div>
            {/* ------------------------------------------------ */}
        </div>
    );
}

// --- Helper Components for Professionalism (HARDCODED DARK) ---

interface ToggleProps {
    label: string;
    description: string;
    checked: boolean;
    onChange: () => void;
    accentColor: string;
}

const SettingToggle: React.FC<ToggleProps> = ({ label, description, checked, onChange }) => (
    // Fixed dark mode border colors and text colors
    <div className="flex items-center justify-between p-4 mb-4 border-b border-gray-800 last:border-b-0">
        <div>
            <label className="text-lg font-semibold block text-white/90">{label}</label>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <button
            onClick={onChange}
            className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 focus:outline-none ${
                checked 
                    ? 'bg-green-500' 
                    : 'bg-gray-600'
            }`}
        >
            <span
                className={`inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ${
                    checked ? 'translate-x-7' : 'translate-x-1'
                }`}
            />
        </button>
    </div>
);

interface SelectProps {
    label: string;
    description: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}

const SettingSelect: React.FC<SelectProps> = ({ label, description, value, options, onChange }) => (
    // Fixed dark mode border colors and text colors
    <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div>
            <label className="text-lg font-semibold block text-white/90">{label}</label>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            // Fixed dark mode select styling
            className="p-2 rounded-lg bg-gray-800 border border-teal-500/50 text-white focus:ring-teal-400 focus:border-teal-400 transition"
        >
            {options.map(option => (
                <option key={option} value={option}>{option} Mode</option>
            ))}
        </select>
    </div>
);  