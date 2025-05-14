import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import idl from '../assets/solstream_contract.json';
import { PlayIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

export default function ArtistPage() {
  const { artistId } = useParams();
  const { publicKey } = useWallet();
  const [tracks, setTracks] = useState([]);
  const [trackId, setTrackId] = useState('');
  const [price, setPrice] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analytics, setAnalytics] = useState({ streams: 0, likes: 0, shares: 0 });
  const programId = new web3.PublicKey('9xoW3QTr4BjtJmGq2QN5mMyg96NP5TrVuZQZHbvkAVVi');

  const getProvider = () => {
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
    return new AnchorProvider(connection, { publicKey }, {});
  };

  useEffect(() => {
    const fetchTracks = async () => {
      if (!publicKey) return;
      const provider = getProvider();
      const program = new Program(idl, programId, provider);
      try {
        const trackAccounts = await program.account.track.all();
        const artistTracks = trackAccounts.map((account) => ({
          id: account.publicKey.toString(),
          track_id: account.account.track_id,
          price: account.account.price.toNumber(),
          likes: account.account.likes.toNumber(),
          shares: account.account.shares.toNumber(),
        }));
        setTracks(artistTracks);
        setAnalytics({
          streams: artistTracks.reduce((sum) => sum + 0, 0), // Placeholder
          likes: artistTracks.reduce((sum, track) => sum + track.likes, 0),
          shares: artistTracks.reduce((sum, track) => sum + track.shares, 0),
        });
      } catch (err) {
        console.error('Error fetching tracks:', err);
      }
    };
    fetchTracks();
  }, [publicKey]);

  const handleUpload = async () => {
    if (!publicKey) {
      alert('Please connect your wallet');
      return;
    }
    if (!trackId || !price) {
      alert('Please enter track ID and price');
      return;
    }

    setUploading(true);
    try {
      const provider = getProvider();
      const program = new Program(idl, programId, provider);
      const [trackPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('track'), publicKey.toBuffer(), Buffer.from(trackId)],
        programId
      );

      await program.methods
        .uploadTrack(trackId, parseInt(price))
        .accounts({
          track: trackPda,
          user: publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      const newTrack = {
        id: trackPda.toString(),
        track_id: trackId,
        price: parseInt(price),
        likes: 0,
        shares: 0,
      };
      setTracks([...tracks, newTrack]);
      setAnalytics({
        streams: analytics.streams,
        likes: analytics.likes,
        shares: analytics.shares,
      });
      setTrackId('');
      setPrice('');
      alert('Track uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload track');
    } finally {
      setUploading(false);
    }
  };

  const handlePlay = (track) => {
    alert(`Playing ${track.track_id}`);
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
            placeholder="Track ID"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 rounded-lg text-white"
          />
          <input
            type="number"
            placeholder="Price (STM)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
            <h3 className="text-lg font-bold">{track.track_id}</h3>
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