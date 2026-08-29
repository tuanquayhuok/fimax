import os

backend_dir = r"C:\Users\ADMIN\.gemini\antigravity\scratch\netflix-cinema-project\backend-admin-server\public"
os.makedirs(backend_dir, exist_ok=True)

html_code = """<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Portal - Quản Trị Hệ Thống Phim & Callback Webhook</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <style>
    :root {
      --netflix-red: #E50914;
      --dark-bg: #141414;
      --card-bg: #1f1f1f;
      --border-color: #333333;
    }
    body { background-color: var(--dark-bg); color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .navbar { background-color: #000000; border-bottom: 2px solid var(--netflix-red); }
    .card { background-color: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; }
    .table-dark { background-color: var(--card-bg); color: #eee; }
    .nav-tabs .nav-link { color: #aaa; border: none; border-bottom: 3px solid transparent; font-weight: 600; }
    .nav-tabs .nav-link.active { color: #fff; background-color: transparent; border-bottom: 3px solid var(--netflix-red); }
    .pulse { animation: pulse 1.5s infinite; }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
  </style>
</head>
<body class="p-0">
  <nav class="navbar navbar-dark px-4 py-3 sticky-top">
    <div class="container-fluid">
      <a class="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2" href="#">
        <span class="text-danger fs-3">🎬</span> CINEMA ADMIN & CALLBACK PORTAL
      </a>
      <div class="d-flex align-items-center gap-3">
        <span class="badge bg-success d-flex align-items-center gap-1 py-2 px-3">
          <span class="pulse text-white">●</span> Server Online (:4000)
        </span>
        <button class="btn btn-outline-light btn-sm" onclick="fetchData()"><i class="bi bi-arrow-clockwise"></i> Làm mới</button>
      </div>
    </div>
  </nav>

  <div class="container-fluid px-4 py-4">
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card p-3">
          <div class="text-secondary small">TỔNG SỐ PHIM</div>
          <div class="fs-2 fw-bold text-white" id="statTotalMovies">0</div>
          <div class="text-success small"><i class="bi bi-film"></i> 100% Single-Video Cinema</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card p-3">
          <div class="text-secondary small">CALLBACK WEBHOOK ĐÃ NHẬN</div>
          <div class="fs-2 fw-bold text-warning" id="statCallbacks">0</div>
          <div class="text-secondary small">Tiến độ xem & hành vi user</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card p-3">
          <div class="text-secondary small">API BASE URL</div>
          <div class="fs-6 fw-bold text-info text-truncate" id="statApiUrl">http://localhost:4000/api</div>
          <button class="btn btn-sm btn-outline-info mt-1 py-0" onclick="copyApiUrl()">Copy URL cho App</button>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card p-3">
          <div class="text-secondary small">CALLBACK WEBHOOK ENDPOINT</div>
          <div class="fs-6 fw-bold text-danger text-truncate" id="statCallbackUrl">http://localhost:4000/api/callback/progress</div>
          <button class="btn btn-sm btn-outline-danger mt-1 py-0" onclick="copyCallbackUrl()">Copy Callback URL</button>
        </div>
      </div>
    </div>

    <ul class="nav nav-tabs mb-4" id="adminTabs" role="tablist">
      <li class="nav-item">
        <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tabMovies"><i class="bi bi-film"></i> Quản Lý Danh Sách Phim</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabCallbacks"><i class="bi bi-broadcast"></i> Live Callback Webhook Logs <span class="badge bg-danger rounded-pill" id="badgeLogCount">0</span></button>
      </li>
      <li class="nav-item">
        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tabAddMovie"><i class="bi bi-plus-circle"></i> + Thêm Phim Mới (360p/720p/1080p)</button>
      </li>
    </ul>

    <div class="tab-content">
      <!-- 1. Movies Tab -->
      <div class="tab-pane fade show active" id="tabMovies">
        <div class="card p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0">Danh sách phim hiện tại trong hệ thống</h5>
            <div class="text-secondary small">Hỗ trợ đầy đủ luồng 360p, 720p, 1080p, audio, phụ đề</div>
          </div>
          <div class="table-responsive">
            <table class="table table-dark table-hover align-middle">
              <thead>
                <tr>
                  <th style="width: 80px">Poster</th>
                  <th>Tên phim</th>
                  <th>Năm / Điểm</th>
                  <th>Thể loại / Quốc gia</th>
                  <th>Đạo diễn / Diễn viên</th>
                  <th>Chất lượng</th>
                  <th style="width: 120px">Thao tác</th>
                </tr>
              </thead>
              <tbody id="movieTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 2. Callbacks Tab -->
      <div class="tab-pane fade" id="tabCallbacks">
        <div class="card p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 class="fw-bold mb-0 text-warning"><i class="bi bi-activity"></i> Sự kiện Realtime từ iOS / Expo App</h5>
              <div class="text-secondary small">Mỗi khi người dùng xem phim, tua hoặc dừng, app tự động bắn webhook về đây</div>
            </div>
            <button class="btn btn-outline-danger btn-sm" onclick="clearCallbacks()"><i class="bi bi-trash"></i> Xóa Logs</button>
          </div>
          <div class="table-responsive">
            <table class="table table-dark table-striped align-middle">
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Tên Phim</th>
                  <th>User ID</th>
                  <th>Tiến độ đã xem</th>
                  <th>Chất lượng</th>
                  <th>Trạng thái</th>
                  <th>Raw Payload</th>
                </tr>
              </thead>
              <tbody id="callbackTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 3. Add Movie Tab -->
      <div class="tab-pane fade" id="tabAddMovie">
        <div class="card p-4">
          <h5 class="fw-bold mb-3 text-danger"><i class="bi bi-plus-square"></i> Thêm phim điện ảnh mới</h5>
          <form id="addMovieForm" onsubmit="submitNewMovie(event)">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Tên phim (Tiếng Việt) *</label>
                <input type="text" id="m_title" class="form-control bg-dark text-white border-secondary" required placeholder="Ví dụ: Đất Rừng Phương Nam">
              </div>
              <div class="col-md-6">
                <label class="form-label">Tên gốc / Tên tiếng Anh</label>
                <input type="text" id="m_originalTitle" class="form-control bg-dark text-white border-secondary" placeholder="Ví dụ: Song of the South">
              </div>
              <div class="col-md-3">
                <label class="form-label">Điểm đánh giá (⭐)</label>
                <input type="number" step="0.1" id="m_rating" class="form-control bg-dark text-white border-secondary" value="8.5">
              </div>
              <div class="col-md-3">
                <label class="form-label">Năm phát hành</label>
                <input type="number" id="m_year" class="form-control bg-dark text-white border-secondary" value="2026">
              </div>
              <div class="col-md-3">
                <label class="form-label">Thời lượng (ví dụ 2h 15m)</label>
                <input type="text" id="m_duration" class="form-control bg-dark text-white border-secondary" value="2h 15m">
              </div>
              <div class="col-md-3">
                <label class="form-label">Quốc gia</label>
                <select id="m_country" class="form-select bg-dark text-white border-secondary">
                  <option value="Việt Nam">Việt Nam</option>
                  <option value="Mỹ">Mỹ</option>
                  <option value="Hàn Quốc">Hàn Quốc</option>
                  <option value="Nhật Bản">Nhật Bản</option>
                  <option value="Trung Quốc">Trung Quốc</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Ảnh Poster URL (Dọc) *</label>
                <input type="url" id="m_poster" class="form-control bg-dark text-white border-secondary" required value="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600">
              </div>
              <div class="col-md-6">
                <label class="form-label">Ảnh Backdrop URL (Ngang)</label>
                <input type="url" id="m_backdrop" class="form-control bg-dark text-white border-secondary" value="https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1200">
              </div>
              <div class="col-md-12">
                <label class="form-label">Link Stream 1080p (m3u8 hoặc mp4) *</label>
                <input type="url" id="m_v1080" class="form-control bg-dark text-white border-secondary" required value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4">
              </div>
              <div class="col-md-6">
                <label class="form-label">Link Stream 720p</label>
                <input type="url" id="m_v720" class="form-control bg-dark text-white border-secondary" value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4">
              </div>
              <div class="col-md-6">
                <label class="form-label">Link Stream 360p</label>
                <input type="url" id="m_v360" class="form-control bg-dark text-white border-secondary" value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4">
              </div>
              <div class="col-md-12">
                <label class="form-label">Tóm tắt nội dung phim</label>
                <textarea id="m_overview" class="form-control bg-dark text-white border-secondary" rows="3" placeholder="Nội dung kịch bản..."></textarea>
              </div>
              <div class="col-12 mt-3">
                <button type="submit" class="btn btn-danger px-4 fw-bold"><i class="bi bi-check-circle"></i> Lưu Phim Vào Hệ Thống</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    let movies = [];
    let callbacks = [];

    async function fetchData() {
      try {
        const resM = await fetch('/api/admin/movies');
        const dataM = await resM.json();
        movies = dataM.data || [];
        renderMovies();

        const resC = await fetch('/api/admin/callbacks');
        const dataC = await resC.json();
        callbacks = dataC.logs || [];
        renderCallbacks();

        document.getElementById('statTotalMovies').innerText = movies.length;
        document.getElementById('statCallbacks').innerText = callbacks.length;
        document.getElementById('badgeLogCount').innerText = callbacks.length;
      } catch (err) {
        console.error('Fetch error:', err);
      }
    }

    function renderMovies() {
      const tbody = document.getElementById('movieTableBody');
      tbody.innerHTML = movies.map(m => `
        <tr>
          <td><img src="${m.posterUrl}" style="width: 50px; height: 75px; object-fit: cover; border-radius: 6px;" /></td>
          <td>
            <div class="fw-bold text-white">${m.title}</div>
            <div class="text-secondary small">${m.originalTitle || ''}</div>
          </td>
          <td>
            <span class="badge bg-warning text-dark"><i class="bi bi-star-fill"></i> ${m.rating}</span>
            <span class="badge bg-secondary ms-1">${m.releaseYear}</span>
          </td>
          <td>
            <div>${m.genres ? m.genres.join(', ') : 'Điện ảnh'}</div>
            <span class="badge bg-dark border border-secondary text-info">${m.country}</span>
          </td>
          <td>
            <div class="small text-white">ĐD: ${m.director || 'Chưa rõ'}</div>
          </td>
          <td>
            <span class="badge bg-success">1080p</span>
            <span class="badge bg-info">720p</span>
            <span class="badge bg-secondary">360p</span>
          </td>
          <td>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteMovie('${m.id}')"><i class="bi bi-trash"></i> Xóa</button>
          </td>
        </tr>
      `).join('');
    }

    function renderCallbacks() {
      const tbody = document.getElementById('callbackTableBody');
      if (callbacks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-secondary py-4">Chưa có sự kiện callback nào. Hãy mở App và bấm xem phim để thấy log realtime!</td></tr>';
        return;
      }
      tbody.innerHTML = callbacks.map(c => `
        <tr>
          <td class="text-secondary small">${new Date(c.receivedAt).toLocaleTimeString()}</td>
          <td class="fw-bold text-danger">${c.movieTitle}</td>
          <td><span class="badge bg-dark border border-secondary">${c.userId}</span></td>
          <td>
            <div class="progress" style="height: 18px; width: 140px; background-color: #333;">
              <div class="progress-bar bg-danger" style="width: ${c.percentage}%">${c.percentage}%</div>
            </div>
            <div class="small text-secondary mt-1">${Math.round(c.currentTime)}s / ${Math.round(c.duration)}s</div>
          </td>
          <td><span class="badge bg-info text-dark">${c.quality}</span></td>
          <td>${c.isCompleted ? '<span class="badge bg-success">Hoàn thành</span>' : '<span class="badge bg-warning text-dark">Đang xem</span>'}</td>
          <td>
            <button class="btn btn-sm btn-outline-light py-0" onclick="alert(JSON.stringify(${JSON.stringify(c)}, null, 2))">Xem JSON</button>
          </td>
        </tr>
      `).join('');
    }

    async function deleteMovie(id) {
      if (!confirm('Bạn có chắc muốn xóa phim này?')) return;
      await fetch('/api/admin/movies/' + id, { method: 'DELETE' });
      fetchData();
    }

    async function clearCallbacks() {
      await fetch('/api/admin/callbacks', { method: 'DELETE' });
      fetchData();
    }

    async function submitNewMovie(e) {
      e.preventDefault();
      const body = {
        title: document.getElementById('m_title').value,
        originalTitle: document.getElementById('m_originalTitle').value,
        rating: parseFloat(document.getElementById('m_rating').value),
        releaseYear: parseInt(document.getElementById('m_year').value),
        duration: document.getElementById('m_duration').value,
        country: document.getElementById('m_country').value,
        posterUrl: document.getElementById('m_poster').value,
        backdropUrl: document.getElementById('m_backdrop').value,
        overview: document.getElementById('m_overview').value,
        genres: ['Hành động', 'Tâm lý'],
        director: 'Đạo diễn',
        cast: [{ name: 'Diễn viên chính', role: 'Main' }],
        videoSources: {
          '1080p': document.getElementById('m_v1080').value,
          '720p': document.getElementById('m_v720').value,
          '360p': document.getElementById('m_v360').value,
          'auto': document.getElementById('m_v1080').value
        },
        subtitles: [{ language: 'Tiếng Việt', code: 'vi', label: 'Tiếng Việt' }],
        audioTracks: [{ language: 'Gốc', code: 'orig', label: 'Âm thanh gốc' }]
      };
      await fetch('/api/admin/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      alert('Đã thêm phim thành công!');
      document.getElementById('addMovieForm').reset();
      const tab = new bootstrap.Tab(document.querySelector('#adminTabs button[data-bs-target="#tabMovies"]'));
      tab.show();
      fetchData();
    }

    function copyApiUrl() {
      navigator.clipboard.writeText(window.location.origin + '/api');
      alert('Đã copy API URL: ' + window.location.origin + '/api');
    }

    function copyCallbackUrl() {
      navigator.clipboard.writeText(window.location.origin + '/api/callback/progress');
      alert('Đã copy Callback URL: ' + window.location.origin + '/api/callback/progress');
    }

    fetchData();
    setInterval(fetchData, 3000);
  </script>
</body>
</html>
"""

with open(os.path.join(backend_dir, "index.html"), "w", encoding="utf-8") as f:
    f.write(html_code)
print("Created public/index.html")