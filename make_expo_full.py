import os

expo_dir = r"C:\Users\ADMIN\.gemini\antigravity\scratch\netflix-cinema-project\netflix-clone-expo"
src_dir = os.path.join(expo_dir, "src")

# 1. src/data/mockMovies.js
mock_movies_js = """export const MOCK_MOVIES = [
  {
    id: 'mov_1',
    title: 'Mai',
    originalTitle: 'Mai (2024)',
    rating: 8.7,
    releaseYear: 2024,
    duration: '2h 11m',
    durationSeconds: 7860,
    country: 'Việt Nam',
    ageRating: '18+',
    isFeatured: true,
    isHot: true,
    isNew: true,
    isTrending: true,
    isUpcoming: false,
    viewCount: 1540000,
    genres: ['Tâm lý', 'Tình cảm', 'Gia đình'],
    director: 'Trấn Thành',
    cast: [
      { name: 'Phương Anh Đào', role: 'Mai', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' },
      { name: 'Tuấn Trần', role: 'Dương', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
      { name: 'Hồng Đào', role: 'Bà Đào', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200' }
    ],
    overview: 'Cuộc đời đầy sóng gió và hy sinh của Mai - một nhân viên massage trị liệu, và chuyện tình dang dở nhưng chân thành với chàng nhạc công trẻ Dương.',
    backdropUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1200&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoSources: {
      '1080p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      '720p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      '360p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'auto': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    subtitles: [
      { language: 'Tiếng Việt', code: 'vi', label: 'Tiếng Việt (Chuẩn)' },
      { language: 'English', code: 'en', label: 'English (CC)' },
      { language: 'None', code: 'none', label: 'Tắt phụ đề' }
    ],
    audioTracks: [
      { language: 'Gốc (Tiếng Việt)', code: 'vi_orig', label: 'Gốc - Dolby 5.1' },
      { language: 'Thuyết minh', code: 'vi_tm', label: 'Thuyết minh Tiếng Việt' }
    ]
  },
  {
    id: 'mov_2',
    title: 'Lật Mặt 7: Một Điều Ước',
    originalTitle: 'Face Off 7: One Wish',
    rating: 8.5,
    releaseYear: 2024,
    duration: '2h 18m',
    durationSeconds: 8280,
    country: 'Việt Nam',
    ageRating: '13+',
    isFeatured: true,
    isHot: true,
    isNew: true,
    isTrending: true,
    isUpcoming: false,
    viewCount: 1890000,
    genres: ['Gia đình', 'Tâm lý', 'Hài hước'],
    director: 'Lý Hải',
    cast: [
      { name: 'Thanh Hiền', role: 'Bà Hai', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200' },
      { name: 'Trương Minh Cường', role: 'Hai Khôn', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' }
    ],
    overview: 'Câu chuyện xúc động về bà mẹ già 73 tuổi cùng 5 người con đi làm ăn xa. Khi biến cố ập đến, tình thân gia đình được thử thách.',
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    videoSources: {
      '1080p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      '720p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      '360p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'auto': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    subtitles: [
      { language: 'Tiếng Việt', code: 'vi', label: 'Tiếng Việt' },
      { language: 'English', code: 'en', label: 'English' }
    ],
    audioTracks: [
      { language: 'Gốc (Tiếng Việt)', code: 'vi_orig', label: 'Gốc Stereo' }
    ]
  },
  {
    id: 'mov_3',
    title: 'Cyberpunk: Thành Phố Bất Diệt',
    originalTitle: 'Neon Nexus 2049',
    rating: 9.1,
    releaseYear: 2026,
    duration: '2h 35m',
    durationSeconds: 9300,
    country: 'Mỹ',
    ageRating: '16+',
    isFeatured: true,
    isHot: true,
    isNew: true,
    isTrending: true,
    isUpcoming: false,
    viewCount: 2450000,
    genres: ['Khoa học viễn tưởng', 'Hành động', 'Hồi hộp'],
    director: 'Denis Villeneuve',
    cast: [
      { name: 'Ryan Gosling', role: 'Agent K', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200' },
      { name: 'Ana de Armas', role: 'Joi', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200' }
    ],
    overview: 'Trong thế giới tương lai tràn ngập ánh đèn neon và công nghệ cyborg, một thám tử tư phát hiện ra bí mật đe dọa sự tồn vong của toàn nhân loại.',
    backdropUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoSources: {
      '1080p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      '720p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      '360p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      'auto': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    },
    subtitles: [
      { language: 'Tiếng Việt', code: 'vi', label: 'Phụ đề Tiếng Việt' },
      { language: 'English', code: 'en', label: 'English SDH' }
    ],
    audioTracks: [
      { language: 'Tiếng Anh (Gốc)', code: 'en_orig', label: 'English Original (Dolby Atmos)' },
      { language: 'Thuyết minh Tiếng Việt', code: 'vi_tm', label: 'Thuyết minh Việt' }
    ]
  },
  {
    id: 'mov_4',
    title: 'Ký Sinh Trùng 2: Sự Trỗi Dậy',
    originalTitle: 'Parasite: The Resurgence',
    rating: 8.9,
    releaseYear: 2025,
    duration: '2h 10m',
    durationSeconds: 7800,
    country: 'Hàn Quốc',
    ageRating: '18+',
    isFeatured: false,
    isHot: true,
    isNew: true,
    isTrending: true,
    isUpcoming: false,
    viewCount: 1980000,
    genres: ['Tâm lý', 'Hồi hộp', 'Kịch tính'],
    director: 'Bong Joon-ho',
    cast: [
      { name: 'Song Kang-ho', role: 'Kim Ki-taek', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' }
    ],
    overview: 'Sự tiếp nối của câu chuyện phân tầng giai cấp tàn khốc, nơi những ranh giới giữa người giàu và người nghèo một lần nữa bị xóa nhòa trong một thảm kịch không lường trước.',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoSources: {
      '1080p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      '720p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      '360p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      'auto': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    },
    subtitles: [
      { language: 'Tiếng Việt', code: 'vi', label: 'Tiếng Việt' },
      { language: 'English', code: 'en', label: 'English' }
    ],
    audioTracks: [
      { language: 'Gốc (Hàn Quốc)', code: 'ko_orig', label: 'Korean Original' },
      { language: 'Thuyết minh Tiếng Việt', code: 'vi_tm', label: 'Thuyết minh Tiếng Việt' }
    ]
  },
  {
    id: 'mov_5',
    title: 'Hỏa Ngục Vũ Trụ 2026',
    originalTitle: 'Stellar Inferno',
    rating: 8.2,
    releaseYear: 2026,
    duration: '2h 05m',
    durationSeconds: 7500,
    country: 'Mỹ',
    ageRating: '13+',
    isFeatured: false,
    isHot: false,
    isNew: false,
    isTrending: false,
    isUpcoming: true,
    viewCount: 450000,
    genres: ['Khoa học viễn tưởng', 'Hành động', 'Phiêu lưu'],
    director: 'Christopher Nolan',
    cast: [
      { name: 'Cillian Murphy', role: 'Captain Vance', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200' }
    ],
    overview: 'Chuyến hành trình cảm tử của con tàu thám hiểm cuối cùng cứu lấy mặt trời đang lụi tàn.',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    videoSources: {
      '1080p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      '720p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      '360p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'auto': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    },
    subtitles: [{ language: 'Tiếng Việt', code: 'vi', label: 'Tiếng Việt' }],
    audioTracks: [{ language: 'Tiếng Anh (Gốc)', code: 'en_orig', label: 'English' }]
  },
  {
    id: 'mov_6',
    title: 'Suzume: Khóa Chặt Cửa Nào',
    originalTitle: 'Suzume no Tojimari',
    rating: 8.8,
    releaseYear: 2023,
    duration: '2h 02m',
    durationSeconds: 7320,
    country: 'Nhật Bản',
    ageRating: 'P',
    isFeatured: false,
    isHot: true,
    isNew: false,
    isTrending: true,
    isUpcoming: false,
    viewCount: 1720000,
    genres: ['Hoạt hình', 'Kỳ ảo', 'Phiêu lưu'],
    director: 'Makoto Shinkai',
    cast: [
      { name: 'Nanoka Hara', role: 'Suzume Iwato', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }
    ],
    overview: 'Cô gái 17 tuổi Suzume tình cờ gặp gỡ chàng trai trẻ Souta đang tìm kiếm những cánh cửa bí ẩn mở ra thảm họa khắp nước Nhật.',
    backdropUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoSources: {
      '1080p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      '720p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      '360p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'auto': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    subtitles: [
      { language: 'Tiếng Việt', code: 'vi', label: 'Tiếng Việt' },
      { language: 'English', code: 'en', label: 'English' }
    ],
    audioTracks: [
      { language: 'Gốc (Nhật Bản)', code: 'ja_orig', label: 'Japanese Original' },
      { language: 'Lồng tiếng Tiếng Việt', code: 'vi_dub', label: 'Lồng tiếng Việt' }
    ]
  }
];

export const GENRES = [
  'Tất cả',
  'Hành động',
  'Tâm lý',
  'Gia đình',
  'Khoa học viễn tưởng',
  'Hoạt hình',
  'Hồi hộp',
  'Kỳ ảo',
  'Hài hước',
  'Tình cảm'
];

export const COUNTRIES = [
  'Tất cả',
  'Việt Nam',
  'Mỹ',
  'Hàn Quốc',
  'Nhật Bản',
  'Trung Quốc',
  'Thái Lan'
];
"""
with open(os.path.join(src_dir, "data", "mockMovies.js"), "w", encoding="utf-8") as f:
    f.write(mock_movies_js)

# 2. src/services/apiService.js
api_service_js = """import { MOCK_MOVIES } from '../data/mockMovies';

export class ApiService {
  static async fetchHomeData(baseUrl) {
    if (baseUrl && baseUrl.startsWith('http')) {
      try {
        const response = await fetch(`${baseUrl}/movies/home`, { headers: { 'Content-Type': 'application/json' } });
        if (response.ok) {
          const resJson = await response.json();
          if (resJson.success && resJson.data) return resJson.data;
        }
      } catch (err) {
        console.warn('API error, fallback to mock data:', err.message);
      }
    }

    // Fallback to local structured data
    const heroBanner = MOCK_MOVIES.find(m => m.isFeatured) || MOCK_MOVIES[0];
    const newReleases = MOCK_MOVIES.filter(m => m.isNew);
    const hotMovies = MOCK_MOVIES.filter(m => m.isHot);
    const mostViewed = [...MOCK_MOVIES].sort((a, b) => b.viewCount - a.viewCount);
    const topRated = [...MOCK_MOVIES].sort((a, b) => b.rating - a.rating);
    const upcoming = MOCK_MOVIES.filter(m => m.isUpcoming);

    return {
      heroBanner,
      sections: [
        { id: 'sec_new', title: 'Phim Mới Cập Nhật', items: newReleases },
        { id: 'sec_hot', title: 'Phim Đang Hot 🔥', items: hotMovies },
        { id: 'sec_views', title: 'Phim Được Xem Nhiều Nhất', items: mostViewed },
        { id: 'sec_top', title: 'Phim Đánh Giá Cao ⭐', items: topRated },
        { id: 'sec_upcoming', title: 'Phim Sắp Ra Mắt ⏳', items: upcoming.length ? upcoming : MOCK_MOVIES.slice(0, 3) }
      ],
      genres: ['Hành động', 'Tâm lý', 'Gia đình', 'Khoa học viễn tưởng', 'Hoạt hình', 'Hồi hộp', 'Kỳ ảo', 'Hài hước'],
      countries: ['Việt Nam', 'Mỹ', 'Hàn Quốc', 'Nhật Bản', 'Trung Quốc', 'Thái Lan']
    };
  }

  static async fetchMovies(baseUrl, filters = {}) {
    if (baseUrl && baseUrl.startsWith('http')) {
      try {
        const queryParams = new URLSearchParams();
        if (filters.q) queryParams.append('q', filters.q);
        if (filters.genre && filters.genre !== 'Tất cả') queryParams.append('genre', filters.genre);
        if (filters.country && filters.country !== 'Tất cả') queryParams.append('country', filters.country);
        if (filters.year) queryParams.append('year', filters.year);
        if (filters.minRating) queryParams.append('minRating', filters.minRating);
        if (filters.sort) queryParams.append('sort', filters.sort);

        const response = await fetch(`${baseUrl}/movies?${queryParams.toString()}`);
        if (response.ok) {
          const resJson = await response.json();
          if (resJson.success && resJson.data) return resJson.data;
        }
      } catch (err) {
        console.warn('API fetchMovies fallback:', err.message);
      }
    }

    // Local filter
    let results = [...MOCK_MOVIES];
    if (filters.q) {
      const q = filters.q.toLowerCase();
      results = results.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q) ||
        (m.cast && m.cast.some(c => c.name.toLowerCase().includes(q)))
      );
    }
    if (filters.genre && filters.genre !== 'Tất cả') {
      results = results.filter(m => m.genres.includes(filters.genre));
    }
    if (filters.country && filters.country !== 'Tất cả') {
      results = results.filter(m => m.country === filters.country);
    }
    if (filters.year) {
      results = results.filter(m => m.releaseYear.toString() === filters.year.toString());
    }
    if (filters.minRating) {
      results = results.filter(m => m.rating >= parseFloat(filters.minRating));
    }
    if (filters.sort === 'latest') {
      results.sort((a, b) => b.releaseYear - a.releaseYear);
    } else if (filters.sort === 'views') {
      results.sort((a, b) => b.viewCount - a.viewCount);
    } else if (filters.sort === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    }

    return results;
  }
}
"""
with open(os.path.join(src_dir, "services", "apiService.js"), "w", encoding="utf-8") as f:
    f.write(api_service_js)

# 3. src/services/callbackService.js
callback_service_js = """export class CallbackService {
  static async sendPlaybackProgress(callbackUrl, payload) {
    if (!callbackUrl || !callbackUrl.startsWith('http')) {
      console.log('[LOCAL CALLBACK SIMULATION]', payload);
      return { success: true, local: true };
    }

    try {
      const response = await fetch(callbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          timestamp: new Date().toISOString()
        })
      });
      const data = await response.json();
      console.log('[CALLBACK SUCCESS]', data);
      return { success: true, data };
    } catch (err) {
      console.warn('[CALLBACK ERROR]', err.message);
      return { success: false, error: err.message };
    }
  }
}
"""
with open(os.path.join(src_dir, "services", "callbackService.js"), "w", encoding="utf-8") as f:
    f.write(callback_service_js)

# 4. src/context/AppContext.js
app_context_js = """import React, { createContext, useState, useEffect } from 'react';
import { MOCK_MOVIES } from '../data/mockMovies';
import { CallbackService } from '../services/callbackService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // URLs config (Dynamic API & Callback Webhook)
  const [apiUrl, setApiUrl] = useState('http://localhost:4000/api');
  const [callbackUrl, setCallbackUrl] = useState('http://localhost:4000/api/callback/progress');
  
  // Library States
  const [favorites, setFavorites] = useState(['mov_1', 'mov_3']);
  const [continueWatching, setContinueWatching] = useState([
    { movieId: 'mov_1', currentTime: 1840, duration: 7860, percentage: 23, lastUpdated: new Date().toISOString() },
    { movieId: 'mov_3', currentTime: 4650, duration: 9300, percentage: 50, lastUpdated: new Date().toISOString() }
  ]);
  const [watchHistory, setWatchHistory] = useState([
    { movieId: 'mov_1', watchedAt: 'Hôm nay, 14:30', progress: '23%' },
    { movieId: 'mov_2', watchedAt: 'Hôm qua, 20:15', progress: '100%' },
    { movieId: 'mov_4', watchedAt: '3 ngày trước', progress: '85%' }
  ]);

  // Player Active State
  const [activeMovieForPlayer, setActiveMovieForPlayer] = useState(null);
  const [activeMovieForTrailer, setActiveMovieForTrailer] = useState(null);
  const [activeRatingMovie, setActiveRatingMovie] = useState(null);

  // Settings
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [defaultQuality, setDefaultQuality] = useState('1080p');
  const [defaultSubtitle, setDefaultSubtitle] = useState('Tiếng Việt');
  const [autoPlayPreview, setAutoPlayPreview] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // User Profile & Auth
  const [user, setUser] = useState({
    isLoggedIn: true,
    name: 'Nguyễn Văn A',
    email: 'user@netflix-cinema.vn',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    plan: 'VIP Cinema 4K',
    joinedDate: 'Tháng 1/2026'
  });

  const toggleFavorite = (movieId) => {
    setFavorites(prev => 
      prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]
    );
  };

  const updateProgress = (movieId, currentTime, duration, quality = '1080p', isCompleted = false) => {
    const percentage = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;
    
    // Update continue watching
    setContinueWatching(prev => {
      const filtered = prev.filter(item => item.movieId !== movieId);
      if (isCompleted || percentage >= 95) return filtered;
      return [{ movieId, currentTime, duration, percentage, lastUpdated: new Date().toISOString() }, ...filtered];
    });

    // Update history
    setWatchHistory(prev => {
      const filtered = prev.filter(item => item.movieId !== movieId);
      return [{ movieId, watchedAt: 'Vừa xong', progress: percentage + '%' }, ...filtered];
    });

    // Send callback webhook
    const movie = MOCK_MOVIES.find(m => m.id === movieId);
    CallbackService.sendPlaybackProgress(callbackUrl, {
      event: isCompleted ? 'movie_completed' : 'playback_progress',
      movieId,
      movieTitle: movie?.title || 'Unknown Movie',
      userId: user.email,
      currentTime,
      duration,
      percentage,
      quality,
      isCompleted
    });
  };

  const clearHistory = () => {
    setWatchHistory([]);
    setContinueWatching([]);
  };

  return (
    <AppContext.Provider value={{
      apiUrl, setApiUrl,
      callbackUrl, setCallbackUrl,
      favorites, toggleFavorite,
      continueWatching, watchHistory, updateProgress, clearHistory,
      activeMovieForPlayer, setActiveMovieForPlayer,
      activeMovieForTrailer, setActiveMovieForTrailer,
      activeRatingMovie, setActiveRatingMovie,
      isDarkMode, setIsDarkMode,
      defaultQuality, setDefaultQuality,
      defaultSubtitle, setDefaultSubtitle,
      autoPlayPreview, setAutoPlayPreview,
      notificationsEnabled, setNotificationsEnabled,
      user, setUser
    }}>
      {children}
    </AppContext.Provider>
  );
};
"""
with open(os.path.join(src_dir, "context", "AppContext.js"), "w", encoding="utf-8") as f:
    f.write(app_context_js)

print("Created data, services, context")