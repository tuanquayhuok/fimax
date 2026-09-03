import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { MOCK_MOVIES } from '../data/mockMovies';
import { TrailerModal } from '../components/TrailerModal';

const { width } = Dimensions.get('window');

export const ExploreScreen = ({ navigation }) => {
  const { themeMode, accentColor, fontSizeScale, setActiveMovieForPlayer } = useContext(AppContext);
  const theme = getThemeColors(themeMode);
  
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [trailerMovie, setTrailerMovie] = useState(null);

  const categories = ['Tất cả', 'Top 10 Rạp Phim 🔥', 'Hành Động', 'Tâm Lý', 'Kinh Dị', 'Hoạt Hình'];

  const top10Movies = [...MOCK_MOVIES].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 10);
  
  const filteredMovies = activeCategory === 'Tất cả'
    ? MOCK_MOVIES
    : activeCategory === 'Top 10 Rạp Phim 🔥'
      ? top10Movies
      : MOCK_MOVIES.filter(m => Array.isArray(m.genres) && m.genres.some(g => g.toLowerCase().includes(activeCategory.toLowerCase())));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary, fontSize: 26 * fontSizeScale }]}>
          Khám Phá & Thịnh Hành
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Bảng xếp hạng phim điện ảnh và trailer hot nhất hôm nay
        </Text>
      </View>

      {/* Category Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryPill,
                { backgroundColor: isSelected ? accentColor : theme.surface, borderColor: theme.border }
              ]}
              activeOpacity={0.8}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.categoryText, { color: isSelected ? '#FFFFFF' : theme.textSecondary }]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Movies List */}
      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const rank = index + 1;
          const bgImg = item.backdropUrl || item.backdrop || item.posterUrl || item.poster;
          return (
            <TouchableOpacity
              style={[styles.movieCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('Detail', { movie: item })}
            >
              {/* Big Backdrop Banner with Rank Badge */}
              <View style={styles.bannerWrap}>
                <Image source={{ uri: bgImg }} style={styles.bannerImg} />
                <View style={styles.bannerOverlay} />

                {/* Big Rank Number for Top 10 */}
                {activeCategory === 'Top 10 Rạp Phim 🔥' && (
                  <View style={[styles.rankBadge, { backgroundColor: rank <= 3 ? '#E50914' : 'rgba(0,0,0,0.7)' }]}>
                    <Text style={styles.rankText}>TOP {rank}</Text>
                  </View>
                )}

                {/* Quality pill */}
                <View style={[styles.qualityPill, { borderColor: accentColor }]}>
                  <Text style={styles.qualityText}>4K HDR</Text>
                </View>

                {/* Play Button Overlay */}
                <TouchableOpacity
                  style={[styles.playCircle, { backgroundColor: accentColor }]}
                  activeOpacity={0.85}
                  onPress={() => setActiveMovieForPlayer(item)}
                >
                  <Ionicons name="play" size={20} color="#FFFFFF" style={{ marginLeft: 2 }} />
                </TouchableOpacity>
              </View>

              {/* Info Bottom */}
              <View style={styles.cardInfo}>
                <View style={styles.titleRow}>
                  <Text style={[styles.movieTitle, { color: theme.textPrimary, fontSize: 16 * fontSizeScale }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.ratingText}>⭐ {item.rating || '8.5'}</Text>
                </View>

                <Text style={[styles.genresText, { color: theme.textMuted }]} numberOfLines={1}>
                  {Array.isArray(item.genres) ? item.genres.join(' • ') : 'Điện ảnh'} | {item.releaseYear || item.year || '2024'} | {item.duration || '2h 10m'}
                </Text>

                <Text style={[styles.overviewText, { color: theme.textSecondary }]} numberOfLines={2}>
                  {item.overview}
                </Text>

                {/* Actions row */}
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={[styles.trailerBtn, { backgroundColor: theme.surfaceSecondary }]}
                    onPress={() => setTrailerMovie(item)}
                  >
                    <Ionicons name="videocam-outline" size={16} color={theme.textPrimary} />
                    <Text style={[styles.trailerText, { color: theme.textPrimary }]}>Xem Trailer</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.detailBtn, { borderColor: theme.border }]}
                    onPress={() => navigation.navigate('Detail', { movie: item })}
                  >
                    <Text style={[styles.detailBtnText, { color: theme.textPrimary }]}>Chi Tiết</Text>
                    <Ionicons name="chevron-forward" size={14} color={theme.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
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
    flex: 1,
    paddingTop: 54
  },
  header: {
    paddingHorizontal: 18,
    marginBottom: 12
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 12,
    marginTop: 3
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 12
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600'
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16
  },
  movieCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1
  },
  bannerWrap: {
    width: '100%',
    height: 180,
    position: 'relative'
  },
  bannerImg: {
    width: '100%',
    height: '100%'
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)'
  },
  rankBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900'
  },
  qualityPill: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1
  },
  qualityText: {
    color: '#D4AF37',
    fontSize: 9,
    fontWeight: '800'
  },
  playCircle: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8
  },
  cardInfo: {
    padding: 14
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  movieTitle: {
    fontWeight: '700',
    flex: 1,
    marginRight: 8
  },
  ratingText: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '700'
  },
  genresText: {
    fontSize: 11,
    marginBottom: 6
  },
  overviewText: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10
  },
  trailerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 8,
    gap: 6
  },
  trailerText: {
    fontSize: 12,
    fontWeight: '600'
  },
  detailBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4
  },
  detailBtnText: {
    fontSize: 12,
    fontWeight: '600'
  }
});