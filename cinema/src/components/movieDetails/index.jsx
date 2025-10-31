import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Box from '@mui/material/Box';
import { useQuery } from '@tanstack/react-query';
import { getMovieVideos } from '../../api/tmdb-api';
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationIcon from "@mui/icons-material/MonetizationOn";
import StarRate from "@mui/icons-material/StarRate";
import NavigationIcon from "@mui/icons-material/Navigation";
import Fab from "@mui/material/Fab";
import Drawer from "@mui/material/Drawer";
import MovieReviews from "../movieReviews"
import Typography from "@mui/material/Typography";


const root = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  listStyle: "none",
  padding: 1.5,
  margin: 0,
};
// chip style: subtle solid background with light border for contrast on dark backgrounds
const chip = { margin: 0.5, backgroundColor: 'rgba(255,255,255,0.04)', color: 'white', borderColor: 'rgba(255,255,255,0.12)' };

const MovieDetails = ({ movie }) => {  // Don't miss this!
  const [drawerOpen, setDrawerOpen] = useState(false);

  // defensive guard: if movie data isn't ready, render nothing (parent shows spinner)
  if (!movie || !movie.id) return null;
  // debug log
  console.log('MovieDetails render', { movieId: movie.id, movie });

  return (
    <Box sx={{ color: 'white' }}>
      <Typography variant="h5" component="h3" color="inherit">
        Overview
      </Typography>

      <Typography variant="h6" component="p" color="inherit">
        {movie.overview}
      </Typography>

      {/* Trailers */}
      <TrailerSection movieId={movie.id} />
      <Paper
        component="ul"
        sx={{ ...root, backgroundColor: 'rgba(0,0,0,0.6)', boxShadow: '0 2px 8px rgba(0,0,0,0.5)', borderRadius: 1 }}
      >
        <li>
          <Chip label="Genres" sx={{ ...chip, color: 'white', borderColor: chip.borderColor }} variant="outlined" />
        </li>
        {(movie.genres || []).map((g) => (
          <li key={g.name}>
            <Chip label={g.name} sx={{ ...chip, color: 'white', borderColor: chip.borderColor }} variant="outlined" />
          </li>
        ))}
      </Paper>
      <Paper component="ul" sx={{...root, backgroundColor: 'rgba(0,0,0,0.6)', boxShadow: '0 2px 8px rgba(0,0,0,0.5)', borderRadius: 1 }}>
        <Chip icon={<AccessTimeIcon sx={{ color: 'white' }} />} label={`${movie.runtime || ''} min.`} sx={{ ...chip, color: 'white', borderColor: chip.borderColor }} />
        <Chip
          icon={<MonetizationIcon sx={{ color: 'white' }} />}
          label={`${(movie.revenue || 0).toLocaleString()}`}
          sx={{ ...chip, color: 'white', borderColor: chip.borderColor }}
        />
        <Chip
          icon={<StarRate sx={{ color: 'white' }} />}
          label={`${movie.vote_average || ''} (${movie.vote_count || ''})`}
          sx={{ ...chip, color: 'white', borderColor: chip.borderColor }}
        />
        <Chip label={`Released: ${movie.release_date || ''}`} sx={{ ...chip, color: 'white', borderColor: chip.borderColor }} />
      </Paper>
      <Paper component="ul" sx={{ ...root, backgroundColor: 'rgba(0,0,0,0.6)', boxShadow: '0 2px 8px rgba(0,0,0,0.5)', borderRadius: 1 }}>
      <li>
        <Chip label="Production Countries" sx={{ ...chip, color: 'white', borderColor: chip.borderColor }} />
      </li>
      {(movie.production_countries || []).map((country) => (
        <li key={country.name}>
          <Chip label={country.name} sx={{ ...chip, color: 'white', borderColor: chip.borderColor }} />
        </li>
      ))}
    </Paper>
            <Fab
              color="secondary"
              variant="extended"
              onClick={() =>setDrawerOpen(true)}
              sx={{
                position: 'fixed',
                bottom: '1em',
                right: '1em',
                color: 'white'
              }}
              >
              <NavigationIcon sx={{ color: 'white' }} />
              Reviews
            </Fab>
      <Drawer anchor="top" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <MovieReviews movie={movie} />
      </Drawer>
    </Box>
  );
};
export default MovieDetails ;

function TrailerSection({ movieId }) {
  console.log('TrailerSection init movieId=', movieId);
  const { data, error, isPending, isError } = useQuery({
    queryKey: ['videos', { id: movieId }],
    queryFn: getMovieVideos,
    enabled: !!movieId,
  });

  console.log('TrailerSection query', { data, error, isPending, isError });

  if (isPending) return null;
  if (isError) return null;

  const videos = data && data.results ? data.results : [];
  // prefer YouTube trailers
  const trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer') || videos.find(v => v.site === 'YouTube');
  if (!trailer) return null;

  const youtubeId = trailer.key;
  return (
    <Box sx={{ my: 2 }}>
      <Box sx={{ position: 'relative', paddingTop: '56.25%', borderRadius: 1, overflow: 'hidden' }}>
        <iframe
          title="Trailer"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      </Box>
    </Box>
  );
}
