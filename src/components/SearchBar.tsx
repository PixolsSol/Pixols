import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useCanvasStore } from '../store/useCanvasStore';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const { highlightPixelsByOwner } = useCanvasStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    highlightPixelsByOwner(query);
  };

  return (
    <form onSubmit={handleSearch} className="absolute top-20 right-4 flex gap-2">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by wallet address"
          className="w-64 px-4 py-2 pr-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};