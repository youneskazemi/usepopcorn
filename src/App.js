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

export default function App() {
  const [movies, setMovies] = useState([]);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState(() => {
    return JSON.parse(localStorage.getItem("watched"));
  });

  const searchHandler = async (e) => {
    setQuery(e.target.value);
  };

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

  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMBDB_API_KEY}&s=${query}`,
          {
            signal: abortController.signal,
          }
        );

        if (!res.ok) throw new Error(`Error fetching movies`);

        const data = await res.json();

        if (data.Response === "False") throw new Error("No movies found!");

        setMovies(data.Search);
        setError("");
      } catch (error) {
        if (error.name !== "AbortError") setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    fetchMovies();

    return () => abortController.abort();
  }, [query]);

  return (
    <>
      <Navbar>
        <Search query={query} searchHandler={searchHandler} />
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
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
