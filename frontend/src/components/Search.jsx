// src/components/Search.jsx
import React from "react";

const Search = ({ query, setQuery }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search GIFs"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button>Search</button>
    </div>
  );
};

export default Search;
