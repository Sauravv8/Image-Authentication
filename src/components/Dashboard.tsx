import { useState } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from './SearchBar';
import ImageGrid from './ImageGrid';
import TopSearchesBanner from './TopSearchesBanner';
import SearchHistory from './SearchHistory';
import { searchUnsplashImages, UnsplashImage } from '../services/unsplash';
import { saveSearch } from '../services/searchHistory';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [searchResults, setSearchResults] = useState<UnsplashImage[]>([]);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);

  const handleSearch = async (term: string) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentSearchTerm(term);

      const images = await searchUnsplashImages(term);
      setSearchResults(images);

      await saveSearch(term);
      setHistoryRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search images');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>
      </div>

      <header className="relative bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">IF</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ImageFinder</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.user_metadata?.full_name || user?.email || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="p-2.5 bg-gray-100 hover:bg-red-50 rounded-xl text-gray-600 hover:text-red-600 transition-all duration-300 group"
                title="Sign out"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <TopSearchesBanner onSearchClick={handleSearch} />

          <SearchBar onSearch={handleSearch} loading={loading} />

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 animate-shake">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {loading && !searchResults.length && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600 font-medium">Searching for images...</p>
                </div>
              )}

              {!loading && searchResults.length === 0 && !currentSearchTerm && (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
                    <User className="w-10 h-10 text-purple-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Welcome to ImageFinder!
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Start searching for beautiful images from Unsplash
                  </p>
                </div>
              )}

              {!loading && searchResults.length === 0 && currentSearchTerm && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    No results found
                  </h2>
                  <p className="text-gray-600">
                    Try searching for something else
                  </p>
                </div>
              )}

              {searchResults.length > 0 && (
                <ImageGrid images={searchResults} searchTerm={currentSearchTerm} />
              )}
            </div>

            <div className="lg:col-span-1">
              <SearchHistory
                onSearchClick={handleSearch}
                refreshTrigger={historyRefreshTrigger}
              />
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(5deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(-5deg);
          }
        }
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 15s ease-in-out infinite;
          animation-delay: 7.5s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
