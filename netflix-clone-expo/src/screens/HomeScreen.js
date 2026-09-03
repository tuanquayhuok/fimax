import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Text } from 'react-native';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { ApiService } from '../services/apiService';
import { HeaderBar } from '../components/HeaderBar';
import { HeroBanner } from '../components/HeroBanner';
import { MovieRow } from '../components/MovieRow';
import { QuickPreviewModal } from '../components/QuickPreviewModal';
import { TrailerModal } from '../components/TrailerModal';

export const HomeScreen = ({ navigation }) => {
  const { themeMode } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  const [refreshing, setRefreshing] = useState(false);
  const [previewMovie, setPreviewMovie] = useState(null);
  const [trailerMovie, setTrailerMovie] = useState(null);

  const [moviesBySection, setMoviesBySection] = useState({
    trending: [],
    newReleases: [],
    topRated: [],
    comingSoon: [],
    vietnam: [],
    hollywood: []
  });

  const loadData = async (forceRefresh = false) => {
    try {
      const [trending, newReleases, topRated, comingSoon, vietnam, hollywood] = await Promise.all([
        ApiService.getTrendingMovies(),
        ApiService.getNewReleases(),
        ApiService.getTopRatedMovies(),
        ApiService.getComingSoonMovies(),
        ApiService.getMoviesByCountry('Việt Nam'),
        ApiService.getMoviesByCountry('Âu Mỹ')
      ]);

      setMoviesBySection({
        trending: trending || [],
        newReleases: newReleases || [],
        topRated: topRated || [],
        comingSoon: comingSoon || [],
        vietnam: vietnam || [],
        hollywood: hollywood || []
      });
    } catch (e) {
      console.warn('API loadData error:', e.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // 0ms instant render from memory cache
    loadData(false);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData(true);
  };

  const heroMovies = (moviesBySection.trending && moviesBySection.trending.length > 0)
    ? moviesBySection.trending.slice(0, 5)
    : [];

  const handleLongPressMovie = (movie) => {
    setPreviewMovie(movie);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderBar navigation={navigation} />

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

        {/* Section Rows with 3D Touch Long Press Support */}
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
  scrollContent: {
    paddingBottom: 20
  }
});