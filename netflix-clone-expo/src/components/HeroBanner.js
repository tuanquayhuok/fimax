import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 480;

export const HeroBanner = ({ movies = [], featuredMovies = [], navigation, onPlayPress, onInfoPress }) => {
  const bannerList = (movies && movies.length > 0) ? movies : featuredMovies;
  const { favorites, toggleFavorite, setActiveMovieForPlayer, themeMode, accentColor } = useContext(AppContext);
  const theme = getThemeColors(themeMode);
  
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 5s
  useEffect(() => {
    if (!bannerList || bannerList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % bannerList.length;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerList]);

  if (!bannerList || bannerList.length === 0) return null;

  const onScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slideIndex >= 0 && slideIndex < bannerList.length) {
      setCurrentIndex(slideIndex);
    }
  };

  const handlePlay = (movie) => {
    if (onPlayPress) {
      onPlayPress(movie);
    } else {
      setActiveMovieForPlayer(movie);
    }
  };

  const handleInfo = (movie) => {
    if (onInfoPress) {
      onInfoPress(movie);
    } else if (navigation) {
      navigation.navigate('Detail', { movie });
    }
  };

  const renderBannerItem = ({ item: movie }) => {
    const isFav = favorites.includes(movie.id);
    const bgImage = movie.backdropUrl || movie.backdrop || movie.posterUrl || movie.poster;

    return (
      <View style={{ width, height: BANNER_HEIGHT, position: 'relative' }}>
        <Image
          source={{ uri: bgImage }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Deep Multi-Layered Cinematic Shadow */}
        <View style={styles.gradientOverlay}>
          {/* Metadata pill */}
          <View style={styles.metaRow}>
            <View style={[styles.badgeQuality, { borderColor: accentColor }]}>
              <Text style={styles.badgeQualityText}>4K HDR</Text>
            </View>
            <Text style={styles.metaText}>{movie.releaseYear || movie.year || '2024'}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{movie.duration || '2h 15m'}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{movie.country || 'Điện ảnh'}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title} numberOfLines={2}>
            {movie.title}
          </Text>

          {/* Genres Tagline */}
          <Text style={styles.genres} numberOfLines={1}>
            {Array.isArray(movie.genres) ? movie.genres.join(' • ') : 'Hành động • Kịch tính'}
          </Text>

          {/* Overview snippet */}
          <Text style={styles.overview} numberOfLines={2}>
            {movie.overview}
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            {/* Primary Solid Play Button */}
            <TouchableOpacity
              style={[styles.playBtn, { backgroundColor: '#FFFFFF' }]}
              activeOpacity={0.88}
              onPress={() => handlePlay(movie)}
            >
              <Ionicons name="play" size={18} color="#000000" />
              <Text style={styles.playBtnText}>Xem Phim</Text>
            </TouchableOpacity>

            {/* Frosted Glass Info Button */}
            <TouchableOpacity
              style={styles.infoBtn}
              activeOpacity={0.8}
              onPress={() => handleInfo(movie)}
            >
              <Ionicons name="information-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.infoBtnText}>Chi Tiết</Text>
            </TouchableOpacity>

            {/* Favorite Round Button */}
            <TouchableOpacity
              style={styles.favoriteBtn}
              activeOpacity={0.8}
              onPress={() => toggleFavorite(movie.id)}
            >
              <Ionicons
                name={isFav ? 'heart' : 'heart-outline'}
                size={20}
                color={isFav ? accentColor : '#FFFFFF'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={bannerList}
        renderItem={renderBannerItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {bannerList.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              currentIndex === idx && [styles.dotActive, { backgroundColor: accentColor }]
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: BANNER_HEIGHT,
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end'
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6
  },
  badgeQuality: {
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  badgeQualityText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  metaText: {
    color: '#D1D1D6',
    fontSize: 12,
    fontWeight: '600'
  },
  metaDot: {
    color: '#636366',
    fontSize: 12
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 4
  },
  genres: {
    fontSize: 12,
    color: '#D4AF37',
    fontWeight: '600',
    marginBottom: 6
  },
  overview: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 16,
    marginBottom: 14
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  playBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6
  },
  playBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700'
  },
  infoBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6
  },
  infoBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  favoriteBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pagination: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)'
  },
  dotActive: {
    width: 18,
    backgroundColor: '#E50914'
  }
});