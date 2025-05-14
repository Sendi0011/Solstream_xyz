import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Mock search: Navigate to Artist Page or filter songs
      navigate(`/artist/${query}`);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search artists or songs..."
          className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg glass focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="absolute left-2 top-1/2 transform -translate-y-1/2"
        >
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-300" />
        </button>
      </div>
    </form>
  );
}