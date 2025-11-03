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

const UNSPLASH_ACCESS_KEY = 'Xp74f69aQAm7rLcMA3WYKvyfAbQ5xyZUnN6RC_yFObM';

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
    throw new Error('Failed to fetch images from Unsplash');
  }

  const data = await response.json();
  return data.results;
}
