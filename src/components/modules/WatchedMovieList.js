import WatchedMovie from "./WatchedMovie";

export default function WatchedMoviesList({ watched, onRemoveWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbId}
          onRemoveWatched={onRemoveWatched}
        />
      ))}
    </ul>
  );
}
