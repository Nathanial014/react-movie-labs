import { add } from "lodash";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from './authContext';

export const MoviesContext = React.createContext(null);

const MoviesContextProvider = (props) => {
  const [favorites, setFavorites] = useState( [] )
  const [myReviews, setMyReviews] = useState( {} ) 
  const [watchlist, setWatchlist] = useState( [] )

  const auth = useContext(AuthContext);

  // persist favorites per authenticated user (or guest)
  const favStorageKey = auth && auth.user && auth.user.email ? `favorites_${auth.user.email}` : 'favorites_guest';

  useEffect(() => {
    try {
      const raw = localStorage.getItem(favStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setFavorites(parsed);
      }
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(favStorageKey, JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites, favStorageKey]);

  const addToFavorites = (movie) => {
    let newFavorites = favorites.slice();
    if (!newFavorites.includes(movie.id)) newFavorites.push(movie.id);
    setFavorites(newFavorites);
  };

  const addToWatchlist = (movie) => {
    let newWatchlist = [];
    if (!watchlist.includes(movie.id)){
      newWatchlist = [...watchlist, movie.id];
    }
    else{
      newWatchlist = [...watchlist];
    }
    setWatchlist(newWatchlist)
  };  
  
  // We will use this function in the next step
  const removeFromFavorites = (movie) => {
    setFavorites( favorites.filter(
      (mId) => mId !== movie.id
    ) )
  };
  
  const addReview = (movie, review) => {
    setMyReviews( {...myReviews, [movie.id]: review } )
  };
  
  //console.log(myReviews);
  console.log(watchlist);
  
  const removeFromWatchlist = (movie) => {
    setWatchlist( watchlist.filter(
      (mId) => mId !== movie.id
    ) )
  };

  return (
    <MoviesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        addToWatchlist,
        removeFromWatchlist,
        addReview,
      }}
    >
      {props.children}
    </MoviesContext.Provider>
  );
};

export default MoviesContextProvider;
