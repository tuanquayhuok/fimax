import { MOCK_MOVIES } from '../data/mockMovies';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_API_URL = 'http://localhost:4000/api';
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

function resolveBannerTitle(b) {
  if (b.banner_title && typeof b.banner_title === 'string' && b.banner_title.trim()) {
    return b.banner_title.trim();
  }
  const bid = String(b.banner_id || b.id);
  const bImg = (b.banner_image || '').toLowerCase();
  const bDesc = (b.overview || '').toLowerCase();

  if (bid === '1' || bImg.includes('spider-man') || bImg.includes('spider')) {
    return 'Người Nhện: Khởi đầu mới';
  }
  if (bid === '2' || bImg.includes('qnt') || bDesc.includes('quỷ') || bDesc.includes('nhập tràng')) {
    return 'Quỷ Nhập Tràng 2';
  }
  if (bid === '3' || bImg.includes('anhhung') || bDesc.includes('tử chiến trên không')) {
    return 'Anh Hùng';
  }
  if (bid === '5' || bImg.includes('wbozixweah8') || bDesc.includes('ariel') || bDesc.includes('tiên cá')) {
    return 'CON KÉ BA NGHE';
  }
  if (bid === '4' || bImg.includes('z8h4miehi-4') || bDesc.includes('vệ binh') || bDesc.includes('rocket')) {
    return 'Tài';
  }
  return b.title || 'Phim Chiếu Rạp';
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
    // 1. Fetch Movies & Admin Banners from Backend Server (CORS friendly)
    try {
      const [moviesRes, bannersRes] = await Promise.all([
        fetch('http://localhost:4000/api/movies'),
        fetch('http://localhost:4000/api/banners')
      ]);

      if (moviesRes.ok) {
        const backendMovies = await moviesRes.json();
        if (Array.isArray(backendMovies) && backendMovies.length > 0) {
          memoryCache = backendMovies;
        }
      }

      if (bannersRes.ok) {
        const backendBanners = await bannersRes.json();
        if (Array.isArray(backendBanners) && backendBanners.length > 0) {
          featuredBannersCache = backendBanners;
        }
      }

      if (memoryCache.length > 0 || featuredBannersCache.length > 0) {
        lastFetchTimestamp = Date.now();
        notifyListeners();
      }
    } catch (err) {}

    // 2. Direct Web Source fetch (works on Native iOS/Android and proxies)
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
              const posterImg = formatBannerUrl(b.poster_path || b.banner_image || b.backdrop_path);
              const sampleStreams = [
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
              ];
              const fallbackStream = sampleStreams[Math.abs((parseInt(b.banner_id) || 1) % sampleStreams.length)];
              const vUrl = (b.video_url && typeof b.video_url === 'string' && b.video_url.startsWith('http'))
                ? b.video_url.trim()
                : fallbackStream;

              const displayTitle = resolveBannerTitle(b);

              return {
                id: 'banner_' + (b.banner_id || b.id || Math.random().toString(36).substr(2, 6)),
                movieId: 'web_' + (b.id || b.banner_id),
                bannerId: b.banner_id,
                title: displayTitle,
                linkedMovieTitle: b.title || displayTitle,
                overview: b.overview || `Bộ phim bom tấn ${displayTitle} đang chiếu tại FIMAX.`,
                bannerImage: bannerImg,
                backdropUrl: bannerImg,
                posterUrl: posterImg,
                rating: parseFloat(b.vote_average) || 8.8,
                releaseYear: b.release_date ? parseInt(b.release_date.substring(0, 4)) : 2025,
                duration: '120 phút',
                genres: b.genre ? b.genre.split(',').map(g => g.trim()) : ['Chiếu Rạp', 'Bom Tấn', 'Nổi Bật'],
                country: 'Điện ảnh',
                videoSources: {
                  '1080p': vUrl,
                  '720p': vUrl,
                  'auto': vUrl
                },
                trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                orderPosition: parseInt(b.order_position) || 1
              };
            });
            featuredBannersCache.sort((a, b) => a.orderPosition - b.orderPosition);
            notifyListeners();
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
            const sampleStreams = [
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
            ];
            const fallbackStream = sampleStreams[Math.abs((m.id || 1) % sampleStreams.length)];
            const videoUrl = (m.video_url && typeof m.video_url === 'string' && m.video_url.startsWith('http')) ? m.video_url : fallbackStream;
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
  },

  // Real View Count Management
  async incrementViewCount(movieId, apiUrl = DEFAULT_API_URL) {
    if (!movieId) return 1;
    let newCount = null;

    // 1. Local storage immediate increment
    try {
      const key = `fimax_view_count_${movieId}`;
      const saved = await AsyncStorage.getItem(key);
      const parsed = saved ? parseInt(saved, 10) : 0;
      newCount = parsed + 1;
      await AsyncStorage.setItem(key, newCount.toString());
    } catch (e) {}

    // 2. Call backend server
    try {
      const res = await fetch(`http://localhost:4000/api/movies/${encodeURIComponent(movieId)}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.viewCount === 'number') {
          newCount = data.viewCount;
          await AsyncStorage.setItem(`fimax_view_count_${movieId}`, newCount.toString());
        }
      }
    } catch (e) {}

    // 3. Update memoryCache
    const target = memoryCache.find(m => m.id === movieId);
    if (target && newCount !== null) {
      target.viewCount = newCount;
      notifyListeners();
    }

    return newCount || 1;
  },

  async getViewCount(movieId) {
    if (!movieId) return 0;
    try {
      const key = `fimax_view_count_${movieId}`;
      const saved = await AsyncStorage.getItem(key);
      if (saved) return parseInt(saved, 10);
    } catch (e) {}

    const target = memoryCache.find(m => m.id === movieId);
    return target?.viewCount || 0;
  }
};
