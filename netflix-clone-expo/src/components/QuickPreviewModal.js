import React, { useContext } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { CinemaImage } from './CinemaImage';

const { width } = Dimensions.get('window');

export const QuickPreviewModal = ({ visible, movie, onClose, navigation, onOpenTrailer }) => {
  const { favorites, toggleFavorite, setActiveMovieForPlayer, themeMode, accentColor } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  if (!movie) return null;

  const isFav = favorites.includes(movie.id);
  const bgImage = movie.backdropUrl || movie.backdrop || movie.posterUrl || movie.poster;
  const posterImage = movie.posterUrl || movie.poster || movie.backdropUrl || movie.backdrop;
  const displayYear = movie.releaseYear || movie.year || '2025';

  const handlePlay = () => {
    onClose();
    setActiveMovieForPlayer(movie);
  };

  const handleOpenDetail = () => {
    onClose();
    navigation?.navigate('Detail', { movie });
  };

  const handleTrailer = () => {
    onClose();
    if (onOpenTrailer) {
      onOpenTrailer(movie);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Movie Backdrop */}
          <View style={styles.imageWrap}>
            <CinemaImage uri={bgImage} fallbackUri={posterImage} style={styles.image} resizeMode="cover" />
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.floatingPlayPill}>
              <Ionicons name="sparkles" size={12} color="#D4AF37" />
              <Text style={styles.floatingPlayText}>4K ULTRA HD</Text>
            </View>
          </View>

          {/* Info & Actions */}
          <View style={styles.content}>
            <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
              {movie.title}
            </Text>

            <View style={styles.metaRow}>
              <Text style={styles.ratingText}>⭐ {movie.rating || '8.5'}</Text>
              <Text style={[styles.metaText, { color: theme.textMuted }]}>{displayYear}</Text>
              <Text style={[styles.metaText, { color: theme.textMuted }]}>{movie.duration || '2h 15m'}</Text>
              <Text style={[styles.metaText, { color: '#D4AF37' }]}>{movie.country || 'Điện ảnh'}</Text>
            </View>

            <Text style={[styles.overview, { color: theme.textSecondary }]} numberOfLines={2}>
              {movie.overview}
            </Text>

            {/* Action Buttons Row */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.playBtn, { backgroundColor: accentColor }]} activeOpacity={0.85} onPress={handlePlay}>
                <Ionicons name="play" size={16} color="#FFFFFF" />
                <Text style={styles.playBtnText}>Xem Ngay</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.trailerBtn, { backgroundColor: theme.surfaceSecondary }]} activeOpacity={0.85} onPress={handleTrailer}>
                <Ionicons name="videocam-outline" size={16} color={theme.textPrimary} />
                <Text style={[styles.trailerBtnText, { color: theme.textPrimary }]}>Trailer</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.surfaceSecondary }]} activeOpacity={0.85} onPress={() => toggleFavorite(movie.id)}>
                <Ionicons name={isFav ? "heart" : "heart-outline"} size={18} color={isFav ? accentColor : theme.textPrimary} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.iconBtn, { backgroundColor: theme.surfaceSecondary }]} activeOpacity={0.85} onPress={handleOpenDetail}>
                <Ionicons name="chevron-forward" size={18} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  card: {
    width: '100%',
    maxWidth: 350,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10
  },
  imageWrap: {
    width: '100%',
    height: 190,
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  floatingPlayPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4
  },
  floatingPlayText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  content: {
    padding: 16
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  ratingText: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '700'
  },
  metaText: {
    fontSize: 11
  },
  overview: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 14
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
    gap: 4
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  trailerBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4
  },
  trailerBtnText: {
    fontSize: 12,
    fontWeight: '600'
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  }
});