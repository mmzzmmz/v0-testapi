"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useMovies } from "../contexts/MoviesContext"
import MovieCard from "../components/MovieCard"
import FilterControls from "../components/FilterControls"
import LoadingSpinner from "../components/LoadingSpinner"
import SEOHead from "../components/SEOHead"
import useIntersectionObserver from "../hooks/useIntersectionObserver"

const HomePage: React.FC = () => {
  const {
    movies,
    popularMovies,
    loading,
    error,
    fetchNowPlayingMovies,
    fetchPopularMovies,
    filterMovies,
    filters,
    clearError,
    loadMoreMovies,
    currentPage,
  } = useMovies()

  const [currentView, setCurrentView] = useState<"new" | "popular">("new")
  const [displayedMovies, setDisplayedMovies] = useState(movies)
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: false,
  })

  useEffect(() => {
    fetchNowPlayingMovies()
  }, [fetchNowPlayingMovies])

  useEffect(() => {
    const moviesToFilter = currentView === "new" ? movies : popularMovies
    const filtered = filterMovies(moviesToFilter, filters)
    setDisplayedMovies(filtered)
  }, [movies, popularMovies, filters, filterMovies, currentView])

  // Auto-load more when scrolling near bottom
  useEffect(() => {
    if (isIntersecting && !loading && displayedMovies.length > 0) {
      loadMoreMovies()
    }
  }, [isIntersecting, loading, displayedMovies.length, loadMoreMovies])

  const handleViewChange = (view: "new" | "popular") => {
    setCurrentView(view)
    if (view === "popular" && popularMovies.length === 0) {
      fetchPopularMovies()
    }
  }

  if (error) {
    return (
      <>
        <SEOHead title="Error - MoviesHub" description="An error occurred while loading movies." />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="text-red-500 text-6xl mb-4"
            >
              <i className="fa-solid fa-exclamation-triangle"></i>
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Oops! Something went wrong</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                clearError()
                fetchNowPlayingMovies()
              }}
              className="px-6 py-3 bg-accent-primary hover:bg-accent-hover text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEOHead
        title={`${currentView === "new" ? "New" : "Popular"} Movies - MoviesHub`}
        description={`Discover the ${currentView === "new" ? "latest" : "most popular"} movies with detailed information, ratings, and reviews.`}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-secondary rounded-lg p-1 flex shadow-lg">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleViewChange("new")}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                currentView === "new"
                  ? "bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              New Movies
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleViewChange("popular")}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                currentView === "popular"
                  ? "bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Popular
            </motion.button>
          </div>
        </motion.div>

        {/* Filter Controls */}
        <FilterControls />

        {/* Movies Grid */}
        {loading && displayedMovies.length === 0 ? (
          <LoadingSpinner size="lg" text="Loading amazing movies..." />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12"
            >
              {displayedMovies.map((movie, index) => (
                <MovieCard key={`${movie.id}-${index}`} movie={movie} index={index} />
              ))}
            </motion.div>

            {/* Intersection Observer Target */}
            <div ref={targetRef} className="h-10" />

            {/* Loading More */}
            {loading && displayedMovies.length > 0 && (
              <div className="text-center mt-8">
                <LoadingSpinner size="md" text="Loading more movies..." />
              </div>
            )}

            {/* Empty State */}
            {displayedMovies.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  className="text-muted-foreground text-6xl mb-4"
                >
                  <i className="fa-solid fa-film"></i>
                </motion.div>
                <h2 className="text-2xl font-bold text-foreground mb-2">No movies found</h2>
                <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default HomePage
