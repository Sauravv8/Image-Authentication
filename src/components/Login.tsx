import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Github, Mail } from 'lucide-react';

export default function Login() {
  const { signInWithProvider } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (provider: 'google' | 'facebook' | 'github') => {
    try {
      setLoading(provider);
      setError(null);
      await signInWithProvider(provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full transform transition-all hover:scale-[1.02] duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ImageFinder
          </h1>
          <p className="text-gray-600">
            Search and discover beautiful images
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-shake">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleSignIn('google')}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                className="text-blue-500"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                className="text-green-500"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                className="text-yellow-500"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                className="text-red-500"
              />
            </svg>
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              {loading === 'google' ? 'Connecting...' : 'Continue with Google'}
            </span>
          </button>

          <button
            onClick={() => handleSignIn('facebook')}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#1877F2] border-2 border-[#1877F2] rounded-xl font-semibold text-white hover:bg-[#166FE5] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              {loading === 'facebook' ? 'Connecting...' : 'Continue with Facebook'}
            </span>
          </button>

          <button
            onClick={() => handleSignIn('github')}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 border-2 border-gray-900 rounded-xl font-semibold text-white hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm hover:shadow-md"
          >
            <Github className="w-5 h-5" />
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              {loading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
            </span>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Secure authentication powered by Supabase</p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
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
