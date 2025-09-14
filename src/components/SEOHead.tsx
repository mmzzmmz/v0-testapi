"use client"

import type React from "react"
import { useEffect } from "react"

interface SEOHeadProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "MoviesHub - Discover Amazing Movies",
  description = "Discover the latest and most popular movies with MoviesHub. Browse, search, and explore detailed information about your favorite films.",
  image = "/move-wepsite/icon/wepsite-icon.png",
  url = window.location.href,
}) => {
  useEffect(() => {
    // Update document title
    document.title = title

    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement("meta")
        meta.name = name
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement("meta")
        meta.setAttribute("property", property)
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    // Basic meta tags
    updateMetaTag("description", description)
    updateMetaTag("keywords", "movies, films, cinema, entertainment, streaming, reviews")
    updateMetaTag("author", "MoviesHub")

    // Open Graph tags
    updatePropertyTag("og:title", title)
    updatePropertyTag("og:description", description)
    updatePropertyTag("og:image", image)
    updatePropertyTag("og:url", url)
    updatePropertyTag("og:type", "website")
    updatePropertyTag("og:site_name", "MoviesHub")

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image")
    updateMetaTag("twitter:title", title)
    updateMetaTag("twitter:description", description)
    updateMetaTag("twitter:image", image)

    // Additional meta tags
    updateMetaTag("viewport", "width=device-width, initial-scale=1.0")
    updateMetaTag("robots", "index, follow")
  }, [title, description, image, url])

  return null
}

export default SEOHead
