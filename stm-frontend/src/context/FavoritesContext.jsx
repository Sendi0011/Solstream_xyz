import { useState, useContext, createContext } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import idl from '../assets/solstream_contract.json';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [fanPoints, setFanPoints] = useState(0);
  const wallet = useWallet();
  const programId = new web3.PublicKey('9xoW3QTr4BjtJmGq2QN5mMyg96NP5TrVuZQZHbvkAVVi');

  const getProvider = () => {
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
    return new AnchorProvider(connection, wallet, {});
  };

  const fetchFavorites = async () => {
    if (!wallet.publicKey) return;
    const provider = getProvider();
    const program = new Program(idl, programId, provider);
    try {
      const [fanPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('fan'), wallet.publicKey.toBuffer()],
        programId
      );
      const fanAccount = await program.account.fan.fetch(fanPda);
      setFavorites(fanAccount.liked_tracks.map((key) => key.toString()));
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const fetchFanProfile = async () => {
    if (!wallet.publicKey) return;
    const provider = getProvider();
    const program = new Program(idl, programId, provider);
    try {
      const [fanPda] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('fan'), wallet.publicKey.toBuffer()],
        programId
      );
      const fanAccount = await program.account.fan.fetch(fanPda);
      setFanPoints(fanAccount.points.toNumber());
    } catch (err) {
      console.error('Error fetching fan profile:', err);
    }
  };

  const addFavorite = async (trackId) => {
    if (!wallet.publicKey) return;
    setFavorites((prev) => [...new Set([...prev, trackId])]);
  };

  const removeFavorite = async (trackId) => {
    if (!wallet.publicKey) return;
    setFavorites((prev) => prev.filter((id) => id !== trackId));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, fetchFavorites, fanPoints, fetchFanProfile }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}