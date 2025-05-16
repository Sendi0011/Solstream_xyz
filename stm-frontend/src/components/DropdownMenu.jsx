// /Users/user/stm/stm-frontend/src/components/DropdownMenu.jsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Bars3Icon, HomeIcon, HeartIcon, QueueListIcon } from '@heroicons/react/24/solid';
import { useWallet } from '@solana/wallet-adapter-react';

export default function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { publicKey } = useWallet();

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2">
        <Bars3Icon className="h-6 w-6" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg">
          <NavLink
            to="/app/discover"
            className="flex items-center space-x-2 p-4 hover:bg-gray-800 rounded-t-lg"
            onClick={() => setIsOpen(false)}
          >
            <HomeIcon className="h-5 w-5" />
            <span>Discover</span>
          </NavLink>
          <NavLink
            to="/app/favorites"
            className="flex items-center space-x-2 p-4 hover:bg-gray-800"
            onClick={() => setIsOpen(false)}
          >
            <HeartIcon className="h-5 w-5" />
            <span>Favorites</span>
          </NavLink>
          <NavLink
            to="/app/playlist"
            className="flex items-center space-x-2 p-4 hover:bg-gray-800"
            onClick={() => setIsOpen(false)}
          >
            <QueueListIcon className="h-5 w-5" />
            <span>Playlist</span>
          </NavLink>
          {publicKey && (
            <NavLink
              to={`/app/artist/${publicKey.toString()}`}
              className="flex items-center space-x-2 p-4 hover:bg-gray-800 rounded-b-lg"
              onClick={() => setIsOpen(false)}
            >
              <span>Artist Dashboard</span>
            </NavLink>
          )}
        </div>
      )}
    </div>
  );
}