"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMovies } from "../contexts/MoviesContext"
import type { SortOption, FilterLanguage, FilterMedia } from "../types/movie"

const FilterControls: React.FC = () => {
  const { filters, setFilters } = useMovies()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const sortOptions: { value: SortOption; label: string; icon: string; color: string }[] = [
    { value: "newest", label: "Newest", icon: "fa-clock", color: "text-blue-400" },
    { value: "popularity", label: "Popularity", icon: "fa-fire", color: "text-orange-400" },
    { value: "alphabetical", label: "Alphabetical", icon: "fa-sort-alpha-down", color: "text-green-400" },
  ]

  const languageOptions: { value: FilterLanguage; label: string }[] = [
    { value: "all", label: "All Languages" },
    { value: "subtitled", label: "Subtitled" },
    { value: "dubbed", label: "Dubbed" },
  ]

  const mediaOptions: { value: FilterMedia; label: string }[] = [
    { value: "all", label: "All Media" },
    { value: "movies", label: "Movies" },
    { value: "series", label: "Series" },
  ]

  const handleSortChange = (sortBy: SortOption) => {
    setFilters({ ...filters, sortBy })
    setIsDropdownOpen(false)
  }

  const handleLanguageChange = (language: FilterLanguage) => {
    setFilters({ ...filters, language })
  }

  const handleMediaChange = (media: FilterMedia) => {
    setFilters({ ...filters, media })
  }

  const currentSortOption = sortOptions.find((option) => option.value === filters.sortBy)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
    >
      <motion.h1
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-accent-primary bg-clip-text text-transparent"
      >
        New Added Movies
      </motion.h1>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 px-4 py-2 bg-secondary hover:bg-accent border border-border rounded-lg transition-all duration-300 min-w-[140px] shadow-sm hover:shadow-md"
          >
            <motion.i
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className={`fa-solid ${currentSortOption?.icon} ${currentSortOption?.color}`}
            />
            <span className="text-foreground font-medium">{currentSortOption?.label}</span>
            <motion.i
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="fa-solid fa-chevron-down text-muted-foreground ml-auto"
            />
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
                className="absolute top-full left-0 mt-2 w-full bg-card border border-border rounded-lg shadow-xl z-10 overflow-hidden backdrop-blur-sm"
              >
                {sortOptions.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ backgroundColor: "var(--accent)", x: 5 }}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full flex items-center space-x-2 px-4 py-3 text-left transition-all duration-200 ${
                      filters.sortBy === option.value ? "bg-accent text-accent-primary" : "text-foreground"
                    }`}
                  >
                    <motion.i
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                      className={`fa-solid ${option.icon} ${option.color}`}
                    />
                    <span>{option.label}</span>
                    {filters.sortBy === option.value && (
                      <motion.i
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="fa-solid fa-check ml-auto text-accent-primary"
                      />
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center space-x-2 px-4 py-2 border border-border rounded-lg transition-all duration-300 shadow-sm hover:shadow-md ${
            isFilterOpen ? "bg-accent-primary text-white" : "bg-secondary hover:bg-accent"
          }`}
        >
          <motion.i
            animate={{ rotate: isFilterOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="fa-solid fa-sliders"
          />
          <span className="font-medium">Filter</span>
          {isFilterOpen && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              className="w-2 h-2 bg-white rounded-full"
            />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
            className="w-full bg-card border border-border rounded-lg p-6 mt-4 shadow-lg backdrop-blur-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Language Filter */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <motion.i
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="fa-solid fa-language text-accent-primary"
                  />
                  <span>Language</span>
                </h3>
                <div className="space-y-2">
                  {languageOptions.map((option, index) => (
                    <motion.label
                      key={option.value}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-accent transition-colors duration-200"
                    >
                      <input
                        type="radio"
                        name="language"
                        value={option.value}
                        checked={filters.language === option.value}
                        onChange={() => handleLanguageChange(option.value)}
                        className="w-4 h-4 text-accent-primary bg-secondary border-border focus:ring-accent-primary focus:ring-2"
                      />
                      <span className="text-foreground">{option.label}</span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>

              {/* Media Filter */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <motion.i
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    className="fa-solid fa-film text-accent-primary"
                  />
                  <span>Media</span>
                </h3>
                <div className="space-y-2">
                  {mediaOptions.map((option, index) => (
                    <motion.label
                      key={option.value}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                      whileHover={{ x: -5 }}
                      className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-accent transition-colors duration-200"
                    >
                      <input
                        type="radio"
                        name="media"
                        value={option.value}
                        checked={filters.media === option.value}
                        onChange={() => handleMediaChange(option.value)}
                        className="w-4 h-4 text-accent-primary bg-secondary border-border focus:ring-accent-primary focus:ring-2"
                      />
                      <span className="text-foreground">{option.label}</span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default FilterControls
