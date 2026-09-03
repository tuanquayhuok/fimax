import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const BANNER_IMG_HEIGHT = Math.round(CARD_WIDTH * (9 / 16)); // Exact 16:9 Ratio (No Crop)

export const HeroBanner = ({ movies = [], featuredMovies = [], navigation, onPlayPress, onInfoPress }) => {
  const bannerList = (movies && movies.length > 0) ? movies : featuredMovies;
  const { favorites, toggleFavorite, setActiveMovieForPlayer, themeMode, accentColor, fontSizeScale } = useContext(AppContext);
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
      <View style={styles.slideWrap}>
        <View style={[styles.bannerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* 16:9 Full Width Backdrop Image (Uncropped) */}
          <View style={styles.imageWrap}>
            <Image
              source={{ uri: bgImage }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.imageDarkGrad} />

            {/* Quality pill top left */}
            <View style={[styles.badgeQuality, { borderColor: accentColor }]}>
              <Text style={styles.badgeQualityText}>4K ULTRA HD</Text>
            </View>

            {/* Rating pill top right */}
            <View style={styles.badgeRating}>
              <Text style={styles.badgeRatingText}>⭐ {movie.rating || '8.5'}</Text>
            </View>
          </View>

          {/* Banner Meta Content Below Image */}
          <View style={styles.contentWrap}>
            {/* Title */}
            <Text style={[styles.title, { color: theme.textPrimary, fontSize: 18 * fontSizeScale }]} numberOfLines={1}>
              {movie.title}
            </Text>

            {/* Meta Row */}
            <View style={styles.metaRow}>
              <Text style={[styles.metaText, { color: theme.textMuted }]}>{movie.releaseYear || movie.year || '2025'}</Text>
              <Text style={[styles.metaDot, { color: theme.textMuted }]}>•</Text>
              <Text style={[styles.metaText, { color: theme.textMuted }]}>{movie.duration || '2h 15m'}</Text>
              <Text style={[styles.metaDot, { color: theme.textMuted }]}>•</Text>
              <Text style={[styles.genreText, { color: '#D4AF37' }]} numberOfLines={1}>
                {Array.isArray(movie.genres) ? movie.genres.join(' • ') : 'Điện ảnh • Chiếu Rạp'}
              </Text>
            </View>

            {/* Overview snippet */}
            <Text style={[styles.overview, { color: theme.textSecondary }]} numberOfLines={2}>
              {movie.overview}
            </Text>

            {/* Action Buttons Row */}
            <View style={styles.actionRow}>
              {/* Primary Play Button */}
              <TouchableOpacity
                style={[styles.playBtn, { backgroundColor: accentColor }]}
                activeOpacity={0.88}
                onPress={() => handlePlay(movie)}
              >
                <Ionicons name="play" size={16} color="#FFFFFF" />
                <Text style={styles.playBtnText}>Xem Phim</Text>
              </TouchableOpacity>

              {/* Info Button */}
              <TouchableOpacity
                style={[styles.infoBtn, { backgroundColor: theme.surfaceSecondary }]}
                activeOpacity={0.8}
                onPress={() => handleInfo(movie)}
              >
                <Ionicons name="information-circle-outline" size={18} color={theme.textPrimary} />
                <Text style={[styles.infoBtnText, { color: theme.textPrimary }]}>Chi Tiết</Text>
              </TouchableOpacity>

              {/* Favorite Button */}
              <TouchableOpacity
                style={[styles.favoriteBtn, { backgroundColor: theme.surfaceSecondary }]}
                activeOpacity={0.8}
                onPress={() => toggleFavorite(movie.id)}
              >
                <Ionicons
                  name={isFav ? 'heart' : 'heart-outline'}
                  size={18}
                  color={isFav ? accentColor : theme.textPrimary}
                />
              </TouchableOpacity>
            </View>
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
    paddingVertical: 10,
    position: 'relative'
  },
  slideWrap: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bannerCard: {
    width: CARD_WIDTH,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6
  },
  imageWrap: {
    width: CARD_WIDTH,
    height: BANNER_IMG_HEIGHT,
    position: 'relative',
    backgroundColor: '#18181A'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  imageDarkGrad: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  badgeQuality: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5
  },
  badgeQualityText: {
    color: '#D4AF37',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  badgeRating: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5
  },
  badgeRatingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  contentWrap: {
    padding: 14
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 4
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6
  },
  metaText: {
    fontSize: 11,
    fontWeight: '600'
  },
  metaDot: {
    fontSize: 10
  },
  genreText: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1
  },
  overview: {
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 12
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  playBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  infoBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 5
  },
  infoBtnText: {
    fontSize: 13,
    fontWeight: '600'
  },
  favoriteBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)'
  },
  dotActive: {
    width: 18,
    borderRadius: 3
  }
});