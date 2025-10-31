import React from "react";
import { getMoviesPages } from "../api/tmdb-api";
import PageTemplate from '../components/templateMovieListPage';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../components/spinner';
import AddToFavoritesIcon from '../components/cardIcons/addToFavorites'

const MoviesPage = (props) => {

  // how many TMDB pages to request and merge (each TMDB page returns 20 items)
  const pagesToFetch = 3; // -> 60 movies fetched; change this value to increase/decrease
  const { data, error, isPending, isError  } = useQuery({
    queryKey: ['discover', pagesToFetch],
    queryFn: () => getMoviesPages(pagesToFetch),
  })
  
  if (isPending) {
    return <Spinner />
  }

  if (isError) {
    return <h1>{error.message}</h1>
  }  
  
  const movies = data.results;

  // Redundant, but necessary to avoid app crashing.
  const favorites = movies.filter(m => m.favorite)
  localStorage.setItem('favorites', JSON.stringify(favorites))
  const addToFavorites = (movieId) => true 

     return (
      <PageTemplate
        title="Discover Movies"
        movies={movies}
        action={(movie) => {
          return <AddToFavoritesIcon movie={movie} />
        }}
      />
    );
};
export default MoviesPage;
