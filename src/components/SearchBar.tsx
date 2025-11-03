import { useState, FormEvent } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
        <div className="relative flex items-center bg-white rounded-2xl shadow-xl border-2 border-gray-100 focus-within:border-purple-300 transition-all duration-300">
          <div className="pl-6 pr-4">
            {loading ? (
              <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
            ) : (
              <Search className="w-6 h-6 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
            )}
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for images... (e.g., nature, technology, people)"
            disabled={loading}
            className="flex-1 py-5 pr-4 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-lg disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !searchTerm.trim()}
            className="mr-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
