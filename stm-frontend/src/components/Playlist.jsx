import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Playlist() {
  const [songs] = useState([
    { id: 'song1', title: 'Song 1', streams: 0, isPremium: false, artist: 'Artist A', image: 'https://via.placeholder.com/150' },
    { id: 'song2', title: 'Song 2', streams: 5, isPremium: true, artist: 'Artist B', image: 'https://via.placeholder.com/150' },
  ]);
  const playlists = JSON.parse(localStorage.getItem('playlists')) || [];

  const playlistSongs = songs.filter((song) => playlists.includes(song.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">My Playlist</h2>
        {playlistSongs.length === 0 ? (
          <p className="text-gray-400">No songs in your playlist yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlistSongs.map((song) => (
              <motion.div
                key={song.id}
                className="card bg-gray-800 rounded-xl"
                whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-4 p-4">
                  <img src={song.image} alt={song.title} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg truncate">{song.title}</h3>
                    <p className="text-sm text-gray-400 truncate">
                      <Link to={`/artist/${song.artist}`}>{song.artist}</Link>
                    </p>
                    <p className="text-sm">Streams: {song.streams}</p>
                    <p className="text-sm text-purple-400">{song.isPremium ? 'Premium' : 'Free'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <Link to="/app" className="mt-6 inline-block text-purple-400 hover:text-purple-300">
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}