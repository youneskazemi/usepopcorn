export default function WatchedMovie({
  movie,
  onRemoveWatched,
  onSelectMovie,
}) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3
        style={{ cursor: "pointer" }}
        onClick={() => onSelectMovie(movie.imdbId)}
      >
        {movie.title}
      </h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime.toFixed(2)} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onRemoveWatched(movie.imdbId)}
        >
          X
        </button>
      </div>
    </li>
  );
}
