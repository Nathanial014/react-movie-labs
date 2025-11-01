import React, { useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import { useQuery } from '@tanstack/react-query';
import { getTvVideos, getTvCredits, getTvRecommendations } from '../../api/tmdb-api';
import MovieReviews from '../movieReviews';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';
import Drawer from '@mui/material/Drawer';

const chip = { margin: 0.5, backgroundColor: 'rgba(255,255,255,0.04)', color: 'white', borderColor: 'rgba(255,255,255,0.12)' };

const TvDetails = ({ show }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  if (!show || !show.id) return null;

  return (
    <Box sx={{ color: 'white' }}>
      <Typography variant="h5" component="h3">Overview</Typography>
      <Typography variant="h6">{show.overview}</Typography>

      <TrailerSection showId={show.id} />
      <CreditsSection showId={show.id} />

      <Paper component="ul" sx={{ listStyle: 'none', p: 1.5, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 1 }}>
        <li>
          <Chip label="Genres" sx={{ ...chip, color: 'white' }} variant="outlined" />
        </li>
        {(show.genres || []).map(g => (
          <li key={g.name}><Chip label={g.name} sx={{ ...chip }} variant="outlined" /></li>
        ))}
      </Paper>

      <Fab
        color="secondary"
        variant="extended"
        onClick={() => setDrawerOpen(true)}
        sx={{ position: 'fixed', bottom: '1em', right: '1em', color: 'white' }}
      >
        <NavigationIcon sx={{ color: 'white' }} />
        Reviews
      </Fab>

      <Drawer anchor="top" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <MovieReviews movie={show} />
      </Drawer>
    </Box>
  )
}

export default TvDetails;

function TrailerSection({ showId }) {
  const { data, isPending, isError } = useQuery({ queryKey: ['tvvideos', { id: showId }], queryFn: getTvVideos, enabled: !!showId });
  if (isPending || isError) return null;
  const videos = data && data.results ? data.results : [];
  const trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer') || videos.find(v => v.site === 'YouTube');
  if (!trailer) return null;
  const youtubeId = trailer.key;
  return (
    <Box sx={{ my: 2 }}>
      <Box sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: 1, overflow: 'hidden' }}>
        <iframe title="Trailer" src={`https://www.youtube.com/embed/${youtubeId}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
      </Box>
    </Box>
  );
}

function CreditsSection({ showId }) {
  const { data, isPending, isError } = useQuery({ queryKey: ['tvcredits', { id: showId }], queryFn: getTvCredits, enabled: !!showId });
  if (isPending || isError) return null;
  const credits = data && data.cast ? data.cast : [];
  if (!credits || credits.length === 0) return null;
  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Cast</Typography>
      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
        {credits.slice(0,20).map(c => (
          <Box key={c.cast_id || c.credit_id} sx={{ minWidth: 120, textAlign: 'center' }}>
            <a href={`/person/${c.id}`} style={{ textDecoration: 'none' }}>
              <img src={c.profile_path ? `https://image.tmdb.org/t/p/w185/${c.profile_path}` : '/no-image.png'} alt={c.name} style={{ width: '100%', height: 'auto', borderRadius: 8 }} />
              <Typography variant="body2" sx={{ color: 'white' }}>{c.name}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>{c.character}</Typography>
            </a>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
