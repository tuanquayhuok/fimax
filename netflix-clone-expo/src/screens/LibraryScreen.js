import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { ApiService, subscribeMovieUpdates } from '../services/apiService';
import { MOCK_MOVIES } from '../data/mockMovies';
import { CinemaImage } from '../components/CinemaImage';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_WIDTH = (width - 48) / COLUMN_COUNT;
const POSTER_HEIGHT = Math.round(ITEM_WIDTH * 1.48);

export const LibraryScreen = ({ navigation }) => {
  const {
    favorites,
    toggleFavorite,
    watchHistory,
    continueWatching,
    setActiveMovieForPlayer,
    themeMode,
    accentColor,
    fontSizeScale,
    user
  } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  const [allMovies, setAllMovies] = useState(MOCK_MOVIES);
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' | 'continue' | 'history'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Tất cả');

  useEffect(() => {
    async function loadData() {
      const movies = await ApiService.getAllMovies();
      if (movies && movies.length > 0) {
        setAllMovies(movies);
      }
    }
    loadData();

    const unsub = subscribeMovieUpdates((updated) => {
      if (updated && updated.length > 0) {
        setAllMovies(updated);
      }
    });
    return () => unsub();
  }, []);

  // Compute Favorites
  const favoriteMovies = allMovies.filter(m => favorites.includes(m.id));

  // Compute Continue Watching
  const continueWatchingMovies = continueWatching.map(item => {
    const movie = allMovies.find(m => m.id === item.movieId);
    return movie ? { ...movie, progress: item.percentage || 45, currentTime: item.currentTime } : null;
  }).filter(Boolean);

  // Compute History
  const historyMovies = watchHistory.map(item => {
    const movie = allMovies.find(m => m.id === item.movieId);
    return movie ? { ...movie, watchedAt: item.updatedAt } : null;
  }).filter(Boolean);

  // Active tab dataset
  let currentList = [];
  if (activeTab === 'favorites') currentList = favoriteMovies;
  else if (activeTab === 'continue') currentList = continueWatchingMovies;
  else currentList = historyMovies;

  // Filter by search & genre
  const filteredList = currentList.filter(m => {
    const matchesSearch = !searchQuery.trim() ||
      m.title?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      m.originalTitle?.toLowerCase().includes(searchQuery.toLowerCase().trim());

    const matchesGenre = selectedGenre === 'Tất cả' ||
      (Array.isArray(m.genres) && m.genres.some(g => g.includes(selectedGenre))) ||
      m.country === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  const handlePlayMovie = (movie) => {
    setActiveMovieForPlayer(movie);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Xóa lịch sử xem',
      'Bạn có chắc chắn muốn xóa toàn bộ lịch sử xem phim trên thiết bị này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa sạch', style: 'destructive', onPress: () => Alert.alert('Đã xóa', 'Lịch sử xem đã được làm sạch.') }
      ]
    );
  };

  const renderMovieItem = ({ item: movie }) => {
    const posterUri = movie.posterUrl || movie.poster || movie.backdropUrl || movie.backdrop;
    const bgUri = movie.backdropUrl || movie.backdrop || movie.posterUrl;

    return (
      <TouchableOpacity
        style={styles.movieCard}
        activeOpacity={0.82}
        onPress={() => navigation.navigate('Detail', { movie })}
      >
        <View style={[styles.posterWrap, { borderColor: theme.border }]}>
          <CinemaImage
            uri={posterUri}
            fallbackUri={bgUri}
            style={styles.posterImg}
            resizeMode="cover"
          />

          {/* Progress bar on Continue Watching */}
          {activeTab === 'continue' && movie.progress && (
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${movie.progress}%`, backgroundColor: accentColor }]} />
            </View>
          )}

          {/* Quality Pill */}
          <View style={[styles.qualityPill, { borderColor: accentColor }]}>
            <Text style={styles.qualityText}>4K</Text>
          </View>

          {/* Quick Play Floating Button */}
          <TouchableOpacity
            style={[styles.quickPlayBtn, { backgroundColor: accentColor }]}
            activeOpacity={0.85}
            onPress={() => handlePlayMovie(movie)}
          >
            <Ionicons name="play" size={12} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.movieTitle, { color: theme.textPrimary }]} numberOfLines={1}>
          {movie.title}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.ratingText}>⭐ {movie.rating || '8.5'}</Text>
          <Text style={[styles.metaDot, { color: theme.textMuted }]}>•</Text>
          <Text style={[styles.metaYear, { color: theme.textMuted }]}>{movie.releaseYear || movie.year || '2024'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.screenTitle, { color: theme.textPrimary, fontSize: 26 * fontSizeScale }]}>
            Thư Viện Của Tôi
          </Text>
          <Text style={[styles.screenSubtitle, { color: theme.textMuted }]}>
            {user ? user.name : 'Khách FIMAX'} • {favoriteMovies.length} phim yêu thích
          </Text>
        </View>

        {activeTab === 'history' && historyMovies.length > 0 && (
          <TouchableOpacity style={[styles.clearBtn, { backgroundColor: theme.surfaceSecondary }]} onPress={handleClearHistory}>
            <Ionicons name="trash-outline" size={16} color="#FF3B30" />
            <Text style={styles.clearBtnText}>Xóa</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modern Tabs Navigation */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabPill,
            activeTab === 'favorites' && [styles.tabPillActive, { backgroundColor: `${accentColor}1A`, borderColor: accentColor }]
          ]}
          activeOpacity={0.8}
          onPress={() => setActiveTab('favorites')}
        >
          <Ionicons
            name={activeTab === 'favorites' ? 'heart' : 'heart-outline'}
            size={15}
            color={activeTab === 'favorites' ? accentColor : theme.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'favorites' ? accentColor : theme.textSecondary, fontWeight: activeTab === 'favorites' ? '700' : '500' }
            ]}
          >
            Yêu Thích ({favoriteMovies.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabPill,
            activeTab === 'continue' && [styles.tabPillActive, { backgroundColor: `${accentColor}1A`, borderColor: accentColor }]
          ]}
          activeOpacity={0.8}
          onPress={() => setActiveTab('continue')}
        >
          <Ionicons
            name={activeTab === 'continue' ? 'play-circle' : 'play-circle-outline'}
            size={15}
            color={activeTab === 'continue' ? accentColor : theme.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'continue' ? accentColor : theme.textSecondary, fontWeight: activeTab === 'continue' ? '700' : '500' }
            ]}
          >
            Đang Xem ({continueWatchingMovies.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabPill,
            activeTab === 'history' && [styles.tabPillActive, { backgroundColor: `${accentColor}1A`, borderColor: accentColor }]
          ]}
          activeOpacity={0.8}
          onPress={() => setActiveTab('history')}
        >
          <Ionicons
            name={activeTab === 'history' ? 'time' : 'time-outline'}
            size={15}
            color={activeTab === 'history' ? accentColor : theme.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'history' ? accentColor : theme.textSecondary, fontWeight: activeTab === 'history' ? '700' : '500' }
            ]}
          >
            Đã Xem ({historyMovies.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search & Filter Bar */}
      {currentList.length > 3 && (
        <View style={styles.searchWrap}>
          <View style={[styles.searchBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Ionicons name="search" size={15} color={theme.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: theme.textPrimary }]}
              placeholder="Tìm phim trong thư viện..."
              placeholderTextColor={theme.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Content Grid / Empty State */}
      {filteredList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: theme.surfaceSecondary }]}>
            <Ionicons
              name={activeTab === 'favorites' ? 'heart-dislike-outline' : (activeTab === 'continue' ? 'play-skip-forward-outline' : 'film-outline')}
              size={40}
              color={theme.textMuted}
            />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
            {searchQuery ? 'Không tìm thấy phim phù hợp' : (activeTab === 'favorites' ? 'Danh sách yêu thích trống' : 'Chưa có lịch sử xem phim')}
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            {searchQuery
              ? 'Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.'
              : 'Hãy khám phá các siêu phẩm điện ảnh 4K chiếu rạp và thêm vào bộ sưu tập của bạn!'}
          </Text>

          <TouchableOpacity
            style={[styles.exploreBtn, { backgroundColor: accentColor }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('HomeTab')}
          >
            <Ionicons name="compass-outline" size={18} color="#FFFFFF" />
            <Text style={styles.exploreBtnText}>Khám Phá Phim Ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredList}
          numColumns={COLUMN_COUNT}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.gridList}
          showsVerticalScrollIndicator={false}
          renderItem={renderMovieItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 14
  },
  screenTitle: {
    fontWeight: '900',
    letterSpacing: -0.5
  },
  screenSubtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500'
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  clearBtnText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '600'
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12
  },
  tabPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  },
  tabPillActive: {
    borderWidth: 1
  },
  tabText: {
    fontSize: 11.5
  },
  searchWrap: {
    paddingHorizontal: 16,
    marginBottom: 12
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    gap: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    height: '100%'
  },
  gridList: {
    paddingHorizontal: 12,
    paddingBottom: 40
  },
  movieCard: {
    width: ITEM_WIDTH,
    marginHorizontal: 4,
    marginBottom: 16
  },
  posterWrap: {
    width: '100%',
    height: POSTER_HEIGHT,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1C1C22',
    borderWidth: 1
  },
  posterImg: {
    width: '100%',
    height: '100%'
  },
  progressBarBg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2
  },
  qualityPill: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.8
  },
  qualityText: {
    color: '#D4AF37',
    fontSize: 8.5,
    fontWeight: '900'
  },
  quickPlayBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3
  },
  movieTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2
  },
  ratingText: {
    color: '#D4AF37',
    fontSize: 10,
    fontWeight: '700'
  },
  metaDot: {
    fontSize: 8
  },
  metaYear: {
    fontSize: 10,
    fontWeight: '500'
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingBottom: 60
  },
  emptyIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6
  },
  emptySubtitle: {
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  }
});
