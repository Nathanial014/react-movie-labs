import React, { useContext } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "@tanstack/react-query";
import { getTv } from "../api/tmdb-api";
import Spinner from '../components/spinner'
import RemoveFromFavorites from "../components/cardIcons/removeFromFavorites";

const FavoriteTvPage = () => {
  const { favorites: tvIds } = useContext(MoviesContext);

  const favoriteTvQueries = useQueries({
    queries: tvIds.map((id) => ({ queryKey: ['tv', { id }], queryFn: getTv }))
  });

  const isPending = favoriteTvQueries.find(q => q.isPending === true);
  if (isPending) return <Spinner />;

  const shows = favoriteTvQueries.map(q => {
    const s = q.data;
    // normalize to movie-like shape
    return { ...s, title: s.name, release_date: s.first_air_date, isTv: true };
  });

  return (
    <PageTemplate
      title="Favorite TV Shows"
      movies={shows}
      action={(item) => <RemoveFromFavorites movie={item} /> }
    />
  );
}

export default FavoriteTvPage;
