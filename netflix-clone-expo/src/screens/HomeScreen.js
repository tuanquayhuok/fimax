import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Text, ActivityIndicator } from 'react-native';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { ApiService } from '../services/apiService';
import { HeaderBar } from '../components/HeaderBar';
import { HeroBanner } from '../components/HeroBanner';
import { MovieRow } from '../components/MovieRow';

export const HomeScreen = ({ navigation }) => {
  const { themeMode } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [moviesBySection, setMoviesBySection] = useState({
    trending: [],
    newReleases: [],
    topRated: [],
    comingSoon: [],
    vietnam: [],
    hollywood: []
  });

  const loadData = async () => {
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
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const heroMovies = (moviesBySection.trending && moviesBySection.trending.length > 0)
    ? moviesBySection.trending.slice(0, 5)
    : [];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderBar navigation={navigation} />

      {loading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#E50914" />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Đang tải kho phim...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E50914" />}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Multi-Hero Banner Carousel */}
          {heroMovies.length > 0 && (
            <HeroBanner movies={heroMovies} navigation={navigation} />
          )}

          {/* Section Rows (Clean, Cinema-Only Categorization) */}
          {moviesBySection.trending.length > 0 && (
            <MovieRow title="Phim Đang Hot 🔥" movies={moviesBySection.trending} navigation={navigation} />
          )}
          {moviesBySection.newReleases.length > 0 && (
            <MovieRow title="Phim Mới Cập Nhật 🎬" movies={moviesBySection.newReleases} navigation={navigation} />
          )}
          {moviesBySection.topRated.length > 0 && (
            <MovieRow title="Đánh Giá Cao ⭐" movies={moviesBySection.topRated} navigation={navigation} />
          )}
          {moviesBySection.vietnam.length > 0 && (
            <MovieRow title="Phim Điện Ảnh Việt Nam 🇻🇳" movies={moviesBySection.vietnam} navigation={navigation} />
          )}
          {moviesBySection.hollywood.length > 0 && (
            <MovieRow title="Bom Tấn Hollywood 🍿" movies={moviesBySection.hollywood} navigation={navigation} />
          )}
          {moviesBySection.comingSoon.length > 0 && (
            <MovieRow title="Sắp Ra Mắt ⏳" movies={moviesBySection.comingSoon} navigation={navigation} />
          )}

          <View style={{ height: 60 }} />
        </ScrollView>
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
  },
  loadingCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500'
  }
});