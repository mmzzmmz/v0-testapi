"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useTheme } from "../contexts/ThemeContext"

interface ThemeToggleProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "", size = "md" }) => {
  const { theme, toggleTheme } = useTheme()

  const sizeClasses = {
    sm: "w-12 h-6",
    md: "w-14 h-7",
    lg: "w-16 h-8",
  }

  const thumbSizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7",
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center ${sizeClasses[size]} bg-secondary hover:bg-accent border-2 border-border rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-background ${className}`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-r from-indigo-500 to-purple-600"
            : "bg-gradient-to-r from-yellow-400 to-orange-500"
        }`}
      />

      {/* Thumb */}
      <motion.div
        layout
        className={`relative ${thumbSizeClasses[size]} bg-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-300`}
        animate={{
          x: theme === "dark" ? "100%" : "0%",
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.i
          key={theme}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ duration: 0.3 }}
          className={`fa-solid ${theme === "dark" ? "fa-moon text-indigo-600" : "fa-sun text-orange-500"} text-xs`}
        />
      </motion.div>

      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1">
        <motion.i
          animate={{
            opacity: theme === "light" ? 1 : 0.3,
            scale: theme === "light" ? 1 : 0.8,
          }}
          className="fa-solid fa-sun text-white text-xs"
        />
        <motion.i
          animate={{
            opacity: theme === "dark" ? 1 : 0.3,
            scale: theme === "dark" ? 1 : 0.8,
          }}
          className="fa-solid fa-moon text-white text-xs"
        />
      </div>
    </button>
  )
}

export default ThemeToggle
