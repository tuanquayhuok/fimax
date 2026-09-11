import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Text, TouchableOpacity, AppState } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { ApiService, subscribeMovieUpdates, subscribeBannerUpdates } from '../services/apiService';
import { MOCK_MOVIES } from '../data/mockMovies';
import { HeaderBar } from '../components/HeaderBar';
import { HeroBanner } from '../components/HeroBanner';
import { MovieRow } from '../components/MovieRow';
import { MovieCard } from '../components/MovieCard';
import { QuickPreviewModal } from '../components/QuickPreviewModal';
import { TrailerModal } from '../components/TrailerModal';
import { NetflixGenreModal } from '../components/NetflixGenreModal';

export const HomeScreen = ({ navigation }) => {
  const { themeMode, accentColor, t } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  const [selectedCategory, setSelectedCategory] = useState('Tất Cả');
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [previewMovie, setPreviewMovie] = useState(null);
  const [trailerMovie, setTrailerMovie] = useState(null);
  const [webAdminBanners, setWebAdminBanners] = useState(() => MOCK_MOVIES.slice(0, 3));

  // Initialize with MOCK_MOVIES immediately for 0ms instant content
  const [moviesBySection, setMoviesBySection] = useState(() => {
    const allList = MOCK_MOVIES;
    return {
      all: allList,
      trending: allList.slice(0, 6),
      cinema: allList.filter(m => m.categoryTag === 'cinema' || m.categoryTag === 'latest' || m.genres?.some(g => g.toLowerCase().includes('chiếu rạp'))),
      animation: allList.filter(m => m.categoryTag === 'animation' || m.genres?.some(g => g.toLowerCase().includes('hoạt hình') || g.toLowerCase().includes('anime')) || m.title?.toLowerCase().includes('suzume')),
      korean: allList.filter(m => m.country === 'Hàn Quốc' || m.categoryTag === 'korean'),
      hollywood: allList.filter(m => m.country === 'Mỹ' || m.country === 'Âu Mỹ' || m.categoryTag === 'hollywood')
    };
  });

  const updateSectionState = (allList) => {
    if (!allList || allList.length === 0) return;
    const cinemaList = allList.filter(m => m.categoryTag === 'cinema' || m.categoryTag === 'latest' || (m.genres && m.genres.some(g => g.toLowerCase().includes('chiếu rạp'))));
    const animationList = allList.filter(m =>
      m.categoryTag === 'animation' ||
      (m.genres && m.genres.some(g => g.toLowerCase().includes('hoạt hình') || g.toLowerCase().includes('anime'))) ||
      (m.title && (m.title.toLowerCase().includes('na tra') || m.title.toLowerCase().includes('suzume') || m.title.toLowerCase().includes('doraemon') || m.title.toLowerCase().includes('mèo đi hia') || m.title.toLowerCase().includes('minion') || m.title.toLowerCase().includes('con ké') || m.title.toLowerCase().includes('spider-verse')))
    );
    const koreanList = allList.filter(m => m.country === 'Hàn Quốc' || m.categoryTag === 'korean');
    const hollywoodList = allList.filter(m => m.country === 'Mỹ' || m.country === 'Âu Mỹ' || (m.country !== 'Việt Nam' && m.country !== 'Hàn Quốc'));

    setMoviesBySection({
      all: allList,
      trending: allList.slice(0, 10),
      cinema: cinemaList.length > 0 ? cinemaList : allList.slice(0, 8),
      animation: animationList.length > 0 ? animationList : allList.filter(m => m.genres?.includes('Hoạt hình')),
      korean: koreanList.length > 0 ? koreanList : allList.filter(m => m.country === 'Hàn Quốc'),
      hollywood: hollywoodList.length > 0 ? hollywoodList : allList.slice(4, 10)
    });
  };

  const loadData = async (forceRefresh = false) => {
    try {
      const [all, banners] = await Promise.all([
        ApiService.getAllMovies(undefined, forceRefresh),
        ApiService.getFeaturedBanners(forceRefresh)
      ]);
      if (all && all.length > 0) {
        updateSectionState(all);
      }
      if (banners && banners.length > 0) {
        setWebAdminBanners(banners);
      }
    } catch (e) {
      console.warn('API loadData error:', e.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(false);

    // 1. Subscribe to Real-Time Web Movie updates
    const unsubscribeMovies = subscribeMovieUpdates((updatedList) => {
      if (updatedList && updatedList.length > 0) {
        updateSectionState(updatedList);
      }
    });

    // 2. Subscribe to Exact Web Admin Banners updates
    const unsubscribeBanners = subscribeBannerUpdates((updatedBanners) => {
      if (updatedBanners && updatedBanners.length > 0) {
        setWebAdminBanners(updatedBanners);
      }
    });

    // 3. 10s Silent Background Poller
    const interval = setInterval(() => {
      ApiService.getAllMovies(undefined, true);
    }, 15000);

    // 4. Auto-sync on App Focus
    const appStateSub = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        ApiService.getAllMovies(undefined, true);
      }
    });

    return () => {
      unsubscribeMovies();
      unsubscribeBanners();
      clearInterval(interval);
      appStateSub.remove();
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData(true);
  };

  const handleLongPressMovie = (movie) => {
    setPreviewMovie(movie);
  };

  // Filter movies when a specific category is selected
  const getFilteredCategoryMovies = () => {
    if (selectedCategory === 'Tất Cả' || selectedCategory === 'Tất cả thể loại') return moviesBySection.all;
    if (selectedCategory.includes('Chiếu Rạp')) return moviesBySection.cinema;
    if (selectedCategory.includes('Hoạt Hình') || selectedCategory.includes('Anime')) return moviesBySection.animation;
    if (selectedCategory.includes('Hàn Quốc')) return moviesBySection.korean;
    if (selectedCategory.includes('Việt Nam')) return moviesBySection.all.filter(m => m.country === 'Việt Nam' || m.categoryTag === 'vietnam');
    if (selectedCategory.includes('Hollywood') || selectedCategory.includes('Âu Mỹ')) return moviesBySection.hollywood;

    const keyword = selectedCategory.split(' ')[0].toLowerCase();
    return moviesBySection.all.filter(m =>
      Array.isArray(m.genres) && m.genres.some(g => g.toLowerCase().includes(keyword))
    );
  };

  const filteredMovies = getFilteredCategoryMovies();

  const heroMovies = (selectedCategory === 'Tất Cả' && webAdminBanners.length > 0)
    ? webAdminBanners
    : (filteredMovies && filteredMovies.length > 0 ? filteredMovies.slice(0, 5) : webAdminBanners);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header Bar */}
      <HeaderBar navigation={navigation} />

      {/* Iconic Netflix-Style Sub-Navigation Bar */}
      <View style={styles.netflixNavBar}>
        {selectedCategory === 'Tất Cả' ? (
          <View style={styles.navLinksRow}>
            <TouchableOpacity
              style={styles.navLinkBtn}
              activeOpacity={0.7}
              onPress={() => setSelectedCategory('Phim Chiếu Rạp Mới Nhất')}
            >
              <Text style={styles.navLinkText}>{t('cinema_movies') || 'Phim Chiếu Rạp'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navLinkBtn}
              activeOpacity={0.7}
              onPress={() => setSelectedCategory('Phim Hoạt Hình Mới Nhất')}
            >
              <Text style={styles.navLinkText}>{t('animation_movies') || 'Phim Hoạt Hình'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navLinkBtn}
              activeOpacity={0.7}
              onPress={() => setSelectedCategory('Phim Hàn Quốc')}
            >
              <Text style={styles.navLinkText}>{t('korean_movies') || 'Phim Hàn Quốc'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.genreDropdownBtn}
              activeOpacity={0.7}
              onPress={() => setShowGenreModal(true)}
            >
              <Text style={styles.genreDropdownText}>{t('categories') || 'Thể loại'}</Text>
              <Ionicons name="chevron-down" size={14} color="#FFFFFF" style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>
        ) : (
          /* Active Filter Pill with Dismiss Button */
          <View style={styles.activeFilterRow}>
            <TouchableOpacity
              style={styles.activeCategoryPill}
              activeOpacity={0.8}
              onPress={() => setShowGenreModal(true)}
            >
              <Text style={styles.activeCategoryText}>{selectedCategory}</Text>
              <Ionicons name="chevron-down" size={13} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearFilterBtn}
              activeOpacity={0.7}
              onPress={() => setSelectedCategory('Tất Cả')}
            >
              <Ionicons name="close-circle" size={18} color="#8E8E93" />
              <Text style={styles.clearFilterText}>Tất cả</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E50914" />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Multi-Hero Banner Carousel */}
        {heroMovies.length > 0 && (
          <HeroBanner
            movies={heroMovies}
            navigation={navigation}
            onInfoPress={(m) => setPreviewMovie(m)}
          />
        )}

        {/* View mode 1: "Tất Cả" displays rich categorized rows (ALL UNLOCKED) */}
        {selectedCategory === 'Tất Cả' ? (
          <>
            {moviesBySection.trending.length > 0 && (
              <MovieRow
                title={t('trending_now') || 'Đang thịnh hành'}
                movies={moviesBySection.trending}
                navigation={navigation}
                onLongPressMovie={handleLongPressMovie}
                isComingSoon={false}
              />
            )}
            {moviesBySection.cinema.length > 0 && (
              <MovieRow
                title={t('cinema_movies') || 'Phim Chiếu Rạp Mới Nhất'}
                movies={moviesBySection.cinema}
                navigation={navigation}
                onLongPressMovie={handleLongPressMovie}
                isComingSoon={false}
              />
            )}
            {moviesBySection.animation.length > 0 && (
              <MovieRow
                title={t('latest_animation') || 'Phim Hoạt Hình Mới Nhất'}
                movies={moviesBySection.animation}
                navigation={navigation}
                onLongPressMovie={handleLongPressMovie}
                isComingSoon={false}
              />
            )}
            {moviesBySection.korean.length > 0 && (
              <MovieRow
                title={t('korean_movies') || 'Phim Hàn Quốc'}
                movies={moviesBySection.korean}
                navigation={navigation}
                onLongPressMovie={handleLongPressMovie}
                isComingSoon={false}
              />
            )}
            {moviesBySection.hollywood.length > 0 && (
              <MovieRow
                title={t('action_packed') || 'Hành Động & Bom Tấn'}
                movies={moviesBySection.hollywood}
                navigation={navigation}
                onLongPressMovie={handleLongPressMovie}
                isComingSoon={false}
              />
            )}
          </>
        ) : (
          /* View mode 2: Specific Category Grid */
          <View style={styles.filteredSection}>
            <View style={styles.filteredHeaderRow}>
              <Text style={[styles.filteredTitle, { color: theme.textPrimary }]}>
                {selectedCategory}
              </Text>
              <Text style={[styles.filteredCount, { color: theme.textSecondary }]}>
                {filteredMovies.length} bộ phim
              </Text>
            </View>

            <View style={styles.gridContainer}>
              {filteredMovies.map((item) => (
                <MovieCard
                  key={item.id}
                  movie={item}
                  navigation={navigation}
                  onLongPress={handleLongPressMovie}
                />
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Netflix Fullscreen Genre Selector Modal */}
      <NetflixGenreModal
        visible={showGenreModal}
        selectedGenre={selectedCategory}
        onSelectGenre={(genre) => setSelectedCategory(genre)}
        onClose={() => setShowGenreModal(false)}
      />

      {/* 3D Touch Quick Preview Modal */}
      <QuickPreviewModal
        visible={!!previewMovie}
        movie={previewMovie}
        onClose={() => setPreviewMovie(null)}
        navigation={navigation}
        onOpenTrailer={(m) => setTrailerMovie(m)}
      />

      {/* Trailer Modal */}
      {trailerMovie && (
        <TrailerModal
          visible={!!trailerMovie}
          movie={trailerMovie}
          trailerUrl={trailerMovie.trailerUrl}
          accentColor={accentColor}
          onClose={() => setTrailerMovie(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  netflixNavBar: {
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  navLinksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  navLinkBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  navLinkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2
  },
  genreDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  genreDropdownText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },
  activeFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4
  },
  activeCategoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)'
  },
  activeCategoryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  clearFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4
  },
  clearFilterText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600'
  },
  scrollContent: {
    paddingBottom: 20
  },
  filteredSection: {
    paddingHorizontal: 16,
    paddingTop: 16
  },
  filteredHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  filteredTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  filteredCount: {
    fontSize: 12
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between'
  }
});
