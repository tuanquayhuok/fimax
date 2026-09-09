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

// Fetch live movies from fimax.aecongnghe.online
async function syncFromWebSource() {
  try {
    const res = await fetch('http://fimax.aecongnghe.online/', {
      headers: { 'User-Agent': 'FIMAX-Backend-Sync/1.0' }
    });
    if (!res.ok) return;
    const html = await res.text();
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

          movies.push({
            id: movieId,
            title: m.title,
            originalTitle: m.slug || m.title,
            rating: parseFloat(m.vote_average) || 8.8,
            releaseYear: m.release_date ? parseInt(m.release_date.substring(0, 4)) : 2025,
            duration: (m.duration || 115) + ' phút',
            country: cat === 'vietnam' ? 'Việt Nam' : (cat === 'korean' ? 'Hàn Quốc' : 'Âu Mỹ'),
            genres: ['Điện ảnh', 'Chiếu Rạp', cat.toUpperCase()],
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
            categoryTag: cat
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
// Periodic sync every 30 minutes
setInterval(syncFromWebSource, 30 * 60 * 1000);

// API Endpoints
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