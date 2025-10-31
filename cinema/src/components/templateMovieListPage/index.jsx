import React, { useState } from "react";
import Header from "../headerMovieList";
import FilterCard from "../filterMoviesCard";
import MovieList from "../movieList";
import Grid from "@mui/material/Grid";
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';

function MovieListPageTemplate({ movies, title, action, pageSize = 20, showPagination = true }) {
  const [nameFilter, setNameFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("0");
  const [page, setPage] = useState(1);
  const genreId = Number(genreFilter);

  let displayedMovies = movies
    .filter((m) => {
      return m.title.toLowerCase().search(nameFilter.toLowerCase()) !== -1;
    })
    .filter((m) => {
      return genreId > 0 ? m.genre_ids.includes(genreId) : true;
    });

  const totalPages = Math.max(1, Math.ceil(displayedMovies.length / pageSize));
  // clamp page if out of range
  if (page > totalPages) setPage(totalPages);
  const pagedMovies = displayedMovies.slice((page - 1) * pageSize, page * pageSize);

  const handleChange = (type, value) => {
    // reset to first page when filters change
    setPage(1);
    if (type === "name") setNameFilter(value);
    else setGenreFilter(value);
  };

  return (
    <Grid container>
      <Grid size={12}>
        <Header title={title} />
      </Grid>
      <Grid container sx={{flex: "1 1 500px"}}>
        {/* Put filter as a top full-width control (dropdown overlay), not a side column */}
        <Grid size={12} sx={{ padding: '12px 20px' }}>
          <FilterCard
            onUserInput={handleChange}
            titleFilter={nameFilter}
            genreFilter={genreFilter}
          />
        </Grid>
        <MovieList action={action} movies={pagedMovies}></MovieList>
        {showPagination && (
          <Grid size={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Box>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, val) => setPage(val)}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': { color: 'white', borderColor: 'rgba(255,255,255,0.12)' },
                }}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
export default MovieListPageTemplate;
