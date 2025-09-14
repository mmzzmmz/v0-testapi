"use client"

import type React from "react"
import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react"
import type { Movie, MovieDetails, SortOption, FilterOptions } from "../types/movie"
import movieApi from "../services/movieApi"

interface MoviesState {
  movies: Movie[]
  popularMovies: Movie[]
  movieDetails: MovieDetails | null
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  searchQuery: string
  filters: FilterOptions
  selectedMovie: Movie | null
}

type MoviesAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_MOVIES"; payload: Movie[] }
  | { type: "SET_POPULAR_MOVIES"; payload: Movie[] }
  | { type: "SET_MOVIE_DETAILS"; payload: MovieDetails | null }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_TOTAL_PAGES"; payload: number }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_FILTERS"; payload: FilterOptions }
  | { type: "SET_SELECTED_MOVIE"; payload: Movie | null }
  | { type: "APPEND_MOVIES"; payload: Movie[] }

const initialState: MoviesState = {
  movies: [],
  popularMovies: [],
  movieDetails: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  searchQuery: "",
  filters: {
    language: "all",
    media: "all",
    sortBy: "newest",
  },
  selectedMovie: null,
}

const moviesReducer = (state: MoviesState, action: MoviesAction): MoviesState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "SET_MOVIES":
      return { ...state, movies: action.payload, loading: false, error: null }
    case "SET_POPULAR_MOVIES":
      return { ...state, popularMovies: action.payload, loading: false, error: null }
    case "SET_MOVIE_DETAILS":
      return { ...state, movieDetails: action.payload, loading: false, error: null }
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload }
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload }
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload }
    case "SET_FILTERS":
      return { ...state, filters: action.payload }
    case "SET_SELECTED_MOVIE":
      return { ...state, selectedMovie: action.payload }
    case "APPEND_MOVIES":
      return {
        ...state,
        movies: [...state.movies, ...action.payload],
        loading: false,
        error: null,
      }
    default:
      return state
  }
}

interface MoviesContextType extends MoviesState {
  fetchNowPlayingMovies: (page?: number) => Promise<void>
  fetchPopularMovies: (page?: number) => Promise<void>
  fetchMovieDetails: (id: number) => Promise<void>
  searchMovies: (query: string, page?: number) => Promise<void>
  loadMoreMovies: () => Promise<void>
  setFilters: (filters: FilterOptions) => void
  setSelectedMovie: (movie: Movie | null) => void
  sortMovies: (movies: Movie[], sortBy: SortOption) => Movie[]
  filterMovies: (movies: Movie[], filters: FilterOptions) => Movie[]
  clearError: () => void
}

const MoviesContext = createContext<MoviesContextType | undefined>(undefined)

export const useMovies = (): MoviesContextType => {
  const context = useContext(MoviesContext)
  if (!context) {
    throw new Error("useMovies must be used within a MoviesProvider")
  }
  return context
}

interface MoviesProviderProps {
  children: ReactNode
}

export const MoviesProvider: React.FC<MoviesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(moviesReducer, initialState)

  const fetchNowPlayingMovies = useCallback(async (page = 1) => {
    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "SET_ERROR", payload: null })

    try {
      const movies = await movieApi.getNowPlayingMovies(page)
      dispatch({ type: "SET_MOVIES", payload: movies })
      dispatch({ type: "SET_CURRENT_PAGE", payload: page })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch movies" })
    }
  }, [])

  const fetchPopularMovies = useCallback(async (page = 1) => {
    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "SET_ERROR", payload: null })

    try {
      const movies = await movieApi.getPopularMovies(page)
      dispatch({ type: "SET_POPULAR_MOVIES", payload: movies })
      dispatch({ type: "SET_CURRENT_PAGE", payload: page })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch popular movies" })
    }
  }, [])

  const fetchMovieDetails = useCallback(async (id: number) => {
    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "SET_ERROR", payload: null })

    try {
      const details = await movieApi.getMovieDetails(id)
      dispatch({ type: "SET_MOVIE_DETAILS", payload: details })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch movie details" })
    }
  }, [])

  const searchMovies = useCallback(async (query: string, page = 1) => {
    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "SET_ERROR", payload: null })
    dispatch({ type: "SET_SEARCH_QUERY", payload: query })

    try {
      const movies = await movieApi.searchMovies(query, page)
      dispatch({ type: "SET_MOVIES", payload: movies })
      dispatch({ type: "SET_CURRENT_PAGE", payload: page })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to search movies" })
    }
  }, [])

  const loadMoreMovies = useCallback(async () => {
    if (state.loading) return

    const nextPage = state.currentPage + 1
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      let movies: Movie[]
      if (state.searchQuery) {
        movies = await movieApi.searchMovies(state.searchQuery, nextPage)
      } else {
        movies = await movieApi.getNowPlayingMovies(nextPage)
      }

      dispatch({ type: "APPEND_MOVIES", payload: movies })
      dispatch({ type: "SET_CURRENT_PAGE", payload: nextPage })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to load more movies" })
    }
  }, [state.currentPage, state.searchQuery, state.loading])

  const setFilters = useCallback((filters: FilterOptions) => {
    dispatch({ type: "SET_FILTERS", payload: filters })
  }, [])

  const setSelectedMovie = useCallback((movie: Movie | null) => {
    dispatch({ type: "SET_SELECTED_MOVIE", payload: movie })
  }, [])

  const sortMovies = useCallback((movies: Movie[], sortBy: SortOption): Movie[] => {
    const sortedMovies = [...movies]

    switch (sortBy) {
      case "newest":
        return sortedMovies.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
      case "popularity":
        return sortedMovies.sort((a, b) => b.popularity - a.popularity)
      case "alphabetical":
        return sortedMovies.sort((a, b) => a.title.localeCompare(b.title))
      default:
        return sortedMovies
    }
  }, [])

  const filterMovies = useCallback(
    (movies: Movie[], filters: FilterOptions): Movie[] => {
      let filteredMovies = [...movies]

      // Apply language filter (simplified for demo)
      if (filters.language !== "all") {
        // This would need more sophisticated filtering based on actual language data
        filteredMovies = filteredMovies.filter((movie) => {
          if (filters.language === "subtitled") {
            return movie.original_language !== "en"
          }
          return movie.original_language === "en"
        })
      }

      // Apply media filter (simplified - would need TV shows data)
      if (filters.media === "movies") {
        // All current data are movies, so no filtering needed
      }

      return sortMovies(filteredMovies, filters.sortBy)
    },
    [sortMovies],
  )

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null })
  }, [])

  const contextValue: MoviesContextType = {
    ...state,
    fetchNowPlayingMovies,
    fetchPopularMovies,
    fetchMovieDetails,
    searchMovies,
    loadMoreMovies,
    setFilters,
    setSelectedMovie,
    sortMovies,
    filterMovies,
    clearError,
  }

  return <MoviesContext.Provider value={contextValue}>{children}</MoviesContext.Provider>
}
