import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [sortOption, setSortOption] = useState('date_desc');
  const navigate = useNavigate();

//   1. Auth Check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login'); 
      }
    });
    return () => unsubscribe();
  }, [navigate]);

//   2. Fetch Favorites from Firestore
  useEffect(() => {
    if (!user) return;

    const favoritesRef = collection(db, 'users', user.uid, 'favorites');
    const q = query(favoritesRef, orderBy('addedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFavorites(favs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 3. Remove Functionality
  const removeFavorite = async (gifId) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'favorites', gifId));
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("Failed to remove favorite.");
    }
  };

  const getSortedFavorites = () => {
    let sorted = [...favorites];
    if (sortOption === 'date_desc') {
      sorted.sort((a, b) => b.addedAt?.seconds - a.addedAt?.seconds);
    } else if (sortOption === 'date_asc') {
      sorted.sort((a, b) => a.addedAt?.seconds - b.addedAt?.seconds);
    } else if (sortOption === 'alpha') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  };

  if (loading) return <div className="p-8 text-center">Loading your favorites...</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Header & Sort Controls */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Favorites</h1>
        
        {favorites.length > 0 && (
          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="alpha">A-Z</option>
          </select>
        )}
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-500">You haven't saved any favorites yet.</p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 text-blue-500 hover:underline"
          >
            Go explore GIFs
          </button>
        </div>
      ) : (
        /* Grid Layout */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {getSortedFavorites().map((gif) => (
            <div key={gif.id} className="relative group border rounded-lg overflow-hidden shadow-sm">
              <img 
                src={gif.url} 
                alt={gif.title} 
                className="w-full h-48 object-cover" 
              />
              
              {/* Overlay with Remove Button */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => removeFavorite(gif.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
              
              <div className="p-2 text-sm truncate bg-white">
                {gif.title || "Untitled GIF"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;