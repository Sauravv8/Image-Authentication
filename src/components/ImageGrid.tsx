import { useState, useEffect } from 'react';
import { Check, ExternalLink } from 'lucide-react';
import { UnsplashImage } from '../services/unsplash';

interface ImageGridProps {
  images: UnsplashImage[];
  searchTerm: string;
}

export default function ImageGrid({ images, searchTerm }: ImageGridProps) {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectedImages(new Set());
    setLoadedImages(new Set());
  }, [searchTerm]);

  const toggleSelection = (id: string) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id));
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            You searched for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">"{searchTerm}"</span>
          </h2>
          <p className="text-gray-600 mt-1">{images.length} results found</p>
        </div>
        {selectedImages.size > 0 && (
          <div className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg animate-bounce-in">
            Selected: {selectedImages.size} {selectedImages.size === 1 ? 'image' : 'images'}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer animate-slideUp"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => toggleSelection(image.id)}
          >
            <div className="aspect-square relative overflow-hidden bg-gray-100">
              {!loadedImages.has(image.id) && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300"></div>
              )}
              <img
                src={image.urls.small}
                alt={image.alt_description || 'Unsplash image'}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  loadedImages.has(image.id) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                } group-hover:scale-110`}
                onLoad={() => handleImageLoad(image.id)}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div
                className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedImages.has(image.id)
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 scale-100'
                    : 'bg-white/80 backdrop-blur-sm scale-0 group-hover:scale-100'
                }`}
              >
                {selectedImages.has(image.id) && (
                  <Check className="w-5 h-5 text-white animate-checkmark" />
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center justify-between text-white">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{image.user.name}</p>
                    <p className="text-xs text-white/80 truncate">@{image.user.username}</p>
                  </div>
                  <a
                    href={image.links.html}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="ml-2 p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
          opacity: 0;
        }
        @keyframes checkmark {
          0% {
            transform: scale(0) rotate(-45deg);
          }
          50% {
            transform: scale(1.2) rotate(-45deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }
        .animate-checkmark {
          animation: checkmark 0.3s ease-out;
        }
        @keyframes bounceIn {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-bounce-in {
          animation: bounceIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
