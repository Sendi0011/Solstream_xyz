import { useState, useEffect } from 'react';
import { PlayIcon, HeartIcon, ShareIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Howl } from 'howler';
import { useWallet } from '@solana/wallet-adapter-react';
import { useFavorites } from '../context/FavoritesContext';
import { getSongs, saveSongs } from '../utils/storage';
import SearchBar from './SearchBar';

export default function Discover() {
  const [tracks, setTracks] = useState([]);
  const [currentSound, setCurrentSound] = useState(null);
  const { publicKey } = useWallet();
  const { addFavorite, favorites, fanPoints, likeSong, likedSongs, addPoints, fetchUserData } = useFavorites();

  useEffect(() => {
    setTracks(getSongs());
    if (publicKey) {
      fetchUserData();
    }
  }, [publicKey, fetchUserData]);

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
      onplay: () => {
        addPoints(10); // +10 points for streaming
      },
    });
    sound.play();
    setCurrentSound(sound);
  };

  const handleLike = (track) => {
    likeSong(track.id);
    setTracks((prev) =>
      prev.map((t) => (t.id === track.id ? { ...t, likes: t.likes + 1 } : t))
    );
    saveSongs(tracks);
  };

  const handleShare = (track) => {
    if (!publicKey) {
      alert('Please connect your wallet');
      return;
    }
    addPoints(10); // +10 points for sharing
    setTracks((prev) =>
      prev.map((t) => (t.id === track.id ? { ...t, shares: t.shares + 1 } : t))
    );
    saveSongs(tracks);
    navigator.clipboard.write(`https://solstream.app/track/${track.id}`);
    alert(`Shared ${track.title}! Link copied.`);
  };

  const handleFavorite = (track) => {
    addFavorite(track.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Discover Music</h1>
      <p className="text-center mb-8">
        Your Points: {publicKey ? fanPoints : 'Connect wallet to see points'}
      </p>
      <SearchBar />
      <div className="flex justify-center mb-8">
        <Link
          to="/app/discover"
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-4 py-2 rounded-lg glass transition-all duration-300"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
          <span>Discover More</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tracks.map((track) => (
          <motion.div key={track.id} className="card p-4" whileHover={{ scale: 1.05 }}>
            <h3 className="text-lg font-bold">{track.title}</h3>
            <p className="text-sm">By {track.artist}</p>
            <p className="text-sm">Price: {track.price} STM</p>
            <p className="text-sm">Likes: {track.likes} | Shares: preliminarily{track.shares}</p>
            <div className="flex flex-wrap space-x-2 space-y-2 mt-4">
              <button
                onClick={() => handlePlay(track)}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg"
              >
                <PlayIcon className="h-5 w-5" />
                <span>Play</span>
              </button>
              <button
                onClick={() => handleFavorite(track)}
                disabled={favorites.includes(track.id)}
                className={`flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-3 py-1 rounded-lg glass transition-all duration-300 ${
                  favorites.includes(track.id) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <HeartIcon className="h-5 w-5" />
                <span>{favorites.includes(track.id) ? 'Favorited' : 'Favorite'}</span>
              </button>
              <button
                onClick={() => handleLike(track)}
                disabled={likedSongs.includes(track.id)}
                className={`flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg ${
                  likedSongs.includes(track.id) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <HeartIcon className="h-5 w-5" />
                <span>Like</span>
              </button>
              <button
                onClick={() => handleShare(track)}
                className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 px-3 py-1 rounded-lg"
              >
                <ShareIcon className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}