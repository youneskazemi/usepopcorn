import { useEffect, useState } from "react";
import Loader from "./components/modules/Loader";
import Box from "./components/templates/Box";
import Navbar from "./components/layouts/Navbar";
import Search from "./components/modules/Search";
import NumResults from "./components/modules/NumResults";
import Main from "./components/layouts/Main";
import ErrorMessage from "./components/modules/ErrorMessage";
import MovieList from "./components/modules/MovieList";
import WatchedSummary from "./components/templates/WatchedSummary";
import WatchedMoviesList from "./components/modules/WatchedMovieList";
import MovieDetails from "./components/templates/MovieDetails";
import useMovie from "./hooks/useMovie";
import useLocalStorageState from "./hooks/useLocalStorageState";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  const { movies, loading, error } = useMovie(query);

  const onSelectMovie = (id) => {
    setSelectedId((selected) => (selected === id ? null : id));
  };
  const onCloseMovie = () => {
    setSelectedId(null);
  };

  const handleAddWatched = (movie) => {
    setWatched((movies) => [...movies, movie]);
    onCloseMovie();
  };

  const handleRemoveWatched = (id) => {
    setWatched((movies) => movies.filter((movie) => movie.imdbId !== id));
  };

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {loading && <Loader />}
          {!loading && !error && (
            <MovieList movies={movies} onSelectMovie={onSelectMovie} />
          )}
          {!loading && error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={onCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onRemoveWatched={handleRemoveWatched}
                onSelectMovie={onSelectMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
