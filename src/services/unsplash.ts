export interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
}

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

if (!UNSPLASH_ACCESS_KEY) {
  throw new Error('Missing VITE_UNSPLASH_ACCESS_KEY in environment variables');
}

export async function searchUnsplashImages(query: string, page = 1): Promise<UnsplashImage[]> {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=20`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Unsplash API error:', {
      status: response.status,
      statusText: response.statusText,
      errorData
    });
    throw new Error(`Failed to fetch images from Unsplash: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
}
