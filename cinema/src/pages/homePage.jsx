import React from "react";
import { getMovies, getTvPopular } from "../api/tmdb-api";
import { useQuery } from '@tanstack/react-query';
import Spinner from '../components/spinner';
import MovieCard from '../components/movieCard';
import { Link } from "react-router";

const HomePage = (props) => {

  // fetch first page only for homepage sample; use a distinct query key to avoid colliding with the full-list query
  const { data, error, isPending, isError  } = useQuery({
    queryKey: ['discover', 1, 'home'],
    queryFn: () => getMovies(1),
  })

  // fetch a popular TV page for the homepage TV sample
  const { data: tvData, error: tvError, isPending: tvIsPending, isError: tvIsError } = useQuery({
    queryKey: ['tv', 1, 'home'],
    queryFn: () => getTvPopular(1),
  })
  
  if (isPending || tvIsPending) {
    return <Spinner />
  }

  if (isError || tvIsError) {
    const err = error || tvError;
    return <h1 style={{color: '#39f'}}>{err && err.message}</h1>
  }  
  
  const movies = (data && data.results) ? data.results : [];
  const tvShows = (tvData && tvData.results) ? tvData.results : [];

  const randomMovie = () => {
    if (!movies || movies.length === 0) return null;
    return movies[Math.floor(Math.random() * movies.length)];
  }

  const moviesSample = randomMovie();
  const randomTv = () => {
    if (!tvShows || tvShows.length === 0) return null;
    return tvShows[Math.floor(Math.random() * tvShows.length)];
  }
  const tvSample = randomTv();
  return (
    <div style={{ color: 'rgba(12, 42, 73, 1)', padding: '40px' }}>
      <div style={{maxWidth: 1200, margin: '0 auto', textAlign: 'center'}}>
        <h1 style={{color: 'rgba(255, 255, 255, 1)', fontSize: '3rem', marginBottom: '1rem'}}>Welcome to Cinema Labratories</h1>
        <p style={{color: 'rgba(255, 255, 255, 1)', marginBottom: '2rem'}}>Choose an option below</p>

        <div style={{display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'stretch'}}>
          <div style={{width: 420, display: 'flex', flexDirection: 'column'}}>
            <h2 style={{color: 'rgba(255, 255, 255, 1)'}}>Movies</h2>
            {moviesSample ? (
              <>
                <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                  <MovieCard movie={moviesSample} action={() => null} fullHeight cardLink="/movies" />
                </div>
              </>
            ) : <p style={{color: 'rgba(217, 229, 241, 1)'}}>No sample movie available</p>}
          </div>

          <div style={{width: 420, display: 'flex', flexDirection: 'column'}}>
            <h2 style={{color: 'rgba(239, 247, 254, 1)'}}>TV Shows</h2>
            {tvSample ? (
              <>
                <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                  <MovieCard movie={tvSample} action={() => null} fullHeight cardLink="/tv" />
                </div>
              </>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <p style={{color: 'rgba(225, 239, 254, 1)'}}>TV shows now have their own page. Browse the latest series and episodes.</p>
                <div style={{marginTop: '0.5rem'}}>
                  <Link to="/tv">
                    <button style={{background: 'transparent', color: 'rgba(227, 241, 254, 1)', padding: '8px 16px', border: '1px solid #39f', borderRadius: 4, cursor: 'pointer'}}>Browse TV Shows</button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
