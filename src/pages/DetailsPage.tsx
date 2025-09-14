"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useMovies } from "../contexts/MoviesContext"
import LoadingSpinner from "../components/LoadingSpinner"
import movieApi from "../services/movieApi"

const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { movieDetails, loading, error, fetchMovieDetails, clearError } = useMovies()
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "cast">("overview")

  useEffect(() => {
    if (id) {
      fetchMovieDetails(Number(id))
    }
  }, [id, fetchMovieDetails])

  const handleBack = () => {
    navigate(-1)
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading movie details..." />
      </div>
    )
  }

  if (error || !movieDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">
            <i className="fa-solid fa-exclamation-triangle"></i>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Movie not found</h2>
          <p className="text-muted-foreground mb-6">{error || "The requested movie could not be found."}</p>
          <div className="space-x-4">
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-secondary hover:bg-accent text-foreground rounded-lg transition-colors duration-200 font-medium"
            >
              Go Back
            </button>
            <button
              onClick={() => {
                clearError()
                if (id) fetchMovieDetails(Number(id))
              }}
              className="px-6 py-3 bg-accent-primary hover:bg-accent-hover text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${movieApi.getFullImageUrl(movieDetails.backdrop_path)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30"></div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={handleBack}
          className="absolute top-24 left-4 sm:left-8 z-10 flex items-center space-x-2 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors duration-200 backdrop-blur-sm"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span className="hidden sm:inline">Back</span>
        </motion.button>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Movie Poster */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative group">
                <img
                  src={movieApi.getFullImageUrl(movieDetails.poster_path) || "/placeholder.svg"}
                  alt={movieDetails.title}
                  className="w-64 sm:w-80 lg:w-96 rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>

            {/* Movie Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-white space-y-6"
            >
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-balance">{movieDetails.title}</h1>
                {movieDetails.tagline && (
                  <p className="text-lg sm:text-xl text-white/80 italic">{movieDetails.tagline}</p>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
                <div className="flex items-center space-x-1">
                  <i className="fa-solid fa-star text-yellow-400"></i>
                  <span className="font-semibold">{movieDetails.vote_average.toFixed(1)}</span>
                  <span className="text-white/60">({movieDetails.vote_count.toLocaleString()} votes)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <i className="fa-solid fa-calendar text-blue-400"></i>
                  <span>{formatDate(movieDetails.release_date)}</span>
                </div>
                {movieDetails.runtime && (
                  <div className="flex items-center space-x-1">
                    <i className="fa-solid fa-clock text-green-400"></i>
                    <span>{formatRuntime(movieDetails.runtime)}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {movieDetails.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsTrailerOpen(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-accent-primary hover:bg-accent-hover text-white rounded-lg font-semibold transition-colors duration-200"
                >
                  <i className="fa-solid fa-play"></i>
                  <span>Watch Trailer</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-semibold transition-colors duration-200"
                >
                  <i className="fa-solid fa-bookmark"></i>
                  <span>Save</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-semibold transition-colors duration-200"
                >
                  <i className="fa-solid fa-share"></i>
                  <span>Share</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce"
        >
          <i className="fa-solid fa-chevron-down text-2xl"></i>
        </motion.div>
      </motion.div>

      {/* Details Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="bg-background py-12"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-secondary rounded-lg p-1 flex">
              {[
                { key: "overview", label: "Overview", icon: "fa-info-circle" },
                { key: "details", label: "Details", icon: "fa-list" },
                { key: "cast", label: "Cast", icon: "fa-users" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                    activeTab === tab.key
                      ? "bg-accent-primary text-white shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <i className={`fa-solid ${tab.icon}`}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Synopsis</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">{movieDetails.overview}</p>
                  </div>

                  {movieDetails.production_companies.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">Production Companies</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {movieDetails.production_companies.map((company) => (
                          <div key={company.id} className="text-center">
                            {company.logo_path && (
                              <img
                                src={movieApi.getImageUrl(company.logo_path, "w200") || "/placeholder.svg"}
                                alt={company.name}
                                className="h-12 mx-auto mb-2 object-contain"
                              />
                            )}
                            <p className="text-sm text-muted-foreground">{company.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "details" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Movie Details</h2>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-muted-foreground">Status</span>
                        <span className="text-foreground font-medium">{movieDetails.status}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-muted-foreground">Original Language</span>
                        <span className="text-foreground font-medium uppercase">{movieDetails.original_language}</span>
                      </div>

                      {movieDetails.budget > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-muted-foreground">Budget</span>
                          <span className="text-foreground font-medium">{formatCurrency(movieDetails.budget)}</span>
                        </div>
                      )}

                      {movieDetails.revenue > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-muted-foreground">Revenue</span>
                          <span className="text-foreground font-medium">{formatCurrency(movieDetails.revenue)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground">Languages</h3>
                    <div className="space-y-2">
                      {movieDetails.spoken_languages.map((language) => (
                        <div key={language.iso_639_1} className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-accent-primary rounded-full"></span>
                          <span className="text-foreground">{language.english_name}</span>
                        </div>
                      ))}
                    </div>

                    {movieDetails.production_countries.length > 0 && (
                      <>
                        <h3 className="text-xl font-semibold text-foreground mt-6">Countries</h3>
                        <div className="space-y-2">
                          {movieDetails.production_countries.map((country) => (
                            <div key={country.iso_3166_1} className="flex items-center space-x-2">
                              <span className="w-2 h-2 bg-accent-secondary rounded-full"></span>
                              <span className="text-foreground">{country.name}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "cast" && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground text-6xl mb-4">
                    <i className="fa-solid fa-users"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Cast Information</h3>
                  <p className="text-muted-foreground">Cast details will be available soon.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Trailer Modal */}
      <AnimatePresence>
        {isTrailerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setIsTrailerOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-4xl mx-4 bg-card rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Movie Trailer</h3>
                <button
                  onClick={() => setIsTrailerOpen(false)}
                  className="p-2 hover:bg-secondary rounded-full transition-colors duration-200"
                >
                  <i className="fa-solid fa-times text-foreground"></i>
                </button>
              </div>
              <div className="aspect-video bg-secondary flex items-center justify-center">
                <div className="text-center">
                  <div className="text-muted-foreground text-6xl mb-4">
                    <i className="fa-solid fa-play-circle"></i>
                  </div>
                  <p className="text-muted-foreground">Trailer not available</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DetailsPage
