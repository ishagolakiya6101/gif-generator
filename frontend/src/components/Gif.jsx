
import React, { useState } from "react";
import Search from "./components/Search";

const Gif = () => {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = "GIVGYHkr3WSBnllca54iNt0yFbjz7L65";

  const fetchGifs = async () => {

    setLoading(true);

    try {
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=xyz&limit=20`
      );
      const json = await res.json();
      setGifs(json.data || []);
    } catch (err) {
      console.log("Error:", err);
      setGifs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>GIF Search</h3>

      <Search query={query} setQuery={setQuery} />

      {loading && <p>Loading...</p>}

      <div>
        {gifs.map((gif) => (
          <div key={gif.id}>
            <img
              src={gif.images}
              alt={gif.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gif;
