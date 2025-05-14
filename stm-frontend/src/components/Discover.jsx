import { useState, useEffect } from 'react';
import { PlayIcon, HeartIcon, ShareIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import idl from '../assets/solstream_contract.json';
import { useFavorites } from '../context/FavoritesContext';
import SearchBar from './SearchBar';

export default function Discover() {
  const [tracks, setTracks] = useState([]);
  const { addFavorite, favorites, fetchFavorites, fanPoints, fetchFanProfile } = useFavorites();
  const wallet = useWallet();
  const programId = new web3.PublicKey('9xoW3QTr4BjtJmGq2QN5mMyg96NP5TrVuZQZHbvkAVVi');

  const getProvider = () => {
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
    return new AnchorProvider(connection, wallet, {});
  };

  useEffect(() => {
    const fetchTracks = async () => {
      if (!wallet.publicKey) return;
      const provider = getProvider();
      const program = new Program(idl, programId, provider);
      try {
        const trackAccounts = await program.account.track.all();
        const tracks = trackAccounts.map((account) => ({
          id: account.publicKey.toString(),
          track_id: account.account.track_id,
          price: account.account.price.toNumber(),
          likes: account.account.likes.toNumber(),
          shares: account.account.shares.toNumber(),
          pubkey: account.publicKey.toString(),
        }));
        setTracks(tracks);
      } catch (err) {
        console.error('Error fetching tracks:', err);
      }
    };

    if (wallet.publicKey) {
      fetchFavorites();
      fetchFanProfile();
      fetchTracks();
    }
  }, [wallet.publicKey, fetchFavorites, fetchFanProfile]);

  const handlePlay = async (track) => {
    if (!wallet.publicKey) {
      alert('Please connect wallet');
      return;
    }
    const provider = getProvider();
    const program = new Program(idl, programId, provider);
    try {
      const [artistPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('artist'), wallet.publicKey.toBuffer()], // Replace with actual artist key
        programId
      );
      await program.methods
        .streamTrack(track.track_id)
        .accounts({
          fan: wallet.publicKey,
          artist: artistPda,
          track: new web3.PublicKey(track.pubkey),
        })
        .rpc();
      setTracks((prev) =>
        prev.map((t) =>
          t.id === track.id ? { ...t, price: t.price } : t
        )
      );
      fetchFanProfile(); // Update points
      alert(`Streaming ${track.track_id}`);
    } catch (err) {
      console.error('Error streaming:', err);
      alert('Streaming failed');
    }
  };

  const handleLike = async (track) => {
    if (!wallet.publicKey) {
      alert('Please connect wallet');
      return;
    }
    const provider = getProvider();
    const program = new Program(idl, programId, provider);
    try {
      await program.methods
        .likeTrack(track.track_id)
        .accounts({
          fan: wallet.publicKey,
          track: new web3.PublicKey(track.pubkey),
        })
        .rpc();
      setTracks((prev) =>
        prev.map((t) => (t.id === track.id ? { ...t, likes: t.likes + 1 } : t))
      );
      fetchFanProfile(); // Update points
      alert(`Liked ${track.track_id}! +5 points`);
    } catch (err) {
      console.error('Error liking track:', err);
      alert('Liking failed');
    }
  };

  const handleShare = async (track) => {
    if (!wallet.publicKey) {
      alert('Please connect wallet');
      return;
    }
    const provider = getProvider();
    const program = new Program(idl, programId, provider);
    try {
      await program.methods
        .shareTrack(track.track_id)
        .accounts({
          fan: wallet.publicKey,
          track: new web3.PublicKey(track.pubkey),
        })
        .rpc();
      setTracks((prev) =>
        prev.map((t) => (t.id === track.id ? { ...t, shares: t.shares + 1 } : t))
      );
      fetchFanProfile(); // Update points
      alert(`Shared ${track.track_id}! +10 points`);
      navigator.clipboard.write(`https://solstream.app/track/${track.id}`);
    } catch (err) {
      console.error('Error sharing track:', err);
      alert('Sharing failed');
    }
  };

  const handleFavorite = async (track) => {
    if (!wallet.publicKey) {
      alert('Please connect wallet');
      return;
    }
    await addFavorite(track.pubkey);
    alert(`Added ${track.track_id} to favorites`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Discover Music</h1>
      <p className="text-center mb-8">Your Points: {fanPoints}</p>
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
            <h3 className="text-lg font-bold">{track.track_id}</h3>
            <p className="text-sm">Price: {track.price} STM</p>
            <p className="text-sm">Likes: {track.likes} | Shares: {track.shares}</p>
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
                disabled={favorites.includes(track.pubkey)}
                className={`flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-3 py-1 rounded-lg glass transition-all duration-300 ${
                  favorites.includes(track.pubkey) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <HeartIcon className="h-5 w-5" />
                <span>{favorites.includes(track.pubkey) ? 'Favorited' : 'Favorite'}</span>
              </button>
              <button
                onClick={() => handleLike(track)}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg"
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