import { MOCK_MOVIES } from '../data/mockMovies';

const DEFAULT_API_URL = 'http://127.0.0.1:4000/api';
const WEB_SOURCE_URL = 'http://fimax.aecongnghe.online/';

// Global in-memory cache for 0ms instant loading
let memoryCache = [...MOCK_MOVIES];
let featuredBannersCache = [];
let isFetchingBackground = false;
let lastFetchTimestamp = 0;

// Callbacks for real-time listeners
const listeners = new Set();
const bannerListeners = new Set();

export function subscribeMovieUpdates(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function subscribeBannerUpdates(callback) {
  bannerListeners.add(callback);
  return () => bannerListeners.delete(callback);
}

function notifyListeners() {
  listeners.forEach(cb => {
    try {
      cb(memoryCache);
    } catch (e) {}
  });
  bannerListeners.forEach(cb => {
    try {
      cb(featuredBannersCache);
    } catch (e) {}
  });
}

function formatBannerUrl(rawUrl) {
  if (!rawUrl) return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200';
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;
  return 'http://fimax.aecongnghe.online/' + rawUrl.replace(/^\/+/, '');
}

async function syncWebSourceInBackground(force = false) {
  const now = Date.now();
  if (isFetchingBackground || (!force && (now - lastFetchTimestamp < 5000) && memoryCache.length > 20)) {
    return { movies: memoryCache, banners: featuredBannersCache };
  }

  isFetchingBackground = true;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const fetchUrl = `${WEB_SOURCE_URL}?_nocache=${Date.now()}`;
    const response = await fetch(fetchUrl, {
      headers: {
        'User-Agent': 'FIMAX-Cinema-App/2.4',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const html = await response.text();

      // 1. EXACT BANNER PARSER from http://fimax.aecongnghe.online/admin.php?tab=banners
      const bannerMatch = html.match(/window\.featuredMovies\s*=\s*(\[.*?\]);/s);
      if (bannerMatch && bannerMatch[1]) {
        try {
          const rawBanners = JSON.parse(bannerMatch[1]);
          if (Array.isArray(rawBanners) && rawBanners.length > 0) {
            featuredBannersCache = rawBanners.map(b => {
              const bannerImg = formatBannerUrl(b.banner_image || b.backdrop_path || b.poster_path);
              const backdropImg = formatBannerUrl(b.backdrop_path || b.banner_image || b.poster_path);
              const posterImg = formatBannerUrl(b.poster_path || b.banner_image || b.backdrop_path);
              const vUrl = b.video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

              return {
                id: 'banner_' + (b.banner_id || b.id || Math.random().toString(36).substr(2, 6)),
                movieId: b.id || b.banner_id,
                title: b.title || 'Phim Chiếu Rạp',
                overview: b.overview || `Bộ phim bom tấn ${b.title} đang chiếu tại FIMAX.`,
                bannerImage: bannerImg,
                backdropUrl: bannerImg,
                posterUrl: posterImg,
                rating: 9.0,
                releaseYear: 2025,
                duration: '120 phút',
                genres: ['Chiếu Rạp', 'Bom Tấn', 'Nổi Bật'],
                country: 'Điện ảnh',
                videoSources: {
                  '1080p': vUrl,
                  '720p': vUrl,
                  'auto': vUrl
                },
                trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
              };
            });
          }
        } catch (e) {}
      }

      // 2. CATEGORY MOVIES PARSER
      const match = html.match(/window\.categoryMovies\s*=\s*(\{.*?\});/s);
      if (match && match[1]) {
        const data = JSON.parse(match[1]);
        const movies = [];

        for (const [cat, list] of Object.entries(data)) {
          if (!Array.isArray(list)) continue;

          for (const m of list) {
            const videoUrl = m.video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
            const poster = formatBannerUrl(m.poster_path);
            const backdrop = formatBannerUrl(m.backdrop_path || m.poster_path);
            const country = cat === 'vietnam' ? 'Việt Nam' : (cat === 'korean' ? 'Hàn Quốc' : 'Âu Mỹ');
            const genreList = cat === 'vietnam' ? ['Điện ảnh', 'Việt Nam', 'Tâm lý'] : (cat === 'korean' ? ['Hàn Quốc', 'Tình cảm', 'Hành động'] : ['Chiếu Rạp', 'Bom tấn']);

            movies.push({
              id: 'web_' + (m.id || Math.random().toString(36).substr(2, 9)),
              title: m.title || 'Phim Chiếu Rạp',
              originalTitle: m.slug || m.title,
              rating: parseFloat(m.vote_average) || 8.8,
              releaseYear: m.release_date ? parseInt(m.release_date.substring(0, 4)) : 2025,
              duration: (m.duration || 115) + ' phút',
              country: country,
              ageRating: '16+',
              isFeatured: true,
              isHot: true,
              isNew: cat === 'latest',
              isTrending: true,
              isUpcoming: false,
              viewCount: (parseInt(m.vote_count) || 1200) * 100,
              genres: genreList,
              director: 'Đang cập nhật',
              cast: [],
              overview: m.description || `Bộ phim điện ảnh ${m.title} phát hành rạp chất lượng cao tại FIMAX.`,
              backdropUrl: backdrop,
              posterUrl: poster,
              trailerUrl: m.trailer_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
              videoSources: {
                '1080p': videoUrl,
                '720p': videoUrl,
                'auto': videoUrl
              },
              subtitles: [
                { language: 'Tiếng Việt', code: 'vi', label: 'Tiếng Việt (Chuẩn)' },
                { language: 'None', code: 'none', label: 'Tắt phụ đề' }
              ],
              audioTracks: [
                { language: 'Gốc - Dolby 5.1', code: 'vi_orig', label: 'Âm thanh Gốc' }
              ],
              categoryTag: cat
            });
          }
        }

        if (movies.length > 0) {
          memoryCache = movies;
          lastFetchTimestamp = Date.now();
          notifyListeners();
        }
      }
    }
  } catch (e) {
    // Graceful fallback
  } finally {
    isFetchingBackground = false;
  }

  return { movies: memoryCache, banners: featuredBannersCache };
}

// Initial immediate sync
syncWebSourceInBackground(true);

export const ApiService = {
  async getAllMovies(apiUrl = DEFAULT_API_URL, forceRefresh = false) {
    if (forceRefresh) {
      await syncWebSourceInBackground(true);
    } else {
      syncWebSourceInBackground(false);
    }
    return memoryCache;
  },

  // Exact Web Admin Banners from tab=banners
  async getFeaturedBanners(forceRefresh = false) {
    if (forceRefresh || featuredBannersCache.length === 0) {
      await syncWebSourceInBackground(forceRefresh);
    }
    return featuredBannersCache.length > 0 ? featuredBannersCache : memoryCache.slice(0, 5);
  },

  async getTrendingMovies(apiUrl = DEFAULT_API_URL) {
    const all = await this.getAllMovies(apiUrl);
    return all.slice(0, 10);
  },

  async getNewReleases(apiUrl = DEFAULT_API_URL) {
    const all = await this.getAllMovies(apiUrl);
    const filtered = all.filter(m => m.categoryTag === 'latest' || m.isNew);
    return filtered.length > 0 ? filtered : all.slice(0, 8);
  },

  async getTopRatedMovies(apiUrl = DEFAULT_API_URL) {
    const all = await this.getAllMovies(apiUrl);
    const filtered = all.filter(m => m.categoryTag === 'cinema' || m.rating >= 8.5);
    return filtered.length > 0 ? filtered : all.slice(5, 12);
  },

  async getComingSoonMovies(apiUrl = DEFAULT_API_URL) {
    const all = await this.getAllMovies(apiUrl);
    return all.slice(10, 18);
  },

  async getMoviesByCountry(countryName, apiUrl = DEFAULT_API_URL) {
    const all = await this.getAllMovies(apiUrl);
    const filtered = all.filter(m => {
      if (countryName === 'Việt Nam') {
        return m.country === 'Việt Nam' || m.categoryTag === 'vietnam';
      }
      if (countryName === 'Hàn Quốc') {
        return m.country === 'Hàn Quốc' || m.categoryTag === 'korean';
      }
      return m.country !== 'Việt Nam' && m.categoryTag !== 'vietnam';
    });
    return filtered.length > 0 ? filtered : all.slice(0, 8);
  },

  async searchMovies(query, apiUrl = DEFAULT_API_URL) {
    const all = await this.getAllMovies(apiUrl);
    if (!query || query.trim() === '') return [];
    const q = query.toLowerCase().trim();
    return all.filter(m =>
      (m.title && m.title.toLowerCase().includes(q)) ||
      (m.originalTitle && m.originalTitle.toLowerCase().includes(q)) ||
      (Array.isArray(m.genres) && m.genres.some(g => g.toLowerCase().includes(q)))
    );
  }
};