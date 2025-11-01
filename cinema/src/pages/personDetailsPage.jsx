import React from 'react';
import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getPerson, getPersonMovieCredits, getPersonImages } from '../api/tmdb-api';
import Spinner from '../components/spinner';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const PersonDetailsPage = () => {
  const { id } = useParams();
  const { data: person, error: personError, isPending: personPending, isError: personIsError } = useQuery({
    queryKey: ['person', { id }],
    queryFn: getPerson,
  });

  const { data: credits, error: creditsError, isPending: creditsPending, isError: creditsIsError } = useQuery({
    queryKey: ['personCredits', { id }],
    queryFn: getPersonMovieCredits,
  });

  const { data: imagesData } = useQuery({
    queryKey: ['personImages', { id }],
    queryFn: getPersonImages,
  });

  if (personPending || creditsPending) return <Spinner />;
  if (personIsError) return <h1>{personError.message}</h1>;
  if (creditsIsError) return <h1>{creditsError.message}</h1>;

  const movies = credits && credits.cast ? credits.cast : [];

  return (
    <Box sx={{ color: 'white', p: 3, overflowX: 'hidden', boxSizing: 'border-box' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box>
            <img
              src={person.profile_path ? `https://image.tmdb.org/t/p/w185/${person.profile_path}` : '/no-image.png'}
              alt={person.name}
              style={{ width: 180, height: 260, objectFit: 'cover', borderRadius: 8 }}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="h5">{person.name}</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>{person.biography}</Typography>
            </Box>

            {/* additional images gallery */}
            {imagesData && imagesData.profiles && imagesData.profiles.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Photos</Typography>
                <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
                  {imagesData.profiles.slice(0, 6).map((img, idx) => (
                    <img
                      key={idx}
                      src={`https://image.tmdb.org/t/p/w200/${img.file_path}`}
                      alt={`photo-${idx}`}
                      style={{ width: 100, height: 140, objectFit: 'cover', borderRadius: 6 }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6">Movies</Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(3, minmax(0, 1fr))',
                md: 'repeat(6, minmax(0, 1fr))'
              },
              gap: 2,
              mt: 1,
              width: '100%'
            }}
          >
            {movies.map(m => (
              <Box key={m.credit_id} sx={{ textAlign: 'center' }}>
                <Link to={`/movies/${m.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img
                    src={m.poster_path ? `https://image.tmdb.org/t/p/w185/${m.poster_path}` : '/no-image.png'}
                    alt={m.title}
                    style={{ display: 'block', width: '100%', maxWidth: '100%', height: 220, objectFit: 'cover', borderRadius: 6 }}
                  />
                  <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</Typography>
                </Link>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonDetailsPage;
