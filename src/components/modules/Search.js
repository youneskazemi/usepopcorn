export default function Search({ query, searchHandler }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => searchHandler(e)}
    />
  );
}
