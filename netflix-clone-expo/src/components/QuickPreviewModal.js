import React, { useContext, useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet, Dimensions, Animated, Share, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export const QuickPreviewModal = ({ visible, movie, onClose, navigation, onOpenTrailer }) => {
  const { favorites, toggleFavorite, setActiveMovieForPlayer, themeMode, accentColor } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 50,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true
        })
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!movie) return null;

  const isFav = favorites.includes(movie.id);
  const bgImage = movie.backdropUrl || movie.backdrop || movie.posterUrl || movie.poster;
  const displayYear = movie.releaseYear || movie.year || '2024';

  const handlePlayNow = () => {
    onClose();
    setActiveMovieForPlayer(movie);
  };

  const handleOpenDetail = () => {
    onClose();
    if (navigation) {
      navigation.navigate('Detail', { movie });
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Xem phim đỉnh cao "${movie.title}" (${displayYear}) trên FIMAX Cinema!`
      });
    } catch (e) {}
  };

  const handleWatchTrailer = () => {
    onClose();
    if (onOpenTrailer) {
      onOpenTrailer(movie);
    }
  };

  return (
    <Modal visible={visible} animationType="none" transparent={true}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Quick Preview Header Image with Play Overlay */}
          <TouchableOpacity activeOpacity={0.9} onPress={handlePlayNow} style={styles.imageContainer}>
            <Image source={{ uri: bgImage }} style={styles.backdrop} resizeMode="cover" />
            <View style={styles.imageGradient} />

            {/* Glowing Center Play Button */}
            <View style={styles.centerPlayCircle}>
              <Ionicons name="play" size={28} color="#FFFFFF" style={{ marginLeft: 3 }} />
            </View>

            {/* 3D Touch Hint Pill */}
            <View style={styles.badgeHint}>
              <Ionicons name="sparkles" size={10} color="#D4AF37" />
              <Text style={styles.badgeHintText}>XEM NHANH 3D TOUCH</Text>
            </View>

            {/* Close Top Right */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Movie Meta Information */}
          <View style={styles.content}>
            <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
              {movie.title}
            </Text>

            {/* Meta Row Badges */}
            <View style={styles.metaRow}>
              <View style={[styles.badgeQuality, { borderColor: accentColor }]}>
                <Text style={styles.badgeQualityText}>4K HDR</Text>
              </View>
              <Text style={styles.ratingText}>⭐ {movie.rating || '8.5'}</Text>
              <Text style={[styles.metaDot, { color: theme.textMuted }]}>•</Text>
              <Text style={[styles.metaText, { color: theme.textMuted }]}>{displayYear}</Text>
              <Text style={[styles.metaDot, { color: theme.textMuted }]}>•</Text>
              <Text style={[styles.metaText, { color: theme.textMuted }]}>{movie.duration || '2h 15m'}</Text>
              {movie.ageRating && (
                <>
                  <Text style={[styles.metaDot, { color: theme.textMuted }]}>•</Text>
                  <View style={styles.ageBadge}>
                    <Text style={styles.ageText}>{movie.ageRating}</Text>
                  </View>
                </>
              )}
            </View>

            {/* Genres */}
            <View style={styles.genreRow}>
              {(Array.isArray(movie.genres) ? movie.genres : ['Điện ảnh', 'Bom tấn']).map((g, idx) => (
                <View key={idx} style={[styles.genrePill, { backgroundColor: theme.surfaceSecondary }]}>
                  <Text style={[styles.genreText, { color: theme.textSecondary }]}>{g}</Text>
                </View>
              ))}
            </View>

            {/* Overview Snippet */}
            <Text style={[styles.overview, { color: theme.textSecondary }]} numberOfLines={2}>
              {movie.overview || 'Bộ phim điện ảnh đặc sắc được phát hành trên hệ thống FIMAX Cinema với chất lượng hình ảnh và âm thanh chuẩn rạp.'}
            </Text>

            {/* Primary Action Button */}
            <TouchableOpacity
              style={[styles.primaryPlayBtn, { backgroundColor: accentColor }]}
              activeOpacity={0.88}
              onPress={handlePlayNow}
            >
              <Ionicons name="play" size={18} color="#FFFFFF" />
              <Text style={styles.primaryPlayText}>XEM PHIM NGAY</Text>
            </TouchableOpacity>

            {/* Quick Action Icons Row */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionItem} onPress={handleWatchTrailer}>
                <View style={[styles.iconCircle, { backgroundColor: theme.surfaceSecondary }]}>
                  <Ionicons name="videocam-outline" size={18} color={theme.textPrimary} />
                </View>
                <Text style={[styles.actionLabel, { color: theme.textSecondary }]}>Trailer</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} onPress={() => toggleFavorite(movie.id)}>
                <View style={[styles.iconCircle, { backgroundColor: theme.surfaceSecondary }]}>
                  <Ionicons name={isFav ? "heart" : "heart-outline"} size={18} color={isFav ? accentColor : theme.textPrimary} />
                </View>
                <Text style={[styles.actionLabel, { color: isFav ? accentColor : theme.textSecondary }]}>
                  {isFav ? 'Đã Thích' : 'Yêu Thích'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} onPress={handleOpenDetail}>
                <View style={[styles.iconCircle, { backgroundColor: theme.surfaceSecondary }]}>
                  <Ionicons name="information-circle-outline" size={18} color={theme.textPrimary} />
                </View>
                <Text style={[styles.actionLabel, { color: theme.textSecondary }]}>Chi Tiết</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} onPress={handleShare}>
                <View style={[styles.iconCircle, { backgroundColor: theme.surfaceSecondary }]}>
                  <Ionicons name="share-social-outline" size={18} color={theme.textPrimary} />
                </View>
                <Text style={[styles.actionLabel, { color: theme.textSecondary }]}>Chia Sẻ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.6,
    shadowRadius: 28,
    elevation: 20
  },
  imageContainer: {
    width: '100%',
    height: 190,
    position: 'relative',
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center'
  },
  backdrop: {
    width: '100%',
    height: '100%'
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)'
  },
  centerPlayCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(229, 9, 20, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16
  },
  badgeHint: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)'
  },
  badgeHintText: {
    color: '#D4AF37',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    padding: 16
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.3
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10
  },
  badgeQuality: {
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3
  },
  badgeQualityText: {
    color: '#D4AF37',
    fontSize: 9,
    fontWeight: '800'
  },
  ratingText: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '700'
  },
  metaDot: {
    fontSize: 10
  },
  metaText: {
    fontSize: 11,
    fontWeight: '600'
  },
  ageBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3
  },
  ageText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700'
  },
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10
  },
  genrePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  genreText: {
    fontSize: 10,
    fontWeight: '600'
  },
  overview: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 14
  },
  primaryPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    marginBottom: 14
  },
  primaryPlayText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)'
  },
  actionItem: {
    alignItems: 'center',
    gap: 4
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '500'
  }
});