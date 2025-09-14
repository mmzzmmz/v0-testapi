"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import useLocalStorage from "../hooks/useLocalStorage"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  isDark: boolean
  isLight: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeStorage] = useLocalStorage<Theme>("theme", "light")
  const [isSystemDark, setIsSystemDark] = useState(false)

  // Check system preference on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      setIsSystemDark(mediaQuery.matches)

      const handleChange = (e: MediaQueryListEvent) => {
        setIsSystemDark(e.matches)
        // Auto-switch only if user hasn't manually set a preference
        const hasManualPreference = localStorage.getItem("theme")
        if (!hasManualPreference) {
          setThemeStorage(e.matches ? "dark" : "light")
        }
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [setThemeStorage])

  // Apply theme to document
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement

      // Remove previous theme classes
      root.classList.remove("light", "dark")
      root.removeAttribute("data-theme")

      // Apply new theme
      root.classList.add(theme)
      root.setAttribute("data-theme", theme)

      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]')
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", theme === "dark" ? "#0f172a" : "#ffffff")
      } else {
        const meta = document.createElement("meta")
        meta.name = "theme-color"
        meta.content = theme === "dark" ? "#0f172a" : "#ffffff"
        document.head.appendChild(meta)
      }
    }
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setThemeStorage(newTheme)
  }

  const setTheme = (newTheme: Theme) => {
    setThemeStorage(newTheme)
  }

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
  }

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}
