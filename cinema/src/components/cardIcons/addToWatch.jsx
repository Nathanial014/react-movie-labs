import React, { useContext } from "react";
import IconButton from "@mui/material/IconButton";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { MoviesContext } from "../../contexts/moviesContext";

const AddToWatchIcon = ({ movie }) => {
  const context = useContext(MoviesContext);

  const handleClick = (e) => {
    e.preventDefault();
    if (context && context.addToWatchlist) {
      context.addToWatchlist(movie);
    }
  };

  return (
    <IconButton aria-label="add to watch" onClick={handleClick}>
      <PlaylistAddIcon color="primary" fontSize="large" />
    </IconButton>
  );
};

export default AddToWatchIcon;

