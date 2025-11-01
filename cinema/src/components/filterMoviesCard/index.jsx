import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../spinner';
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import img from '../../images/pexels-dziana-hasanbekava-5480827.jpg'
import { getGenres } from "../../api/tmdb-api";

const formControl = 
  {
    margin: 1,
    minWidth: "90%",
    backgroundColor: "rgb(255, 255, 255)"
  };

export default function FilterMoviesCard(props) {
  const { data, error, isPending, isError } = useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }
  const genres = data.genres;
  if (genres[0].name !== "All"){
    genres.unshift({ id: "0", name: "All" });
  }

  const handleChange = (type, value, options = {}) => {
    // call parent handler
    props.onUserInput(type, value);
    // close dropdown if requested (genre selection or apply)
    if (options.close) setOpen(false);
  };

  // build autocomplete options from passed allMovies
  const titleOptions = props.allMovies && Array.isArray(props.allMovies) ? [...new Set(props.allMovies.map(m => m.title).filter(Boolean))] : [];

  const handleTextChange = (e) => {
    handleChange('name', e.target.value);
  };

  const handleGenreChange = (e) => {
    handleChange('genre', e.target.value, { close: true });
  };

  const handleOverlayClick = (e) => {
    if (e.target.dataset.overlay) setOpen(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>Filters</Typography>
        <Button variant="contained" onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Open Filters'}
        </Button>
      </Box>

      {open && (
        <div
          data-overlay="true"
          onClick={handleOverlayClick}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(3px)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: 80,
          }}
        >
          <Card
            variant="outlined"
            sx={{ width: '90%', maxWidth: 720, position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              aria-label="close"
              onClick={() => setOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <CardContent>
              <Typography variant="h5" component="h1" sx={{ color: 'white' }}>
                <SearchIcon fontSize="large" sx={{ color: 'white', mr: 1 }} />
                Filter the movies.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Autocomplete
                  freeSolo
                  options={titleOptions}
                  value={props.titleFilter}
                  onInputChange={(e, val) => handleChange('name', val)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{...formControl}}
                      id="filled-search"
                      label="Search field"
                      type="search"
                      variant="filled"
                      fullWidth
                    />
                  )}
                />
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                {/* Year filter */}
                <FormControl sx={{...formControl, minWidth: 160}} variant="filled">
                  <InputLabel id="year-label">Year</InputLabel>
                  <Select
                    labelId="year-label"
                    id="year-select"
                    value={props.yearFilter || '0'}
                    onChange={(e) => handleChange('year', e.target.value)}
                    fullWidth
                  >
                    <MenuItem value={'0'}>All</MenuItem>
                    {[...new Set((props.allMovies||[]).map(m => m.release_date ? new Date(m.release_date).getFullYear() : null).filter(Boolean))].sort((a,b) => b-a).map(y => (
                      <MenuItem key={y} value={String(y)}>{y}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* Runtime min/max */}
                <TextField
                  sx={{...formControl, minWidth: 120}}
                  id="runtime-min"
                  label="Min runtime (min)"
                  type="number"
                  variant="filled"
                  value={props.runtimeFilter?.min || 0}
                  onChange={(e) => handleChange('runtime', { ...props.runtimeFilter, min: Number(e.target.value) })}
                />
                <TextField
                  sx={{...formControl, minWidth: 120}}
                  id="runtime-max"
                  label="Max runtime (min)"
                  type="number"
                  variant="filled"
                  value={props.runtimeFilter?.max || 0}
                  onChange={(e) => handleChange('runtime', { ...props.runtimeFilter, max: Number(e.target.value) })}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <FormControl sx={{...formControl}} variant="filled" fullWidth>
                  <InputLabel id="genre-label">Genre</InputLabel>
                    <Select
                        labelId="genre-label"
                        id="genre-select"
                        defaultValue=""
                        value={props.genreFilter}
                        onChange={handleGenreChange}
                        fullWidth
                    >

                    {genres.map((genre) => {
                      return (
                        <MenuItem key={genre.id} value={genre.id}>
                          {genre.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="contained" onClick={() => { setOpen(false); }}>
                  Apply
                </Button>
              </Box>
            </CardContent>
            <CardMedia
              sx={{ height: 180 }}
              image={img}
              title="Filter"
            />
          </Card>
        </div>
      )}
    </Box>
  );
}
