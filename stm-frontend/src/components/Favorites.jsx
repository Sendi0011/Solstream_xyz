import { PlayIcon, HeartIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';

export default function Favorites() {
  const { favorites, removeFavorite, fanPoints } = useFavorites();

  const handlePlay = (trackId) => {
    alert(`Playing Track ${trackId}`);
  };

  const handleRemove = async (trackId) => {
    await removeFavorite(trackId);
    alert(`Removed track from favorites`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Favorites</h1>
      <p className="text-center mb-8">Your Points: {fanPoints}</p>
      {favorites.length === 0 ? (
        <p className="text-center text-lg">No favorites yet. Add some from Discover!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((trackId) => (
            <motion.div key={trackId} className="card p-4" whileHover={{ scale: 1.05 }}>
              <h3 className="text-lg font-bold">Track {trackId.slice(0, 8)}</h3>
              <p className="text-sm">By Artist</p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handlePlay(trackId)}
                  className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg"
                >
                  <PlayIcon className="h-5 w-5" />
                  <span>Play</span>
                </button>
                <button
                  onClick={() => handleRemove(trackId)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-3 py-1 rounded-lg glass transition-all duration-300"
                >
                  <HeartIcon className="h-5 w-5" />
                  <span>Remove</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}