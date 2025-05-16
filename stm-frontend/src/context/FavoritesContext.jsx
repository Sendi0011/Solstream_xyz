import { useState, useContext, createContext, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getUser, saveUser } from '../utils/storage';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [fanPoints, setFanPoints] = useState(0);
  const [likedSongs, setLikedSongs] = useState([]);
  const { publicKey } = useWallet();
  const userId = publicKey ? publicKey.toString() : null;

  const fetchUserData = () => {
    if (!userId) return;
    const user = getUser(userId);
    setFavorites(user.favorites || []);
    setFanPoints(user.points || 0);
    setLikedSongs(user.likedSongs || []);
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const saveUserData = (updates) => {
    if (!userId) return;
    const user = getUser(userId);
    saveUser(userId, { ...user, ...updates });
    fetchUserData();
  };

  const addFavorite = (songId) => {
    if (!userId) {
      alert('Please connect your wallet');
      return;
    }
    saveUserData({ favorites: [...new Set([...favorites, songId])] });
  };

  const removeFavorite = (songId) => {
    if (!userId) {
      alert('Please connect your wallet');
      return;
    }
    saveUserData({ favorites: favorites.filter((id) => id !== songId) });
  };

  const likeSong = (songId) => {
    if (!userId) {
      alert('Please connect your wallet');
      return;
    }
    if (!likedSongs.includes(songId)) {
      saveUserData({
        likedSongs: [...likedSongs, songId],
        points: fanPoints + 5,
      });
    }
  };

  const unlikeSong = (songId) => {
    if (!userId) {
      alert('Please connect your wallet');
      return;
    }
    if (likedSongs.includes(songId)) {
      saveUserData({
        likedSongs: likedSongs.filter((id) => id !== songId),
        points: Math.max(0, fanPoints - 5),
      });
    }
  };

  const addPoints = (points) => {
    if (!userId) {
      alert('Please connect your wallet');
      return;
    }
    saveUserData({ points: fanPoints + points });
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        fanPoints,
        likedSongs,
        likeSong,
        unlikeSong,
        addPoints,
        fetchUserData,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}