import os

backend_dir = r"C:\Users\ADMIN\.gemini\antigravity\scratch\netflix-cinema-project\backend-admin-server"
os.makedirs(os.path.join(backend_dir, "public"), exist_ok=True)

server_code = """const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let movies = [
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

let callbackLogs = [];

app.get('/api/movies', (req, res) => {
  const { genre, country, year, minRating, sort, q } = req.query;
  let results = [...movies];

  if (q) {
    const query = q.toLowerCase();
    results = results.filter(m => 
      m.title.toLowerCase().includes(query) ||
      m.director.toLowerCase().includes(query) ||
      m.cast.some(c => c.name.toLowerCase().includes(query))
    );
  }

  if (genre && genre !== 'All' && genre !== 'Tất cả') {
    results = results.filter(m => m.genres.includes(genre));
  }
  if (country && country !== 'All' && country !== 'Tất cả') {
    results = results.filter(m => m.country === country);
  }
  if (year) {
    results = results.filter(m => m.releaseYear.toString() === year);
  }
  if (minRating) {
    results = results.filter(m => m.rating >= parseFloat(minRating));
  }

  if (sort === 'latest') {
    results.sort((a, b) => b.releaseYear - a.releaseYear);
  } else if (sort === 'views') {
    results.sort((a, b) => b.viewCount - a.viewCount);
  } else if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  }

  res.json({ success: true, count: results.length, data: results });
});

app.get('/api/movies/home', (req, res) => {
  const heroBanner = movies.find(m => m.isFeatured) || movies[0];
  const newReleases = movies.filter(m => m.isNew);
  const hotMovies = movies.filter(m => m.isHot);
  const mostViewed = [...movies].sort((a, b) => b.viewCount - a.viewCount);
  const topRated = [...movies].sort((a, b) => b.rating - a.rating);
  const upcoming = movies.filter(m => m.isUpcoming);
  
  const genres = ['Hành động', 'Tâm lý', 'Gia đình', 'Khoa học viễn tưởng', 'Hoạt hình', 'Hồi hộp', 'Kỳ ảo', 'Hài hước'];
  const countries = ['Việt Nam', 'Mỹ', 'Hàn Quốc', 'Nhật Bản', 'Trung Quốc', 'Thái Lan'];

  res.json({
    success: true,
    data: {
      heroBanner,
      sections: [
        { id: 'sec_new', title: 'Phim Mới Cập Nhật', items: newReleases },
        { id: 'sec_hot', title: 'Phim Đang Hot 🔥', items: hotMovies },
        { id: 'sec_views', title: 'Phim Được Xem Nhiều Nhất', items: mostViewed },
        { id: 'sec_top', title: 'Phim Đánh Giá Cao ⭐', items: topRated },
        { id: 'sec_upcoming', title: 'Phim Sắp Ra Mắt ⏳', items: upcoming.length ? upcoming : movies.slice(0, 3) }
      ],
      genres,
      countries
    }
  });
});

app.get('/api/movies/:id', (req, res) => {
  const movie = movies.find(m => m.id === req.params.id);
  if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
  const relatedMovies = movies.filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g))).slice(0, 6);
  res.json({ success: true, data: { ...movie, related: relatedMovies } });
});

app.post('/api/callback/progress', (req, res) => {
  const { event, movieId, movieTitle, userId, currentTime, duration, percentage, quality, isCompleted } = req.body;
  
  const logEntry = {
    id: 'cb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    receivedAt: new Date().toISOString(),
    event: event || 'playback_progress',
    movieId: movieId || 'unknown',
    movieTitle: movieTitle || (movies.find(m => m.id === movieId)?.title) || 'Movie',
    userId: userId || 'anonymous_user',
    currentTime: currentTime || 0,
    duration: duration || 0,
    percentage: percentage || (duration ? Math.round((currentTime / duration) * 100) : 0),
    quality: quality || '1080p',
    isCompleted: !!isCompleted,
    ip: req.ip
  };

  callbackLogs.unshift(logEntry);
  if (callbackLogs.length > 100) callbackLogs.pop();

  console.log('[CALLBACK RECEIVED]', logEntry.receivedAt, 'Movie:', logEntry.movieTitle, 'Progress:', logEntry.percentage + '%');
  res.json({ success: true, message: 'Callback processed successfully', logId: logEntry.id });
});

app.get('/api/admin/movies', (req, res) => res.json({ success: true, data: movies }));

app.post('/api/admin/movies', (req, res) => {
  const newMovie = {
    id: 'mov_' + Date.now(),
    ...req.body,
    rating: parseFloat(req.body.rating) || 8.0,
    releaseYear: parseInt(req.body.releaseYear) || 2026,
    viewCount: parseInt(req.body.viewCount) || 1000
  };
  movies.unshift(newMovie);
  res.json({ success: true, data: newMovie });
});

app.delete('/api/admin/movies/:id', (req, res) => {
  movies = movies.filter(m => m.id !== req.params.id);
  res.json({ success: true, message: 'Deleted successfully' });
});

app.get('/api/admin/callbacks', (req, res) => res.json({ success: true, count: callbackLogs.length, logs: callbackLogs }));
app.delete('/api/admin/callbacks', (req, res) => { callbackLogs = []; res.json({ success: true, message: 'Cleared logs' }); });

app.listen(PORT, '0.0.0.0', () => console.log('Movie backend server started on port ' + PORT));
""";

with open(os.path.join(backend_dir, "server.js"), "w", encoding="utf-8") as f:
    f.write(server_code)
print("Created server.js")