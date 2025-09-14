"use client"

import type React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useNavigate } from "react-router-dom"
import type { Movie } from "../types/movie"
import movieApi from "../services/movieApi"

interface MovieCardProps {
  movie: Movie
  index: number
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index }) => {
  const navigate = useNavigate()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-100, 100], [30, -30]))
  const rotateY = useSpring(useTransform(x, [-100, 100], [-30, 30]))

  const handlePlayClick = () => {
    navigate(`/details/${movie.id}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear()
  }

  const formatRating = (rating: number) => {
    return rating.toFixed(1)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(event.clientX - centerX)
    y.set(event.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.3, type: "spring", stiffness: 300 },
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform cursor-pointer"
    >
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <motion.img
          src={movieApi.getFullImageUrl(movie.poster_path) || "/placeholder.svg"}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
        >
          <div className="absolute bottom-4 left-4 right-4">
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-white font-bold text-lg mb-2 line-clamp-2"
            >
              {movie.title}
            </motion.h3>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="flex items-center justify-between text-white/80 text-sm mb-3"
            >
              <span>{formatDate(movie.release_date)}</span>
              <div className="flex items-center space-x-1">
                <motion.i
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="fa-solid fa-star text-yellow-400"
                />
                <span>{formatRating(movie.vote_average)}</span>
              </div>
            </motion.div>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-white/90 text-sm line-clamp-3 mb-4"
            >
              {movie.overview}
            </motion.p>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              onClick={handlePlayClick}
              className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-hover hover:to-accent-primary text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl"
            >
              <motion.i
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                className="fa-solid fa-play"
              />
              <span>Watch Now</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
          whileHover={{ scale: 1.1 }}
          className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1"
        >
          <motion.i
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="fa-solid fa-star text-yellow-400"
          />
          <span>{formatRating(movie.vote_average)}</span>
        </motion.div>

        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
          className="absolute top-3 left-3 bg-accent-primary/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1"
        >
          <motion.i
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="fa-solid fa-fire text-orange-400"
          />
          <span>{Math.round(movie.popularity)}</span>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        className="p-4"
      >
        <motion.h3
          whileHover={{ color: "var(--accent-primary)" }}
          transition={{ duration: 0.2 }}
          className="font-bold text-foreground text-lg mb-2 line-clamp-1 transition-colors duration-200"
        >
          {movie.title}
        </motion.h3>

        <div className="flex items-center justify-between text-muted-foreground text-sm mb-2">
          <motion.span whileHover={{ scale: 1.05 }} className="flex items-center space-x-1">
            <i className="fa-solid fa-calendar text-blue-400"></i>
            <span>{formatDate(movie.release_date)}</span>
          </motion.span>

          <motion.span whileHover={{ scale: 1.05 }} className="flex items-center space-x-1">
            <i className="fa-solid fa-eye text-green-400"></i>
            <span>{Math.round(movie.popularity)}</span>
          </motion.span>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2">{movie.overview}</p>
      </motion.div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto"
      >
        <motion.div
          whileHover={{ scale: 1.2, rotate: 360 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          onClick={handlePlayClick}
          className="bg-gradient-to-r from-accent-primary to-accent-secondary text-white p-6 rounded-full shadow-2xl cursor-pointer backdrop-blur-sm border border-white/20"
        >
          <motion.i
            animate={{ x: [0, 2, 0] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            className="fa-solid fa-play text-2xl"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
      />
    </motion.div>
  )
}

export default MovieCard
