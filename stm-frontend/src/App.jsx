// /Users/user/stm/stm-frontend/src/App.jsx

import { Outlet } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Sidebar from './components/Sidebar';
import DropdownMenu from './components/DropdownMenu';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex">
      {/* Sidebar for desktop */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 lg:ml-64 pb-16 lg:pb-0">
        {/* Top bar with stylized logo, wallet button, and dropdown */}
        <div className="flex justify-between items-center p-4 glass">
          <div className="flex items-center space-x-2">
            {/* Stylized SolStream logo text */}
            <div className="relative">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-transparent bg-clip-text drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] transform rotate-[-5deg] scale-110">
                SolStream
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-sm transform rotate-[5deg]" />
            </div>
          </div>

          {/* Wallet and mobile menu */}
          <div className="flex items-center space-x-4">
            <WalletMultiButton />
            <div className="lg:hidden">
              <DropdownMenu />
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
