import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Navigate, Routes, useLocation } from "react-router";
import AddMovieReviewPage from './pages/addMovieReviewPage'
import HomePage from "./pages/homePage";
import MoviesPage from "./pages/moviesPage";
import UpcomingMoviesPage from './pages/upcomingMoviesPage'
import MoviePage from "./pages/movieDetailsPage";
import FavoriteMoviesPage from "./pages/favoriteMoviesPage";
import MovieReviewPage from "./pages/movieReviewPage";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import SiteHeader from './components/siteHeader'
import MoviesContextProvider from "./contexts/moviesContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 360000,
      refetchInterval: 360000, 
      refetchOnWindowFocus: false
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Global background wrapper so background fills viewport and persists across pages */}
        <div style={{ backgroundColor: '#00206bff', color: '#39f', minHeight: '100vh', minWidth: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Show header on all routes except the root landing page */}
          <RouteAwareHeader />
          <MoviesContextProvider>
            <Routes>
          <Route path="/movies/favorites" element={<FavoriteMoviesPage />} />
          <Route path="/reviews/:id" element={ <MovieReviewPage /> } />
          <Route path="/movies/:id" element={<MoviePage />} />
          <Route path="/reviews/form" element={ <AddMovieReviewPage /> } />
          <Route path="/movies/upcoming" element={<UpcomingMoviesPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={ <Navigate to="/" /> } />
            </Routes>
          </MoviesContextProvider>
        </div>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};


const rootElement = createRoot( document.getElementById("root") )
rootElement.render(<App />);

function RouteAwareHeader() {
  const location = useLocation();
  // hide header only on the root landing page
  if (location && location.pathname === "/") return null;
  return <SiteHeader />;
}
