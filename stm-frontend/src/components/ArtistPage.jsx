// /Users/user/stm/stm-frontend/src/components/ArtistPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { PlayIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { Howl } from 'howler';
import { getSongs, addSong } from '../utils/storage';

export default function ArtistPage() {
  const { artistId } = useParams();
  const { publicKey } = useWallet();
  const [tracks, setTracks] = useState([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analytics, setAnalytics] = useState({ streams: 0, likes: 0, shares: 0 });
  const [currentSound, setCurrentSound] = useState(null);

  useEffect(() => {
    const allTracks = getSongs();
    const artistTracks = allTracks.filter((track) => track.artist === artistId);
    setTracks(artistTracks);
    setAnalytics({
      streams: artistTracks.reduce((sum) => sum + 0, 0), // Placeholder
      likes: artistTracks.reduce((sum, track) => sum + track.likes, 0),
      shares: artistTracks.reduce((sum, track) => sum + track.shares, 0),
    });
  }, [artistId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!publicKey) {
      alert('Please connect your wallet');
      return;
    }
    if (!title || !price || !file) {
      alert('Please provide title, price, and audio file');
      return;
    }
    if (artistId !== publicKey.toString()) {
      alert('Wallet does not match artist ID');
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target.result;
        const newTrack = {
          id: Date.now().toString(),
          title,
          artist: artistId,
          url,
          price: parseInt(price),
          likes: 0,
          shares: 0,
        };
        addSong(newTrack);
        setTracks([...tracks, newTrack]);
        setTitle('');
        setPrice('');
        setFile(null);
        alert('Track uploaded successfully!');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload track');
    } finally {
      setUploading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Artist Dashboard: {artistId}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div className="card p-4 text-center" whileHover={{ scale: 1.05 }}>
          <h3 className="text-lg font-bold">Total Streams</h3>
          <p className="text-2xl">{analytics.streams}</p>
        </motion.div>
        <motion.div className="card p-4 text-center" whileHover={{ scale: 1.05 }}>
          <h3 className="text-lg font-bold">Total Likes</h3>
          <p className="text-2xl">{analytics.likes}</p>
        </motion.div>
        <motion.div className="card p-4 text-center" whileHover={{ scale: 1.05 }}>
          <h3 className="text-lg font-bold">Total Shares</h3>
          <p className="text-2xl">{analytics.shares}</p>
        </motion.div>
      </div>

      {publicKey && (
        <div className="card p-6 mb-8 max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-4">Upload New Track</h2>
          <input
            type="text"
            placeholder="Track Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 rounded-lg text-white"
          />
          <input
            type="number"
            placeholder="Price (STM)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 rounded-lg text-white"
          />
          <input
            type="file"
            accept="audio/mp3"
            onChange={handleFileChange}
            className="w-full p-2 mb-4 bg-gray-700 rounded-lg text-white"
          />
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-4 py-2 rounded-lg w-full disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Track'}
          </button>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Your Tracks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tracks.map((track) => (
          <motion.div key={track.id} className="card p-4" whileHover={{ scale: 1.05 }}>
            <h3 className="text-lg font-bold">{track.title}</h3>
            <p className="text-sm">Price: {track.price} STM | Likes: {track.likes} | Shares: {track.shares}</p>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => handlePlay(track)}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg"
              >
                <PlayIcon className="h-5 w-5" />
                <span>Play</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}