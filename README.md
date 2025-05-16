# SolStream Frontend

![SolStream Logo](/logo.png)

**SolStream** is a decentralized music streaming platform built on the Solana blockchain. This React & Vite-based frontend allows artists and fans to:

* 🎵 Stream and play music tracks
* 🌐 Connect Solana wallets (e.g., Phantom)
* 💾 Save favorites, likes, and shares
* 🚀 Interact with a 3D animated landing page
* 📱 Enjoy a responsive, modern UI with Tailwind CSS

---

## Table of Contents

1. [Live Demo](#live-demo)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)

   * [Prerequisites](#prerequisites)
   * [Installation](#installation)
   * [Running Locally](#running-locally)
5. [Project Structure](#project-structure)
6. [Usage Guide](#usage-guide)
7. [Contributing](#contributing)
8. [License](#license)
9. [Contact](#contact)

---

## Live Demo

<a href="https://solstream.example.com" target="_blank">[https://solstream.example.com](https://solstream.example.com)</a>

---

## Website

<a href="https://solstream-xyz-p3h5.vercel.app/"</a>

## Features

* **Wallet Integration**: Connect and authenticate via Solana wallets with `@solana/wallet-adapter-react-ui`.
* **Music Playback**: High-quality audio streaming using Howler.js.
* **3D Animations**: Engaging landing page animations powered by Framer Motion.
* **Favorites & Engagement**: Like, share, and favorite tracks, with state persisted in context and localStorage.
* **Responsive Design**: Mobile-first layout created with Tailwind CSS.
* **Theming**: Modern glassmorphism and gradient backgrounds.

---

## Tech Stack

* **Framework**: React 18
* **Bundler**: Vite
* **Styling**: Tailwind CSS, custom CSS (glass effects)
* **Animation**: Framer Motion
* **Audio**: Howler.js
* **Routing**: React Router DOM
* **State Management**: React Context API & localStorage
* **Wallet Integration**: `@solana/wallet-adapter-react`, `@solana/wallet-adapter-react-ui`

---

## Getting Started

### Prerequisites

* Node.js v16 or higher
* Yarn or npm
* A Solana wallet (e.g., Phantom) for Devnet or Mainnet

### Installation

1. **Clone repository**

   ```bash
   git clone https://github.com/your-username/solstream-frontend.git
   cd solstream-frontend
   ```
2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```
3. **Environment variables**

   ```bash
   cp .env.example .env
   # Edit .env for SOLANA_RPC_URL and program IDs
   ```

### Running Locally

```bash
npm run dev
# or
yarn dev
```

* Visit [http://localhost:5173](http://localhost:5173)
* Connect your wallet via the **Connect Wallet** button in the navbar

---

## Project Structure

```plaintext
src/
├── assets/            # Images, SVGs, icons
├── components/        # Reusable UI components (Sidebar, SearchBar, DropdownMenu)
├── context/           # React Context providers (FavoritesContext)
├── pages/             # Page-level components (Landing, Discover)
├── utils/             # Helper functions (storage.js)
├── styles/            # Global CSS (Landing.css)
├── App.jsx            # Application layout and routing
├── main.jsx           # Entry point for React
└── vite.config.js     # Vite configuration
```

---

## Usage Guide

1. **Landing Page**: Explore the interactive 3D logo and click **Start Streaming**.
2. **Discover**: Browse tracks, play audio, like/share, and favorite.
3. **Favorites**: Review your saved favorites in real time.
4. **Profile & Points**: (Coming Soon) View listener points and rewards.

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m "feat: description of your feature"`
4. Push to your branch: `git push origin feature/YourFeature`
5. Open a Pull Request and describe your changes.

Please follow the existing code style and include tests if applicable.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Contact

* **Maintainer**: ([johnsendi727@gmail.com](mailto: johnsendi727@gmail.com))
* **Repository**: [ ](https://github.com/your-username/solstream-frontend)
