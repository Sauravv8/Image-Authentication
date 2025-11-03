import { useEffect, useState } from 'react';
import { Clock, Search } from 'lucide-react';
import { getUserSearchHistory } from '../services/searchHistory';
import { SearchHistory as SearchHistoryType } from '../lib/supabase';

interface SearchHistoryProps {
  onSearchClick: (term: string) => void;
  refreshTrigger?: number;
}

export default function SearchHistory({ onSearchClick, refreshTrigger }: SearchHistoryProps) {
  const [history, setHistory] = useState<SearchHistoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [refreshTrigger]);

  const loadHistory = async () => {
    try {
      const data = await getUserSearchHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error loading search history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Your History</h2>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No search history yet</p>
          <p className="text-xs mt-1">Start searching to see your history</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSearchClick(item.term)}
              className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 group border border-transparent hover:border-purple-200"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700 group-hover:text-purple-700 transition-colors">
                  {item.term}
                </span>
                <span className="text-xs text-gray-500 group-hover:text-purple-500">
                  {formatTimestamp(item.timestamp)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a855f7, #ec4899);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9333ea, #db2777);
        }
      `}</style>
    </div>
  );
}
