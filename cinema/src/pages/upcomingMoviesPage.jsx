import React from "react";
import { getUpcoming } from "../api/tmdb-api";
import PageTemplate from '../components/templateMovieListPage';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../components/spinner';
import AddToWatchIcon from '../components/cardIcons/addToWatch'

const UpcomingMoviesPage = (props) => {

  const { data, error, isPending, isError  } = useQuery({
    queryKey: ['upcoming'],
    queryFn: getUpcoming,
  })
  
  if (isPending) {
    return <Spinner />
  }

  if (isError) {
    return <h1>{error.message}</h1>
  }  
  
  const movies = data.results;
  // sort upcoming movies by release date: nearest (soonest) first, then later dates
  const sortedMovies = Array.isArray(movies) ? [...movies].sort((a, b) => {
    const ta = Date.parse(a && a.release_date ? a.release_date : '') || Infinity;
    const tb = Date.parse(b && b.release_date ? b.release_date : '') || Infinity;
    return ta - tb; // earliest (soonest) first
  }) : movies;

     return (
      <PageTemplate
        title="Upcoming Movies"
    movies={sortedMovies}
        action={(movie) => {
          return <AddToWatchIcon movie={movie} />
        }}
      />
    );
};
export default UpcomingMoviesPage;
