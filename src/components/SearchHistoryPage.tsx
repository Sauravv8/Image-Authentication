import { useState, useEffect } from 'react';
import { getUserSearchHistory, getTopSearches } from '../services/searchHistory';
import type { SearchHistory, TopSearch } from '../lib/supabase';

export default function SearchHistoryPage() {
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [topSearches, setTopSearches] = useState<TopSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [history, top] = await Promise.all([
        getUserSearchHistory(),
        getTopSearches()
      ]);
      setSearchHistory(history);
      setTopSearches(top);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load search history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Top Searches Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Searches</h2>
          <div className="space-y-4">
            {topSearches.map(({ term, count }) => (
              <div 
                key={term}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <span className="text-lg font-medium text-gray-700">{term}</span>
                <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  {count} searches
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent History Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Searches</h2>
          <div className="space-y-3">
            {searchHistory.map((search) => (
              <div 
                key={search.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <span className="text-lg text-gray-700">{search.term}</span>
                <span className="text-sm text-gray-500">
                  {new Date(search.timestamp).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}