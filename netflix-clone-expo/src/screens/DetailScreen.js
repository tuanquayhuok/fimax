import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Share, FlatList, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { RatingModal } from '../components/RatingModal';
import { TrailerModal } from '../components/TrailerModal';
import { CinemaImage } from '../components/CinemaImage';

const { width } = Dimensions.get('window');

export const DetailScreen = ({ route, navigation }) => {
  const { movie } = route.params || {};
  const { favorites, toggleFavorite, setActiveMovieForPlayer, themeMode, accentColor } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  // Transition animations
  const pageFade = useRef(new Animated.Value(0)).current;
  const pageSlide = useRef(new Animated.Value(20)).current;

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    // Smooth Page Entry Animation
    Animated.parallel([
      Animated.timing(pageFade, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true
      }),
      Animated.spring(pageSlide, {
        toValue: 0,
        friction: 6,
        tension: 60,
        useNativeDriver: true
      })
    ]).start();
  }, [movie]);

  if (!movie) {
    return (
      <View style={[styles.errorCenter, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.textPrimary }}>Không tìm thấy thông tin phim.</Text>
      </View>
    );
  }

  const isFav = favorites.includes(movie.id);
  const bgImage = movie.backdropUrl || movie.backdrop || movie.posterUrl || movie.poster;
  const posterImage = movie.posterUrl || movie.poster || movie.backdropUrl || movie.backdrop;
  const displayYear = movie.releaseYear || movie.year || '2025';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Xem phim "${movie.title}" cực nét trên ứng dụng FIMAX Cinema!`
      });
    } catch (e) {}
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: theme.background, opacity: pageFade, transform: [{ translateY: pageSlide }] }]}>
      {/* Top Floating Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Backdrop Banner */}
        <View style={styles.backdropWrap}>
          <CinemaImage uri={bgImage} fallbackUri={posterImage} style={styles.backdropImg} resizeMode="cover" />
          <View style={styles.backdropOverlay} />
        </View>

        {/* Header Content */}
        <View style={styles.contentWrap}>
          <View style={styles.posterRow}>
            <View style={styles.posterThumbWrap}>
              <CinemaImage uri={posterImage} fallbackUri={bgImage} style={styles.posterThumb} resizeMode="cover" />
            </View>
            <View style={styles.headerInfo}>
              <Text style={[styles.title, { color: theme.textPrimary }]}>{movie.title}</Text>
              <Text style={[styles.originalTitle, { color: theme.textSecondary }]}>{movie.originalTitle || movie.title}</Text>

              <View style={styles.badgesRow}>
                <View style={[styles.qualityBadge, { borderColor: accentColor }]}>
                  <Text style={styles.qualityText}>4K HDR</Text>
                </View>
                <Text style={styles.ratingText}>⭐ {movie.rating || '8.5'}</Text>
                <Text style={[styles.metaText, { color: theme.textMuted }]}>{displayYear}</Text>
                <Text style={[styles.metaText, { color: theme.textMuted }]}>{movie.duration || '2h 15m'}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.primaryActionRow}>
            <TouchableOpacity
              style={[styles.watchBtn, { backgroundColor: accentColor }]}
              activeOpacity={0.85}
              onPress={() => setActiveMovieForPlayer(movie)}
            >
              <Ionicons name="play" size={20} color="#FFFFFF" />
              <Text style={styles.watchBtnText}>XEM PHIM</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.trailerBtn, { backgroundColor: theme.surfaceSecondary }]}
              activeOpacity={0.85}
              onPress={() => setShowTrailerModal(true)}
            >
              <Ionicons name="videocam-outline" size={20} color={theme.textPrimary} />
              <Text style={[styles.trailerBtnText, { color: theme.textPrimary }]}>Trailer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconActionBtn, { backgroundColor: theme.surfaceSecondary }]}
              activeOpacity={0.85}
              onPress={() => toggleFavorite(movie.id)}
            >
              <Ionicons name={isFav ? "heart" : "heart-outline"} size={22} color={isFav ? accentColor : theme.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconActionBtn, { backgroundColor: theme.surfaceSecondary }]}
              activeOpacity={0.85}
              onPress={() => setShowRatingModal(true)}
            >
              <Ionicons name={userRating ? "star" : "star-outline"} size={22} color={userRating ? "#D4AF37" : theme.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconActionBtn, { backgroundColor: theme.surfaceSecondary }]}
              activeOpacity={0.85}
              onPress={handleShare}
            >
              <Ionicons name="share-social-outline" size={22} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Overview */}
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Nội Dung Phim</Text>
          <Text style={[styles.overviewText, { color: theme.textSecondary }]}>{movie.overview}</Text>

          {/* Details Table */}
          <View style={[styles.detailsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Thể loại:</Text>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                {Array.isArray(movie.genres) ? movie.genres.join(', ') : 'Điện ảnh'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Quốc gia:</Text>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{movie.country || 'Việt Nam'}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Đạo diễn:</Text>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{movie.director || 'Chưa cập nhật'}</Text>
            </View>
          </View>

          {/* Cast */}
          {movie.cast && movie.cast.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Diễn Viên Chính</Text>
              <FlatList
                data={movie.cast}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(c, idx) => idx.toString()}
                renderItem={({ item: castMember }) => (
                  <View style={styles.castItem}>
                    <CinemaImage uri={castMember.avatar} style={styles.castAvatar} resizeMode="cover" />
                    <Text style={[styles.castName, { color: theme.textPrimary }]} numberOfLines={1}>{castMember.name}</Text>
                    <Text style={[styles.castRole, { color: theme.textMuted }]} numberOfLines={1}>{castMember.role}</Text>
                  </View>
                )}
                contentContainerStyle={{ gap: 14, paddingTop: 10 }}
              />
            </View>
          )}

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>

      {/* Trailer & Rating Modals */}
      <TrailerModal visible={showTrailerModal} trailerUrl={movie.trailerUrl} onClose={() => setShowTrailerModal(false)} />
      <RatingModal visible={showRatingModal} movieTitle={movie.title} onClose={() => setShowRatingModal(false)} onRateSubmit={setUserRating} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  errorCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 99,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)'
  },
  backdropWrap: {
    width: '100%',
    height: 250,
    position: 'relative'
  },
  backdropImg: {
    width: '100%',
    height: '100%'
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)'
  },
  contentWrap: {
    paddingHorizontal: 18,
    marginTop: -40
  },
  posterRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 14
  },
  posterThumbWrap: {
    width: 100,
    height: 150,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    backgroundColor: '#222'
  },
  posterThumb: {
    width: '100%',
    height: '100%'
  },
  headerInfo: {
    flex: 1,
    paddingBottom: 4
  },
  title: {
    fontSize: 20,
    fontWeight: '800'
  },
  originalTitle: {
    fontSize: 12,
    marginTop: 2
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8
  },
  qualityBadge: {
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3
  },
  qualityText: {
    color: '#D4AF37',
    fontSize: 9,
    fontWeight: '800'
  },
  ratingText: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '700'
  },
  metaText: {
    fontSize: 11
  },
  primaryActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 10
  },
  watchBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 6
  },
  watchBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },
  trailerBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 4
  },
  trailerBtnText: {
    fontSize: 13,
    fontWeight: '600'
  },
  iconActionBtn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 8
  },
  overviewText: {
    fontSize: 13,
    lineHeight: 20
  },
  detailsCard: {
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    gap: 8
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  detailLabel: {
    fontSize: 12
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right'
  },
  castItem: {
    alignItems: 'center',
    width: 70
  },
  castAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#222'
  },
  castName: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center'
  },
  castRole: {
    fontSize: 9,
    textAlign: 'center'
  }
});