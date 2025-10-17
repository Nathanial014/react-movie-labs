import React from "react";
import IconButton from "@mui/material/IconButton";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

const AddToWatchIcon = ({ movie }) => {
  const handleClick = (e) => {
    // no-op for now; placeholder for "add to watch" action
    e.preventDefault();
  };

  return (
    <IconButton aria-label="add to watch" onClick={handleClick}>
      <PlaylistAddIcon color="primary" fontSize="large" />
    </IconButton>
  );
};

export default AddToWatchIcon;

