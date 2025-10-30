import React, { useContext  } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import { Link } from "react-router";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalendarIcon from "@mui/icons-material/CalendarTodayTwoTone";
import StarRateIcon from "@mui/icons-material/StarRate";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Avatar from '@mui/material/Avatar';
import img from '../../images/film-poster-placeholder.png'

// Format a date like "2022-10-21" into "21st October 2022"
function formatReleaseDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const day = d.getDate();
  const year = d.getFullYear();
  const monthName = d.toLocaleString(undefined, { month: 'long' });
  // ordinal suffix
  const rem100 = day % 100;
  let suffix = 'th';
  if (rem100 < 11 || rem100 > 13) {
    if (day % 10 === 1) suffix = 'st';
    else if (day % 10 === 2) suffix = 'nd';
    else if (day % 10 === 3) suffix = 'rd';
  }
  return `${day}${suffix} ${monthName} ${year}`;
}

export default function MovieCard({ movie, action, fullHeight = false, cardLink = null }) {
  const { favorites, addToFavorites } = useContext(MoviesContext);

  if (favorites.find((id) => id === movie.id)) {
    movie.favorite = true;
  } else {
    movie.favorite = false
  }

  const handleAddToFavorite = (e) => {
    e.preventDefault();
    addToFavorites(movie);
  };

  const actionContent = action ? action(movie) : null;
  const cardActionsSx = fullHeight
    ? { marginTop: 'auto', justifyContent: actionContent ? 'space-between' : 'center' }
    : undefined;

  const showDetailLink = !cardLink;

  const cardInner = (
    <Card
      sx={
        fullHeight
          ? {
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'black',
              color: 'white',
              position: 'relative',
              transition: 'transform 250ms ease, box-shadow 250ms ease',
              transformStyle: 'preserve-3d',
              cursor: cardLink ? 'pointer' : 'default',
              '&:hover': {
                transform: 'perspective(1000px) translateZ(0) rotateY(6deg) scale(1.03)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)'
              },
              '&:hover .hoverOverlay': {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          : {
              backgroundColor: 'black',
              position: 'relative',
              color: 'white',
              transition: 'transform 250ms ease, box-shadow 250ms ease',
              transformStyle: 'preserve-3d',
              cursor: cardLink ? 'pointer' : 'default',
              '&:hover': {
                transform: 'perspective(1000px) translateZ(0) rotateY(6deg) scale(1.03)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)'
              },
              '&:hover .hoverOverlay': {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
      }
    >
      <CardHeader
        avatar={
          movie.favorite ? (
            <Avatar sx={{ backgroundColor: 'red' }}>
              <FavoriteIcon />
            </Avatar>
          ) : null
        }
        title={
          <Typography variant="h6" component="p" sx={{ color: 'white' }}>
            {movie.title}{" "}
          </Typography>
        }
      />
      <CardMedia
        sx={ fullHeight ? { height: 280 } : { height: 500 } }
        image={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            : img
        }
      />
      {/* Hover overlay with short details */}
      <div
        className="hoverOverlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '16px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)',
          color: 'white',
          opacity: 0,
          transform: 'translateY(10px)',
          transition: 'opacity 200ms ease, transform 200ms ease',
          pointerEvents: 'none'
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          <h3 style={{ margin: 0 }}>{movie.title}</h3>
          <p style={{ margin: '6px 0 0', fontSize: 14 }}>{movie.overview ? movie.overview.substring(0, 140) + (movie.overview.length > 140 ? '...' : '') : ''}</p>
        </div>
      </div>
      <CardContent sx={ fullHeight ? { flex: '1 1 auto' } : undefined }>
        <Grid container>
          <Grid size={{xs: 6}}>
            <Typography variant="h6" component="p" sx={{ color: 'white' }}>
              <CalendarIcon fontSize="small" sx={{ color: 'white', mr: 0.5 }} />
              {formatReleaseDate(movie.release_date)}
            </Typography>
          </Grid>
          <Grid size={{xs: 6}}>
            <Typography variant="h6" component="p" sx={{ color: 'white' }}>
              <StarRateIcon fontSize="small" sx={{ color: 'white', mr: 0.5 }} />
              {"  "} {movie.vote_average}{" "}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions disableSpacing sx={ cardActionsSx }>
        {actionContent}

        {showDetailLink && (
          <Link to={`/movies/${movie.id}`}>
            <Button variant="outlined" size="medium" sx={{ color: 'white', borderColor: 'white' }}>
              More Info ...
            </Button>
          </Link>
        )}

      </CardActions>
    </Card>
  );

  if (cardLink) {
    return (
      <Link to={cardLink} style={{ textDecoration: 'none', color: 'inherit' }}>
        {cardInner}
      </Link>
    );
  }

  return cardInner;
}
