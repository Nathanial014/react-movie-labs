import React, { useState, useEffect } from "react";
import { getMovie } from '../../api/tmdb-api';
import Header from "../headerMovieList";
import FilterCard from "../filterMoviesCard";
import MovieList from "../movieList";
import Grid from "@mui/material/Grid";
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';

function MovieListPageTemplate({ movies, title, action, pageSize = 20, showPagination = true, sortByDate = true }) {
  const [nameFilter, setNameFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("0");
  const [yearFilter, setYearFilter] = useState('0');
  const [runtimeFilter, setRuntimeFilter] = useState({ min: 0, max: 0 });
  const [page, setPage] = useState(1);
  const genreId = Number(genreFilter);

  // Optionally sort movies by release date (newest first)
  const sourceMovies = Array.isArray(movies) ? movies.slice() : [];
  if (sortByDate) {
    sourceMovies.sort((a, b) => {
      const ta = Date.parse(a && a.release_date ? a.release_date : '') || 0;
      const tb = Date.parse(b && b.release_date ? b.release_date : '') || 0;
      return tb - ta; // newest first
    });
  }

  // enrichment map for runtime values fetched from movie details when missing
  const [enrichedMap, setEnrichedMap] = useState({});

  // if runtime filter is used, fetch missing runtimes for the source set (limited to first 50 missing)
  useEffect(() => {
    if (!runtimeFilter || (runtimeFilter.min <= 0 && runtimeFilter.max <= 0)) return;
    // find ids missing runtime and not yet fetched
    const missing = sourceMovies.filter(m => (!m.runtime && !enrichedMap[m.id])).slice(0, 50).map(m => m.id);
    if (missing.length === 0) return;

    let cancelled = false;
    (async () => {
      try {
        const promises = missing.map(id => getMovie({ queryKey: ['movie', { id }] }).then(res => ({ id, runtime: res.runtime || 0 })).catch(() => ({ id, runtime: 0 })) );
        const results = await Promise.all(promises);
        if (cancelled) return;
        setEnrichedMap(prev => {
          const copy = { ...prev };
          results.forEach(r => { copy[r.id] = r.runtime; });
          return copy;
        });
      } catch (e) {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, [runtimeFilter, sourceMovies, enrichedMap]);

  // baseMovies includes runtime from enrichedMap when available
  const baseMovies = sourceMovies.map(m => {
    if ((!m.runtime || m.runtime === 0) && enrichedMap[m.id]) {
      return { ...m, runtime: enrichedMap[m.id] };
    }
    return m;
  });

  let displayedMovies = baseMovies
    .filter((m) => {
      return m.title.toLowerCase().search(nameFilter.toLowerCase()) !== -1;
    })
    .filter((m) => {
      return genreId > 0 ? m.genre_ids.includes(genreId) : true;
    });

  // filter by year if set
  if (yearFilter && yearFilter !== '0') {
    displayedMovies = displayedMovies.filter(m => {
      if (!m.release_date) return false;
      const y = (new Date(m.release_date)).getFullYear().toString();
      return y === yearFilter;
    });
  }

  // filter by runtime if set (min/max > 0)
  if (runtimeFilter && (runtimeFilter.min > 0 || runtimeFilter.max > 0)) {
    displayedMovies = displayedMovies.filter(m => {
      const rt = m.runtime || 0;
      if (runtimeFilter.min > 0 && rt < runtimeFilter.min) return false;
      if (runtimeFilter.max > 0 && runtimeFilter.max > runtimeFilter.min && rt > runtimeFilter.max) return false;
      return true;
    });
  }

  const totalPages = Math.max(1, Math.ceil(displayedMovies.length / pageSize));
  // clamp page if out of range
  if (page > totalPages) setPage(totalPages);
  const pagedMovies = displayedMovies.slice((page - 1) * pageSize, page * pageSize);

  const handleChange = (type, value) => {
    // reset to first page when filters change
    setPage(1);
    if (type === "name") setNameFilter(value);
    else if (type === 'genre') setGenreFilter(value);
    else if (type === 'year') setYearFilter(value);
    else if (type === 'runtime') setRuntimeFilter(value);
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
            yearFilter={yearFilter}
            runtimeFilter={runtimeFilter}
            allMovies={sourceMovies}
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
