import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Box from '@mui/material/Box';
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

  return (
    <Box sx={{ color: 'white' }}>
      <Typography variant="h5" component="h3" color="inherit">
        Overview
      </Typography>

      <Typography variant="h6" component="p" color="inherit">
        {movie.overview}
      </Typography>
      <Paper
        component="ul"
        sx={{ ...root, backgroundColor: 'rgba(0,0,0,0.6)', boxShadow: '0 2px 8px rgba(0,0,0,0.5)', borderRadius: 1 }}
      >
        <li>
          <Chip label="Genres" sx={{ ...chip, color: 'white', borderColor: chip.borderColor }} variant="outlined" />
        </li>
        {movie.genres.map((g) => (
          <li key={g.name}>
            <Chip label={g.name} sx={{ ...chip, color: 'white', borderColor: chip.borderColor }} variant="outlined" />
          </li>
        ))}
      </Paper>
      <Paper component="ul" sx={{...root, backgroundColor: 'rgba(0,0,0,0.6)', boxShadow: '0 2px 8px rgba(0,0,0,0.5)', borderRadius: 1 }}>
        <Chip icon={<AccessTimeIcon sx={{ color: 'white' }} />} label={`${movie.runtime} min.`} sx={{ ...chip, color: 'white', borderColor: chip.borderColor }} />
        <Chip
          icon={<MonetizationIcon sx={{ color: 'white' }} />}
          label={`${movie.revenue.toLocaleString()}`}
          sx={{ ...chip, color: 'white', borderColor: chip.borderColor }}
        />
        <Chip
          icon={<StarRate sx={{ color: 'white' }} />}
          label={`${movie.vote_average} (${movie.vote_count})`}
          sx={{ ...chip, color: 'white', borderColor: chip.borderColor }}
        />
        <Chip label={`Released: ${movie.release_date}`} sx={{ ...chip, color: 'white', borderColor: chip.borderColor }} />
      </Paper>
      <Paper component="ul" sx={{ ...root, backgroundColor: 'rgba(0,0,0,0.6)', boxShadow: '0 2px 8px rgba(0,0,0,0.5)', borderRadius: 1 }}>
      <li>
        <Chip label="Production Countries" sx={{ ...chip, color: 'white', borderColor: chip.borderColor }} />
    </li>
    {movie.production_countries.map((country) => (
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
