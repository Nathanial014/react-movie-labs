import React from "react";
import Movie from "../movieCard/";
import Grid from "@mui/material/Grid";

const MovieList = (props) => {
  let movieCards = props.movies.map((m) => {
    const isTv = m.media_type === 'tv' || m.isTv;
    const link = isTv ? `/tv/${m.id}` : `/movies/${m.id}`;
    return (
      <Grid key={m.id} size={{xs: 12, sm: 6, md: 4, lg: 3, xl: 2}} sx={{padding: "20px"}}>
        {/* pass cardLink so the whole card becomes clickable */}
        <Movie key={m.id} movie={m} action={props.action} cardLink={link} />
      </Grid>
    )
  });
  return movieCards;
};

export default MovieList;
