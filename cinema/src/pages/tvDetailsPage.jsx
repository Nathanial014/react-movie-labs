import React from 'react';
import { useParams } from 'react-router';
import TvDetails from '../components/tvDetails';
import PageTemplate from '../components/templateMoviePage';
import { getTv } from '../api/tmdb-api';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../components/spinner';

const TvPage = () => {
  const { id } = useParams();
  const { data: show, error, isPending, isError } = useQuery({ queryKey: ['tv', { id }], queryFn: getTv });
  if (isPending) return <Spinner />;
  if (isError) return <h1>{error.message}</h1>;
  return (
    <>
      {show ? (
        <PageTemplate movie={ { ...show, title: show.name, release_date: show.first_air_date } }>
          <TvDetails show={show} />
        </PageTemplate>
      ) : (
        <p>Waiting for TV show details</p>
      )}
    </>
  );
}

export default TvPage;
