import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { getTopSearches } from '../services/searchHistory';
import { TopSearch } from '../lib/supabase';

interface TopSearchesBannerProps {
  onSearchClick: (term: string) => void;
}

export default function TopSearchesBanner({ onSearchClick }: TopSearchesBannerProps) {
  const [topSearches, setTopSearches] = useState<TopSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopSearches();
  }, []);

  const loadTopSearches = async () => {
    try {
      const searches = await getTopSearches();
      setTopSearches(searches);
    } catch (error) {
      console.error('Error loading top searches:', error);
      // Silently fail for top searches as it's not critical
      setTopSearches([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading || topSearches.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 rounded-2xl shadow-lg animate-gradient">
      <div className="bg-white rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Trending Searches</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {topSearches.map((search, index) => (
            <button
              key={search.term}
              onClick={() => onSearchClick(search.term)}
              className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl font-medium text-gray-700 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              <span className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-white rounded-full text-xs font-bold text-purple-600 shadow-sm">
                  {index + 1}
                </span>
                {search.term}
                <span className="ml-1 px-2 py-0.5 bg-white rounded-full text-xs text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors">
                  {search.count}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
