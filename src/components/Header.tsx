"use client"

import type React from "react"
import { useState } from "react"
import { useMovies } from "../contexts/MoviesContext"
import ThemeToggle from "./ThemeToggle"

const Header: React.FC = () => {
  const { searchMovies, fetchNowPlayingMovies, fetchPopularMovies } = useMovies()
  const [searchQuery, setSearchQuery] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      searchMovies(searchQuery.trim())
    }
  }

  const handleNavClick = (type: "new" | "popular") => {
    if (type === "new") {
      fetchNowPlayingMovies()
    } else {
      fetchPopularMovies()
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 animate-slide-in-left">
            <img src="/move-wepsite/icon/wepsite-icon.png" alt="Movies App" className="w-8 h-8 sm:w-10 sm:h-10" />
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Movies<span className="text-accent-primary">Hub</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavClick("new")}
              className="text-foreground hover:text-accent-primary transition-colors duration-200 font-medium"
            >
              New Movies
            </button>
            <button
              onClick={() => handleNavClick("popular")}
              className="text-foreground hover:text-accent-primary transition-colors duration-200 font-medium"
            >
              Popular
            </button>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center space-x-2 animate-slide-in-right">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="w-64 lg:w-80 px-4 py-2 pl-10 bg-secondary border border-border rounded-full text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-200"
              />
              <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-accent-primary text-white rounded-full hover:bg-accent-hover transition-colors duration-200 font-medium"
            >
              Search
            </button>
          </form>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-3">
            <ThemeToggle size="md" />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full bg-secondary hover:bg-accent transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <i className={`fa-solid ${isMenuOpen ? "fa-times" : "fa-bars"} text-foreground`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="sm:hidden flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies..."
                    className="w-full px-4 py-2 pl-10 bg-secondary border border-border rounded-full text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  />
                  <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent-primary text-white rounded-full hover:bg-accent-hover transition-colors duration-200"
                >
                  Search
                </button>
              </form>

              {/* Mobile Navigation */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleNavClick("new")}
                  className="text-left py-2 text-foreground hover:text-accent-primary transition-colors duration-200 font-medium"
                >
                  New Movies
                </button>
                <button
                  onClick={() => handleNavClick("popular")}
                  className="text-left py-2 text-foreground hover:text-accent-primary transition-colors duration-200 font-medium"
                >
                  Popular
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
