import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { FavoritesProvider } from './context/FavoritesContext';
import Landing from './Landing';
import App from './App';
import ArtistPage from './components/ArtistPage';
import Discover from './components/Discover';
import Favorites from './components/Favorites';
import Playlist from './components/Playlist';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';
import '@solana/wallet-adapter-react-ui/styles.css';

const network = clusterApiUrl('devnet');
const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

const About = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center">
    <h1 className="text-4xl font-bold">About SolStream</h1>
    <p className="text-lg mt-4 max-w-2xl text-center">
      SolStream is a decentralized music streaming platform on Solana. Stay tuned for more details!
    </p>
    <a href="/" className="mt-6 bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded-lg">
      Back to Home
    </a>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <FavoritesProvider>
      <Router>
        <ConnectionProvider endpoint={network}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/app" element={<App />}>
                  <Route index element={<Discover />} />
                  <Route path="discover" element={<Discover />} />
                  <Route path="favorites" element={<Favorites />} />
                  <Route path="playlist" element={<Playlist />} />
                  <Route path="artist/:artistId" element={<ArtistPage />} />
                </Route>
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Navigate to="/app" />} />
              </Routes>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </Router>
    </FavoritesProvider>
  </ErrorBoundary>
);