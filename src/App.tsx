import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { MoviesProvider } from "./contexts/MoviesContext"
import ErrorBoundary from "./components/ErrorBoundary"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import DetailsPage from "./pages/DetailsPage"
import ScrollToTop from "./components/ScrollToTop"
import SEOHead from "./components/SEOHead"
import "./styles/globals.css"

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <MoviesProvider>
          <Router>
            <SEOHead />
            <div className="app">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/details/:id" element={<DetailsPage />} />
                </Routes>
              </main>
              <ScrollToTop />
            </div>
          </Router>
        </MoviesProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
