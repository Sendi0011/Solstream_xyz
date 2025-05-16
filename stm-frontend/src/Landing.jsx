import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import './Landing.css';

export default function Landing() {
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const handleMouseMove = (event) => {
    const rect = constraintsRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = event.clientX - rect.left - centerX;
    const mouseY = event.clientY - rect.top - centerY;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    const handleDeviceOrientation = (event) => {
      const { beta, gamma } = event;
      x.set(gamma * 2);
      y.set(beta * 2);
    };

    window.addEventListener('deviceorientation', handleDeviceOrientation);
    return () => window.removeEventListener('deviceorientation', handleDeviceOrientation);
  }, [x, y]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col">
      <nav className="flex justify-between items-center p-4 sm:p-6 glass w-full">
        {/* Logo Side */}
        <div className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-transparent bg-clip-text drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] transform rotate-[-5deg] scale-110">
            SolStream
          </span>
        </div>

        {/* Action Side */}
        <div>
          <Link
            to="/app"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-4 py-2 rounded-lg transition-all duration-300 text-sm sm:text-base"
          >
            Go to App
          </Link>
        </div>
      </nav>


      <div
        className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8"
        ref={constraintsRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{ rotateX, rotateY, perspective: 1000 }}
          className="w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 mb-8"
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <motion.path
              d="M20 80 C30 20, 40 80, 50 20 C60 80, 70 20, 80 80"
              stroke="url(#waveGradient)"
              strokeWidth="4"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            />
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#9333ea', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
        >
          Welcome to SolStream
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg lg:text-xl mb-8 max-w-2xl"
        >
          Stream music, upload tracks, and own exclusive NFTs on the Solana blockchain.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            to="/app"
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 px-6 py-3 rounded-lg text-base sm:text-lg transition-all duration-300"
          >
            Start Streaming
          </Link>
        </motion.div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">About Us</h2>
        <motion.div
          className="card p-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-base sm:text-lg">
            SolStream is a decentralized music streaming platform built on the Solana blockchain. Our mission is to empower artists and fans by providing a transparent, secure, and rewarding ecosystem. Stream music, collect exclusive NFTs, and support your favorite creators with STM tokens.
          </p>
        </motion.div>
      </div>

      <footer className="glass w-full p-6 text-center bg-gradient-to-r from-gray-900 to-gray-800">
        <h3 className="text-lg font-bold mb-4">Our Roadmap</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div className="card p-4" whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}>
            <h4 className="text-base font-bold mb-2">Q2 2025</h4>
            <p className="text-sm">Launch MVP: Streaming, uploads, STM token.</p>
          </motion.div>
          <motion.div className="card p-4" whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}>
            <h4 className="text-base font-bold mb-2">Q3 2025</h4>
            <p className="text-sm">Premium tiers, NFT marketplace.</p>
          </motion.div>
          <motion.div className="card p-4" whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}>
            <h4 className="text-base font-bold mb-2">Q4 2025</h4>
            <p className="text-sm">Social sharing, API for dApps.</p>
          </motion.div>
          <motion.div className="card p-4" whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}>
            <h4 className="text-base font-bold mb-2">2026</h4>
            <p className="text-sm">Mobile app, global expansion.</p>
          </motion.div>
        </div>
        <h3 className="text-lg font-bold mb-4">Connect with Us</h3>
        <div className="flex justify-center space-x-4 mb-4">
          <a href="https://x.com/solstream" className="text-purple-400 hover:text-purple-300">X</a>
          <a href="https://t.me/solstream" className="text-purple-400 hover:text-purple-300">Telegram</a>
          <a href="https://farcaster.network/solstream" className="text-purple-400 hover:text-purple-300">Farcaster</a>
        </div>
        <div className="flex justify-center space-x-4">
          <Link to="/about" className="text-purple-400 hover:text-purple-300">
            About Us
          </Link>
          <a
            href="mailto:support@solstream.com"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-4 py-2 rounded-lg transition-all duration-300 text-sm"
          >
            Support
          </a>
        </div>
      </footer>
    </div>
  );
}