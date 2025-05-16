// /Users/user/stm/stm-frontend/src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { HomeIcon, HeartIcon, QueueListIcon } from '@heroicons/react/24/solid';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Sidebar() {
  const { publicKey } = useWallet();

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-white hidden lg:block">
      <div className="p-4">
        <h2 className="text-2xl font-bold">SolStream</h2>
      </div>
      <nav className="mt-8">
        <NavLink
          to="/app/discover"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-4 hover:bg-gray-800 ${isActive ? 'bg-gray-800' : ''}`
          }
        >
          <HomeIcon className="h-6 w-6" />
          <span>Discover</span>
        </NavLink>
        <NavLink
          to="/app/favorites"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-4 hover:bg-gray-800 ${isActive ? 'bg-gray-800' : ''}`
          }
        >
          <HeartIcon className="h-6 w-6" />
          <span>Favorites</span>
        </NavLink>
        <NavLink
          to="/app/playlist"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-4 hover:bg-gray-800 ${isActive ? 'bg-gray-800' : ''}`
          }
        >
          <QueueListIcon className="h-6 w-6" />
          <span>Playlist</span>
        </NavLink>
        {publicKey && (
          <NavLink
            to={`/app/artist/${publicKey.toString()}`}
            className={({ isActive }) =>
              `flex items-center space-x-2 p-4 hover:bg-gray-800 ${isActive ? 'bg-gray-800' : ''}`
            }
          >
            <span>Artist Dashboard</span>
          </NavLink>
        )}
      </nav>
    </div>
  );
}