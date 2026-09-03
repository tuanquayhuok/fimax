import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { ApiService } from '../services/apiService';
import { HeaderBar } from '../components/HeaderBar';
import { HeroBanner } from '../components/HeroBanner';
import { MovieRow } from '../components/MovieRow';
import { MovieCard } from '../components/MovieCard';
import { QuickPreviewModal } from '../components/QuickPreviewModal';
import { TrailerModal } from '../components/TrailerModal';
import { NetflixGenreModal } from '../components/NetflixGenreModal';

export const HomeScreen = ({ navigation }) => {
  const { themeMode, accentColor, fontSizeScale } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  const [selectedCategory, setSelectedCategory] = useState('Tất Cả');
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [previewMovie, setPreviewMovie] = useState(null);
  const [trailerMovie, setTrailerMovie] = useState(null);

  const [moviesBySection, setMoviesBySection] = useState({
    all: [],
    trending: [],
    newReleases: [],
    topRated: [],
    comingSoon: [],
    vietnam: [],
    hollywood: [],
    korean: []
  });

  const loadData = async (forceRefresh = false) => {
    try {
      const [all, trending, newReleases, topRated, comingSoon, vietnam, hollywood, korean] = await Promise.all([
        ApiService.getAllMovies(undefined, forceRefresh),
        ApiService.getTrendingMovies(),
        ApiService.getNewReleases(),
        ApiService.getTopRatedMovies(),
        ApiService.getComingSoonMovies(),
        ApiService.getMoviesByCountry('Việt Nam'),
        ApiService.getMoviesByCountry('Âu Mỹ'),
        ApiService.getMoviesByCountry('Hàn Quốc')
      ]);

      setMoviesBySection({
        all: all || [],
        trending: trending || [],
        newReleases: newReleases || [],
        topRated: topRated || [],
        comingSoon: comingSoon || [],
        vietnam: vietnam || [],
        hollywood: hollywood || [],
        korean: korean || []
      });
    } catch (e) {
      console.warn('API loadData error:', e.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(false);
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
    if (selectedCategory.includes('Việt Nam')) return moviesBySection.vietnam;
    if (selectedCategory.includes('Hollywood')) return moviesBySection.hollywood;
    if (selectedCategory.includes('Hàn Quốc')) return moviesBySection.korean;
    if (selectedCategory.includes('Chiếu Rạp')) return moviesBySection.topRated;

    const keyword = selectedCategory.split(' ')[0].toLowerCase();
    return moviesBySection.all.filter(m =>
      Array.isArray(m.genres) && m.genres.some(g => g.toLowerCase().includes(keyword))
    );
  };

  const filteredMovies = getFilteredCategoryMovies();

  // Dynamic Hero Banner selection based on category
  const heroMovies = (filteredMovies && filteredMovies.length > 0)
    ? filteredMovies.slice(0, 5)
    : (moviesBySection.trending && moviesBySection.trending.length > 0 ? moviesBySection.trending.slice(0, 5) : []);

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
              onPress={() => setSelectedCategory('Phim Chiếu Rạp Bom Tấn')}
            >
              <Text style={styles.navLinkText}>Phim Chiếu Rạp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navLinkBtn}
              activeOpacity={0.7}
              onPress={() => setSelectedCategory('Điện Ảnh Việt Nam')}
            >
              <Text style={styles.navLinkText}>Phim Việt Nam</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.genreDropdownBtn}
              activeOpacity={0.7}
              onPress={() => setShowGenreModal(true)}
            >
              <Text style={styles.genreDropdownText}>Thể loại</Text>
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
        {/* Multi-Hero Banner Carousel (16:9 Uncropped Cinema Ratio) */}
        {heroMovies.length > 0 && (
          <HeroBanner
            movies={heroMovies}
            navigation={navigation}
            onInfoPress={(m) => setPreviewMovie(m)}
          />
        )}

        {/* View mode 1: "Tất Cả" displays rich categorized rows */}
        {selectedCategory === 'Tất Cả' ? (
          <>
            {moviesBySection.trending.length > 0 && (
              <MovieRow
                title="Phim Đang Hot 🔥"
                movies={moviesBySection.trending}
                navigation={navigation}
                onLongPressMovie={handleLongPressMovie}
              />
            )}
            {moviesBySection.newReleases.length > 0 && (
              <MovieRow
                title="Phim Mới Cập Nhật 🎬"
                movies={moviesBySection.newReleases}
                navigation={navigation}
                onLongPressMovie={handleLongPressMovie}
              />
            )}
            {moviesBySection.topRated.length > 0 && (
              <MovieRow
                title="Đánh Giá Cao ⭐"
                movies={moviesBySection.topRated}
                navigation={navigation}
                onLongPressMovie={handleLongPressMovie}
              />
            )}
            {moviesBySection.vietnam.length > 0 && (
              <MovieRow
                title="Phim Điện Ảnh Việt Nam 🇻🇳"
                movies={moviesBySection.vietnam}
                navigation={navigation}
                onLongPressMovie={handleLongPressMovie}
              />
            )}
            {moviesBySection.korean.length > 0 && (
              <MovieRow
                title="Phim Hàn Quốc Đặc Sắc 🇰🇷"
                movies={moviesBySection.korean}
                navigation={navigation}
                onLongPressMovie={handleLongPressMovie}
              />
            )}
            {moviesBySection.hollywood.length > 0 && (
              <MovieRow
                title="Bom Tấn Hollywood 🍿"
                movies={moviesBySection.hollywood}
                navigation={navigation}
                onLongPressMovie={handleLongPressMovie}
              />
            )}
            {moviesBySection.comingSoon.length > 0 && (
              <MovieRow
                title="Sắp Ra Mắt ⏳"
                movies={moviesBySection.comingSoon}
                navigation={navigation}
                onLongPressMovie={handleLongPressMovie}
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
          trailerUrl={trailerMovie.trailerUrl}
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