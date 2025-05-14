import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { MagnifyingGlassIcon, HeartIcon, QueueListIcon, UserIcon } from '@heroicons/react/24/solid';

export default function Sidebar() {
  const { publicKey } = useWallet();
  const artistId = publicKey ? publicKey.toBase58().slice(0, 8) : null;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-gray-800 p-4 h-screen fixed">
        <h2 className="text-xl font-bold text-white mb-6">SolStream</h2>
        <nav className="space-y-2">
          <Link
            to="/discover"
            className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-gray-700 rounded-lg"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            <span>Discover</span>
          </Link>
          <Link
            to="/favorites"
            className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-gray-700 rounded-lg"
          >
            <HeartIcon className="h-5 w-5" />
            <span>Favorites</span>
          </Link>
          <Link
            to="/playlist"
            className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-gray-700 rounded-lg"
          >
            <QueueListIcon className="h-5 w-5" />
            <span>Playlist</span>
          </Link>
          {publicKey && (
            <Link
              to={`/artist/${artistId}`}
              className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-gray-700 rounded-lg"
            >
              <UserIcon className="h-5 w-5" />
              <span>Artist Dashboard</span>
            </Link>
          )}
        </nav>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800 p-2 glass">
        <div className="flex justify-around">
          <Link to="/discover" className="flex flex-col items-center text-white">
            <MagnifyingGlassIcon className="h-6 w-6" />
            <span className="text-xs">Discover</span>
          </Link>
          <Link to="/favorites" className="flex flex-col items-center text-white">
            <HeartIcon className="h-6 w-6" />
            <span className="text-xs">Favorites</span>
          </Link>
          <Link to="/playlist" className="flex flex-col items-center text-white">
            <QueueListIcon className="h-6 w-6" />
            <span className="text-xs">Playlist</span>
          </Link>
          {publicKey && (
            <Link to={`/artist/${artistId}`} className="flex flex-col items-center text-white">
              <UserIcon className="h-6 w-6" />
              <span className="text-xs">Artist</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}