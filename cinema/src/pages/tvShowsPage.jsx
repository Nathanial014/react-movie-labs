import React from 'react';
import { getTvPages, getTvPopular } from '../api/tmdb-api';
import PageTemplate from '../components/templateMovieListPage';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../components/spinner';
import AddToFavoritesIcon from '../components/cardIcons/addToFavorites'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router';

const TvShowsPage = (props) => {
  // fetch multiple pages to have enough items for pagination
  const pagesToFetch = 3;

  const { data, error, isPending, isError } = useQuery({
    queryKey: ['tvdiscover', pagesToFetch],
    queryFn: () => getTvPages(pagesToFetch),
  });

  const { data: bannerData } = useQuery({
    queryKey: ['tvPopular', 1],
    queryFn: () => getTvPopular(1),
  });

  if (isPending) return <Spinner />;
  if (isError) return <h1>{error.message}</h1>;

  const tvShows = (data && data.results) ? data.results.map(s => ({
    ...s,
    title: s.name,
    release_date: s.first_air_date,
  })) : [];

  const bannerShows = (bannerData && bannerData.results) ? bannerData.results : [];

  return (
    <Box sx={{ color: 'white', p: 2 }}>
      {/* Banner rotating popular shows */}
      <Banner shows={bannerShows} />

      <PageTemplate
        title="TV Shows"
        movies={tvShows}
        action={(item) => <AddToFavoritesIcon movie={item} />}
      />
    </Box>
  );
};

export default TvShowsPage;

function Banner({ shows = [] }) {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!shows || shows.length === 0) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % shows.length), 5000);
    return () => clearInterval(t);
  }, [shows]);

  if (!shows || shows.length === 0) return null;

  const s = shows[current];

  return (
    <Box sx={{ width: '100%', mb: 2, position: 'relative', overflow: 'hidden', borderRadius: 1 }}>
      <Link to={`/tv/${s.id}`} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
        <img
          src={s.backdrop_path ? `https://image.tmdb.org/t/p/w1280/${s.backdrop_path}` : (s.poster_path ? `https://image.tmdb.org/t/p/w780/${s.poster_path}` : '/no-image.png')}
          alt={s.name}
          style={{ width: '100%', height: 300, objectFit: 'cover', display: 'block' }}
        />
        <Box sx={{ position: 'absolute', left: 16, bottom: 16, color: 'white', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
          <Typography variant="h4">{s.name}</Typography>
          <Typography variant="subtitle1" sx={{ maxWidth: 800 }}>{s.overview}</Typography>
        </Box>
      </Link>
    </Box>
  );
}
