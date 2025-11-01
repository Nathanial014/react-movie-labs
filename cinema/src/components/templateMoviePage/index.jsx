import React, { useState, useEffect, useContext } from 'react';
import { useQuery } from "@tanstack/react-query";
import Spinner from '../spinner'
import MovieHeader from "../headerMovie";
import Grid from "@mui/material/Grid";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { MoviesContext } from '../../contexts/moviesContext';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { getMovieImages } from "../../api/tmdb-api";

const TemplateMoviePage = ({ movie, children }) => {
  // carousel state (declare hooks unconditionally to preserve hook order)
  const [current, setCurrent] = useState(0);

  const { data, error, isPending, isError } = useQuery({
    queryKey: ['images', { id: movie.id }],
    queryFn: getMovieImages,
  });
  // compute images early so hooks are stable
  const images = (data && data.posters) ? data.posters : [];

  // carousel effect (declare unconditionally so hooks order is stable)
  useEffect(() => {
    if (!images || images.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images]);

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  // If images is not an array, avoid breaking the page
  if (!Array.isArray(images)) return <Spinner />;

  // debug
  console.log('TemplateMoviePage images count', images.length);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <>
      <MovieHeader movie={movie} />

      <Grid container spacing={5} style={{ padding: "15px" }}>
        <Grid size={{xs: 3}}>
          <Box sx={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {images.length > 0 && (
              <Box sx={{ width: '100%', px: 1 }}>
                <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 1 }}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${images[current].file_path}`}
                    alt={images[current].file_path}
                    style={{ display: 'block', width: '100%', height: 'auto', transition: 'transform 300ms ease', transform: 'perspective(800px) translateZ(0) rotateY(6deg) scale(1.01)' }}
                  />
                  <Box sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }}>
                    <IconButton onClick={prev} sx={{ color: 'white', background: 'rgba(0,0,0,0.4)' }}>
                      <ArrowBackIosNewIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
                    <IconButton onClick={next} sx={{ color: 'white', background: 'rgba(0,0,0,0.4)' }}>
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', mt: 1 }}>
                  {images.map((_, idx) => (
                    <Box key={idx} onClick={() => setCurrent(idx)} sx={{ width: 8, height: 8, borderRadius: '50%', background: idx === current ? 'white' : 'rgba(255,255,255,0.3)', cursor: 'pointer' }} />
                  ))}
                </Box>
                {/* Favorite button under carousel */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <FavoriteButton movie={movie} />
                </Box>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid size={{xs: 9}}>
          {children}
        </Grid>
      </Grid>
    </>
  );
};

function FavoriteButton({ movie }) {
  const { favorites = [], addToFavorites, removeFromFavorites } = useContext(MoviesContext) || {};
  const isFav = Array.isArray(favorites) && favorites.includes(movie.id);

  const handleClick = (e) => {
    e.preventDefault();
    if (isFav) {
      removeFromFavorites && removeFromFavorites(movie);
    } else {
      addToFavorites && addToFavorites(movie);
    }
  };

  return (
    <IconButton aria-label="toggle-favorite" onClick={handleClick} sx={{ background: 'rgba(255,255,255,0.06)', color: isFav ? '#ff4081' : 'white' }}>
      <FavoriteIcon />
    </IconButton>
  );
}

export default TemplateMoviePage;
