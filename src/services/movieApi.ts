import type { Movie, MovieDetails, MoviesResponse } from "../types/movie"

const API_BASE_URL = "https://api.themoviedb.org/3"
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"
const API_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NGNkNzE0NzM0ZmFhNjI4MzViNTFkYWY2ZTc4YjFkNCIsIm5iZiI6MTc1NjI5MDYxMi4xMzkwMDAyLCJzdWIiOiI2OGFlZGUzNDY5NDJmMTdhOWIzZDhhNTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HEvvFu1cWbtbV__4HPN8rwvZa591F7wobIHmWxr2yS4"

const apiOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
  },
}

class MovieApiService {
  private static instance: MovieApiService
  private cache: Map<string, any> = new Map()
  private cacheExpiry: Map<string, number> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  public static getInstance(): MovieApiService {
    if (!MovieApiService.instance) {
      MovieApiService.instance = new MovieApiService()
    }
    return MovieApiService.instance
  }

  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key)
    return expiry ? Date.now() < expiry : false
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, data)
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION)
  }

  private async fetchWithCache<T>(url: string, cacheKey: string): Promise<T> {
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      const response = await fetch(url, apiOptions)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      this.setCache(cacheKey, data)
      return data
    } catch (error) {
      console.error(`Error fetching ${cacheKey}:`, error)
      throw error
    }
  }

  async getNowPlayingMovies(page = 1): Promise<Movie[]> {
    const url = `${API_BASE_URL}/movie/now_playing?page=${page}`
    const cacheKey = `now_playing_${page}`

    const response = await this.fetchWithCache<MoviesResponse>(url, cacheKey)
    return response.results || []
  }

  async getPopularMovies(page = 1): Promise<Movie[]> {
    const url = `${API_BASE_URL}/movie/popular?language=en-US&page=${page}`
    const cacheKey = `popular_${page}`

    const response = await this.fetchWithCache<MoviesResponse>(url, cacheKey)
    return response.results || []
  }

  async getMovieDetails(id: number): Promise<MovieDetails> {
    const url = `${API_BASE_URL}/movie/${id}`
    const cacheKey = `movie_details_${id}`

    return await this.fetchWithCache<MovieDetails>(url, cacheKey)
  }

  async searchMovies(query: string, page = 1): Promise<Movie[]> {
    const url = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
    const cacheKey = `search_${query}_${page}`

    const response = await this.fetchWithCache<MoviesResponse>(url, cacheKey)
    return response.results || []
  }

  async getTopRatedMovies(page = 1): Promise<Movie[]> {
    const url = `${API_BASE_URL}/movie/top_rated?page=${page}`
    const cacheKey = `top_rated_${page}`

    const response = await this.fetchWithCache<MoviesResponse>(url, cacheKey)
    return response.results || []
  }

  async getUpcomingMovies(page = 1): Promise<Movie[]> {
    const url = `${API_BASE_URL}/movie/upcoming?page=${page}`
    const cacheKey = `upcoming_${page}`

    const response = await this.fetchWithCache<MoviesResponse>(url, cacheKey)
    return response.results || []
  }

  getImageUrl(path: string, size = "original"): string {
    if (!path) return "/placeholder-movie.jpg"
    return `https://image.tmdb.org/t/p/${size}${path}`
  }

  getFullImageUrl(path: string): string {
    if (!path) return "/placeholder-movie.jpg"
    return `${IMAGE_BASE_URL}${path}`
  }

  clearCache(): void {
    this.cache.clear()
    this.cacheExpiry.clear()
  }
}

export default MovieApiService.getInstance()
