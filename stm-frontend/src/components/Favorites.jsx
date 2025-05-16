// /Users/user/stm/stm-frontend/src/components/Favorites.jsx
import { useState } from 'react';
import { PlayIcon, HeartIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { useFavorites } from '../context/FavoritesContext';
import { getSongs } from '../utils/storage';
import { Howl } from 'howler';

export default function Favorites() {
  const { publicKey } = useWallet();
  const { favorites, removeFavorite, fanPoints } = useFavorites();
  const [currentSound, setCurrentSound] = useState(null);

  const tracks = getSongs().filter((track) => favorites.includes(track.id));

  const handlePlay = (track) => {
    if (!publicKey) {
      alert('Please connect your wallet');
      return;
    }
    if (currentSound) {
      currentSound.stop();
    }
    const sound = new Howl({
      src: [track.url],
      html5: true,
    });
    sound.play();
    setCurrentSound(sound);
  };

  const handleRemove = (trackId) => {
    removeFavorite(trackId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Favorites</h1>
      <p className="text-center mb-8">
        Your Points: {publicKey ? fanPoints : 'Connect wallet to see points'}
      </p>
      {tracks.length === 0 ? (
        <p className="text-center text-lg">No favorites yet. Add some from Discover!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.map((track) => (
            <motion.div key={track.id} className="card p-4" whileHover={{ scale: 1.05 }}>
              <h3 className="text-lg font-bold">{track.title}</h3>
              <p className="text-sm">By {track.artist}</p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handlePlay(track)}
                  className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg"
                >
                  <PlayIcon className="h-5 w-5" />
                  <span>Play</span>
                </button>
                <button
                  onClick={() => handleRemove(track.id)}
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