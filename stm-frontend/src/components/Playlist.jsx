import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


export default function Playlist() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Playlist</h1>
      <p className="text-center text-lg">Your playlist is coming soon!</p>
    </div>
  );
}