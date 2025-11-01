import React from 'react';
import { getNowPlaying, getMoviesPages } from '../api/tmdb-api';
import PageTemplate from '../components/templateMovieListPage';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../components/spinner';
import AddToFavoritesIcon from '../components/cardIcons/addToFavorites'

const NowPlayingPage = (props) => {
  // default: fetch first 2 pages of now playing (40 items)
  const pagesToFetch = 2;

  // Attempt to fetch multiple TMDB pages and merge if you want more results; otherwise fetch single now playing page
  const { data, error, isPending, isError } = useQuery({
    queryKey: ['nowPlaying', pagesToFetch],
    queryFn: async () => {
      if (pagesToFetch && pagesToFetch > 1) {
        // reuse getMoviesPages to parallel fetch 'discover' isn't exact but we can fetch multiple now_playing pages individually
        // build fetches for now_playing pages
        const promises = [];
        for (let p = 1; p <= pagesToFetch; p++) {
          promises.push(fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US&page=${p}`).then(r => {
            if (!r.ok) return r.json().then(err => { throw new Error(err.status_message || 'Something went wrong') });
            return r.json();
          }));
        }
        const results = await Promise.all(promises);
        return { page: 1, results: results.flatMap(r => r.results || []), total_results: results.reduce((s, r) => s + (r.total_results || 0), 0), total_pages: results[0] ? results[0].total_pages : 1 };
      }

      // single page fetch
      return getNowPlaying(1);
    }
  });

  if (isPending) return <Spinner />;
  if (isError) return <h1>{error.message}</h1>;

  const movies = data.results;

  return (
    <PageTemplate
      title="Now Playing"
      movies={movies}
      action={(movie) => {
        return <AddToFavoritesIcon movie={movie} />
      }}
    />
  );
};

export default NowPlayingPage;
