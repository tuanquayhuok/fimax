const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const fs = require('fs');
const path = require('path');

const VIEWS_FILE = path.join(__dirname, 'movie_views.json');
let viewsStore = {};

try {
  if (fs.existsSync(VIEWS_FILE)) {
    viewsStore = JSON.parse(fs.readFileSync(VIEWS_FILE, 'utf8'));
  }
} catch (e) {
  viewsStore = {};
}

function saveViewsStore() {
  try {
    fs.writeFileSync(VIEWS_FILE, JSON.stringify(viewsStore, null, 2), 'utf8');
  } catch (e) {}
}

let moviesDatabase = [];
let bannersDatabase = [];

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

// Fetch live movies & banners from fimax.aecongnghe.online
async function syncFromWebSource() {
  try {
    const res = await fetch('http://fimax.aecongnghe.online/', {
      headers: { 'User-Agent': 'FIMAX-Backend-Sync/1.0' }
    });
    if (!res.ok) return;
    const html = await res.text();

    // 1. SYNC FEATURED BANNERS from window.featuredMovies (Quản lý Banner trang chủ)
    const bannerMatch = html.match(/window\.featuredMovies\s*=\s*(\[.*?\]);/s);
    if (bannerMatch && bannerMatch[1]) {
      try {
        const rawBanners = JSON.parse(bannerMatch[1]);
        if (Array.isArray(rawBanners) && rawBanners.length > 0) {
          bannersDatabase = rawBanners.map(b => {
            const sampleStreams = [
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
            ];
            const fallbackStream = sampleStreams[Math.abs((parseInt(b.banner_id) || 1) % sampleStreams.length)];
            const validVideoUrl = (b.video_url && typeof b.video_url === 'string' && b.video_url.startsWith('http'))
              ? b.video_url.trim()
              : fallbackStream;

            const bannerImg = b.banner_image || b.backdrop_path || b.poster_path;
            const posterImg = b.poster_path || b.banner_image || b.backdrop_path;
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
                '1080p': validVideoUrl,
                '720p': validVideoUrl,
                'auto': validVideoUrl
              },
              trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
              orderPosition: parseInt(b.order_position) || 1
            };
          });
          bannersDatabase.sort((a, b) => a.orderPosition - b.orderPosition);
          console.log(`[FIMAX Sync] Synchronized ${bannersDatabase.length} Admin Banners from fimax.aecongnghe.online!`);
        }
      } catch (e) {
        console.log('[FIMAX Sync Banners Error]:', e.message);
      }
    }

    // 2. SYNC CATEGORY MOVIES from window.categoryMovies
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
          const validVideoUrl = (m.video_url && typeof m.video_url === 'string' && m.video_url.startsWith('http')) ? m.video_url : fallbackStream;
          const movieId = 'web_' + m.id;
          const currentViews = typeof viewsStore[movieId] === 'number' ? viewsStore[movieId] : (parseInt(m.vote_count) || 0);
          if (viewsStore[movieId] === undefined) {
            viewsStore[movieId] = currentViews;
          }

          const isAnimation = (m.title && (
            m.title.toLowerCase().includes('na tra') ||
            m.title.toLowerCase().includes('suzume') ||
            m.title.toLowerCase().includes('doraemon') ||
            m.title.toLowerCase().includes('mèo đi hia') ||
            m.title.toLowerCase().includes('minion') ||
            m.title.toLowerCase().includes('con ké') ||
            m.title.toLowerCase().includes('anime') ||
            m.title.toLowerCase().includes('hoạt hình') ||
            m.title.toLowerCase().includes('spider-verse')
          ));

          const movieGenres = isAnimation
            ? ['Hoạt hình', 'Anime', 'Chiếu Rạp', 'Kỳ ảo']
            : ['Điện ảnh', 'Chiếu Rạp', cat === 'korean' ? 'Hàn Quốc' : (cat === 'vietnam' ? 'Việt Nam' : 'Âu Mỹ')];

          movies.push({
            id: movieId,
            title: m.title,
            originalTitle: m.slug || m.title,
            rating: parseFloat(m.vote_average) || 8.8,
            releaseYear: m.release_date ? parseInt(m.release_date.substring(0, 4)) : 2025,
            duration: (m.duration || 115) + ' phút',
            country: cat === 'vietnam' ? 'Việt Nam' : (cat === 'korean' ? 'Hàn Quốc' : 'Âu Mỹ'),
            genres: movieGenres,
            overview: m.description || `Bộ phim ${m.title} chiếu rạp đặc sắc trên FIMAX.`,
            posterUrl: m.poster_path,
            backdropUrl: m.backdrop_path || m.poster_path,
            trailerUrl: m.trailer_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            videoSources: {
              '1080p': validVideoUrl,
              '720p': validVideoUrl,
              'auto': validVideoUrl
            },
            viewCount: currentViews,
            categoryTag: isAnimation ? 'animation' : cat
          });
        }
      }
      if (movies.length > 0) {
        moviesDatabase = movies;
        saveViewsStore();
        console.log(`[FIMAX Sync] Synchronized ${movies.length} movies from fimax.aecongnghe.online!`);
      }
    }
  } catch (e) {
    console.log('[FIMAX Sync Error]:', e.message);
  }
}

// Initial sync
syncFromWebSource();
// Periodic sync every 5 minutes
setInterval(syncFromWebSource, 5 * 60 * 1000);

// API Endpoints
app.get('/api/banners', (req, res) => {
  res.json(bannersDatabase);
});

app.get('/api/movies', (req, res) => {
  // Always attach fresh viewCount
  const withViews = moviesDatabase.map(m => ({
    ...m,
    viewCount: typeof viewsStore[m.id] === 'number' ? viewsStore[m.id] : (m.viewCount || 0)
  }));
  res.json(withViews);
});

// Increment real movie view count
app.post('/api/movies/:id/view', (req, res) => {
  const movieId = req.params.id;
  viewsStore[movieId] = (viewsStore[movieId] || 0) + 1;
  saveViewsStore();
  
  const m = moviesDatabase.find(item => item.id === movieId);
  if (m) {
    m.viewCount = viewsStore[movieId];
  }
  
  console.log(`[View Count +1] Movie ID: ${movieId} -> Real Views: ${viewsStore[movieId]}`);
  res.json({ success: true, movieId, viewCount: viewsStore[movieId] });
});

// Get real movie view count
app.get('/api/movies/:id/view', (req, res) => {
  const movieId = req.params.id;
  const viewCount = viewsStore[movieId] || 0;
  res.json({ success: true, movieId, viewCount });
});

app.post('/api/sync-web-source', async (req, res) => {
  await syncFromWebSource();
  res.json({ success: true, count: moviesDatabase.length, movies: moviesDatabase });
});

app.post('/api/callbacks/playback', (req, res) => {
  console.log('[Playback Event Received]:', req.body);
  res.json({ success: true, received: req.body });
});

app.listen(PORT, () => {
  console.log(`FIMAX Backend Server running on http://localhost:${PORT}`);
});