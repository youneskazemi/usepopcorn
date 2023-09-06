import { useEffect, useState } from "react";

function useMovie(query) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);

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

  return { movies, loading, error };
}

export default useMovie;
