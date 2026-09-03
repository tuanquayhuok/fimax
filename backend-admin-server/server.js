const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

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
          movies.push({
            id: 'web_' + m.id,
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
              '1080p': m.video_url,
              'auto': m.video_url
            },
            categoryTag: cat
          });
        }
      }
      if (movies.length > 0) {
        moviesDatabase = movies;
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
  res.json(moviesDatabase);
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