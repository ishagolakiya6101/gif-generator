import React, { useState, useEffect } from "react";
// import "./Home2.css";

const LOCAL_GIFS = [
  { id: 1, name: "emoji", path: "/images/GIF1.gif" },
  { id: 2, name: "singing", path: "/images/GIF2.gif" },
  { id: 3, name: "cat", path: "/images/GIF3.gif" },
  { id: 4, name: "rainbow", path: "/images/GIF4.avif" },
  { id: 5, name: "simp", path: "/images/GIF5.gif" },
  { id: 6, name: "face", path: "/images/GIF6.gif" },
  { id: 7, name: "minion", path: "/images/GIF7.gif" },
];

const GIPHY_API_KEY = process.env.REACT_APP_GIPHY_API_KEY;

const fetchTrendingGifsFromAPI = async () => {
  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=25`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch trending GIFs from GIPHY:", error);
    return LOCAL_GIFS;
  }
};

export default function HomePage({ isAuthenticated }) {
  const [trendingGifs, setTrendingGifs] = useState([]);
  const [selectedGif, setSelectedGif] = useState(null);
  const [randomGif, setRandomGif] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setTrendingGifs(LOCAL_GIFS);
    // fetchTrendingGifsFromAPI().then(gifs => setTrendingGifs(gifs));
  }, []);

  const generateRandomGif = () => {
    if (!isAuthenticated) {
      alert("Please log in to use the random GIF generator.");
      return;
    }

    setIsGenerating(true);
    
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * LOCAL_GIFS.length);
      setRandomGif(LOCAL_GIFS[randomIndex]);
      setIsGenerating(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="header-content">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">GIF Gallery</h1>
              <p className="text-lg text-white/80">Discover amazing GIFs</p>
            </div>
            <div className="auth-status">
              {isAuthenticated ? (
                <span className="px-4 py-2 bg-green-400/20 text-green-300 rounded-full font-semibold">
                  ✓ Signed in
                </span>
              ) : (
                <span className="px-4 py-2 bg-yellow-400/20 text-yellow-300 rounded-full font-semibold">
                  Sign in to unlock
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {!isAuthenticated && (
          <section className="mb-12 bg-white rounded-lg shadow-xl p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Us Today!</h2>
            <p className="text-gray-600 text-lg mb-6">
              Sign up to access exclusive features like random GIF generation
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
              Sign Up / Login
            </button>
          </section>
        )}

        
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Trending GIFs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingGifs.map((gif) => (
                  <div
                    key={gif.id}
                    className="group relative overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
                    onClick={() => setSelectedGif(gif)}
                  >
                    <img 
                      src={gif.path} 
                      alt={gif.name} 
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="px-4 py-2 bg-white text-purple-600 font-semibold rounded-full">
                        View
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        
        <section className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Random GIF Generator</h2>
            <p className="text-gray-600 text-lg mb-6">
              {isAuthenticated
                ? "Generate a random GIF to discover something new!"
                : "Sign in to generate random GIFs"}
            </p>
            <button
              className={`px-8 py-3 font-semibold rounded-lg transition-all duration-200 ${
                isGenerating || !isAuthenticated
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:-translate-y-1"
              }`}
              onClick={generateRandomGif}
              disabled={isGenerating || !isAuthenticated}
            >
              {isGenerating ? "Generating..." : "Generate Random GIF"}
            </button>

            {randomGif && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-col items-center">
                  <img 
                    src={randomGif.path} 
                    alt={randomGif.name}
                    className="max-w-full max-h-96 rounded-lg shadow-lg mb-6"
                  />
                  <button
                    className={`px-8 py-3 font-semibold rounded-lg transition-all duration-200 ${
                      isGenerating
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:-translate-y-1"
                    }`}
                    onClick={generateRandomGif}
                    disabled={isGenerating}
                  >
                    Generate Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      
      {selectedGif && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedGif(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-2xl transition-colors duration-200"
              onClick={() => setSelectedGif(null)}
            >
              ✕
            </button>
            <div className="p-8">
              <img 
                src={selectedGif.path} 
                alt={selectedGif.name}
                className="w-full rounded-lg mb-4"
              />
              <h3 className="text-2xl font-bold text-gray-900 capitalize">{selectedGif.name}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
