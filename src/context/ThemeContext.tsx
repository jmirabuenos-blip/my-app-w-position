// context/ThemeContext.tsx
"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// 1. Define the Context structure
type ThemeContextType = {
  theme: 'dark' | 'light';
  isLight: boolean;
  toggleTheme: () => void;
};

// 2. Create the Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. Create the Provider Component
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or default to 'dark'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      // Check for 'appTheme' in localStorage, default to 'dark'
      return (localStorage.getItem('appTheme') as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });

  // 4. Update localStorage and the root class whenever theme changes
  useEffect(() => {
    localStorage.setItem('appTheme', theme);
    
    // Update HTML element classes for Tailwind to pick up the theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');

    // Remove the opposite class just to be clean, though toggle handles it
    document.documentElement.classList.remove(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

  // 5. Toggle function
  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  const isLight = theme === 'light';

  return (
    <ThemeContext.Provider value={{ theme, isLight, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 6. Custom Hook for easy consumption
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}