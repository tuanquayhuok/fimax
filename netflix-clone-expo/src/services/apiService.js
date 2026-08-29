import { MOCK_MOVIES } from '../data/mockMovies';

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

    const heroBanner = MOCK_MOVIES.find(m => m.isFeatured) || MOCK_MOVIES[0];
    const newReleases = MOCK_MOVIES.filter(m => m.isNew);
    const hotMovies = MOCK_MOVIES.filter(m => m.isHot);
    const mostViewed = [...MOCK_MOVIES].sort((a, b) => b.viewCount - a.viewCount);
    const topRated = [...MOCK_MOVIES].sort((a, b) => b.rating - a.rating);
    const upcoming = MOCK_MOVIES.filter(m => m.isUpcoming);

    return {
      heroBanner,
      sections: [
        { id: 'sec_hot', title: 'Phim Đang Hot 🔥', items: hotMovies },
        { id: 'sec_new', title: 'Phim Mới Cập Nhật 🎬', items: newReleases },
        { id: 'sec_top', title: 'Đánh Giá Cao ⭐', items: topRated },
        { id: 'sec_views', title: 'Phim Được Xem Nhiều', items: mostViewed },
        { id: 'sec_upcoming', title: 'Phim Sắp Ra Mắt ⏳', items: upcoming.length ? upcoming : MOCK_MOVIES.slice(0, 4) }
      ],
      genres: ['Hành động', 'Tâm lý', 'Gia đình', 'Khoa học viễn tưởng', 'Hoạt hình', 'Hồi hộp', 'Kỳ ảo', 'Hài hước'],
      countries: ['Việt Nam', 'Mỹ', 'Hàn Quốc', 'Nhật Bản', 'Trung Quốc', 'Thái Lan']
    };
  }

  static async getTrendingMovies() {
    return MOCK_MOVIES.filter(m => m.isHot || m.isFeatured);
  }

  static async getNewReleases() {
    return MOCK_MOVIES.filter(m => m.isNew);
  }

  static async getTopRatedMovies() {
    return [...MOCK_MOVIES].sort((a, b) => b.rating - a.rating);
  }

  static async getComingSoonMovies() {
    const upcoming = MOCK_MOVIES.filter(m => m.isUpcoming);
    return upcoming.length ? upcoming : MOCK_MOVIES.slice(0, 4);
  }

  static async getMoviesByCountry(country) {
    if (country === 'Việt Nam') {
      return MOCK_MOVIES.filter(m => m.country === 'Việt Nam');
    }
    return MOCK_MOVIES.filter(m => m.country !== 'Việt Nam');
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