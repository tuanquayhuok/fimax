import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Text, TouchableOpacity, FlatList } from 'react-native';
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

const CATEGORIES = [
  'Tất Cả',
  'Phim Chiếu Rạp 🎬',
  'Điện Ảnh Việt Nam 🇻🇳',
  'Bom Tấn Hollywood 🍿',
  'Phim Hàn Quốc 🇰🇷',
  'Hành Động 🔥',
  'Tâm Lý & Tình Cảm 🎭',
  'Kinh Dị & Giật Gân 👻',
  'Hoạt Hình 🦄'
];

export const HomeScreen = ({ navigation }) => {
  const { themeMode, accentColor } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  const [selectedCategory, setSelectedCategory] = useState('Tất Cả');
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

  // Filter movies when a specific category pill is selected
  const getFilteredCategoryMovies = () => {
    if (selectedCategory === 'Tất Cả') return moviesBySection.all;
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

      {/* Interactive Category Selector Bar (Thanh Danh Mục Trượt Ngang) */}
      <View style={[styles.categoryBarWrapper, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isSelected ? accentColor : theme.surface,
                    borderColor: isSelected ? accentColor : theme.border
                  }
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    {
                      color: isSelected ? '#FFFFFF' : theme.textSecondary,
                      fontWeight: isSelected ? '800' : '600'
                    }
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E50914" />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Multi-Hero Banner Carousel (Nguồn từ fimax.aecongnghe.online & 4K Backdrops) */}
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
  categoryBarWrapper: {
    paddingVertical: 10,
    borderBottomWidth: 1
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1
  },
  categoryPillText: {
    fontSize: 12,
    letterSpacing: 0.2
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