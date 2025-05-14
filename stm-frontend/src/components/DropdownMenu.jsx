import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { Bars3Icon, UserIcon, MagnifyingGlassIcon, HeartIcon, QueueListIcon } from '@heroicons/react/24/solid';

export default function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { publicKey } = useWallet();

  const artistId = publicKey ? publicKey.toBase58().slice(0, 8) : null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-gray-700 rounded-lg focus:outline-none"
      >
        <Bars3Icon className="h-6 w-6 text-white" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10 glass">
          <Link
            to="/discover"
            className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            <span>Discover</span>
          </Link>
          <Link
            to="/favorites"
            className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <HeartIcon className="h-5 w-5" />
            <span>Favorites</span>
          </Link>
          <Link
            to="/playlist"
            className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <QueueListIcon className="h-5 w-5" />
            <span>Playlist</span>
          </Link>
          {publicKey && (
            <Link
              to={`/artist/${artistId}`}
              className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <UserIcon className="h-5 w-5" />
              <span>Artist Dashboard</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}