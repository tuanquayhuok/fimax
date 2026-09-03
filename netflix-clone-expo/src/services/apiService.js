import { MOCK_MOVIES } from '../data/mockMovies';

const DEFAULT_API_URL = 'http://127.0.0.1:4000/api';
const WEB_SOURCE_URL = 'http://fimax.aecongnghe.online/';

// Helper to parse live web movies from fimax.aecongnghe.online HTML
let cachedWebMovies = null;

async function fetchFromWebSource() {
  if (cachedWebMovies && cachedWebMovies.length > 0) {
    return cachedWebMovies;
  }

  try {
    const response = await fetch(WEB_SOURCE_URL, {
      headers: { 'User-Agent': 'FIMAX-Cinema-App/2.4' }
    });

    if (!response.ok) return null;

    const html = await response.text();
    const match = html.match(/window\.categoryMovies\s*=\s*(\{.*?\});/s);

    if (match && match[1]) {
      const data = JSON.parse(match[1]);
      const movies = [];

      for (const [cat, list] of Object.entries(data)) {
        if (!Array.isArray(list)) continue;

        for (const m of list) {
          const videoUrl = m.video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
          const poster = m.poster_path || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600';
          const backdrop = m.backdrop_path || poster;
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
        cachedWebMovies = movies;
        return movies;
      }
    }
  } catch (error) {
    console.log('fetchFromWebSource error, using local fallback:', error.message);
  }

  return null;
}

export const ApiService = {
  async getAllMovies(apiUrl = DEFAULT_API_URL) {
    // 1. Try Live Web Source fimax.aecongnghe.online
    const webMovies = await fetchFromWebSource();
    if (webMovies && webMovies.length > 0) {
      return webMovies;
    }

    // 2. Try Backend Server
    try {
      const response = await fetch(`${apiUrl}/movies`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {}

    // 3. Mock Fallback
    return MOCK_MOVIES;
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