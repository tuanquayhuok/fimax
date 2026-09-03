import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { ApiService, subscribeMovieUpdates } from '../services/apiService';
import { MOCK_MOVIES } from '../data/mockMovies';
import { CinemaImage } from '../components/CinemaImage';

const { width } = Dimensions.get('window');

const CATEGORIES = ['Tất Cả', 'Việt Nam', 'Chiếu Rạp', 'Hàn Quốc'];

export const RankingsScreen = ({ navigation }) => {
  const { themeMode, accentColor, fontSizeScale, setActiveMovieForPlayer } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  const [allMovies, setAllMovies] = useState(MOCK_MOVIES);
  const [selectedCat, setSelectedCat] = useState('Tất Cả');

  useEffect(() => {
    async function loadData() {
      const movies = await ApiService.getAllMovies();
      if (movies && movies.length > 0) {
        setAllMovies(movies);
      }
    }
    loadData();

    const unsub = subscribeMovieUpdates((updated) => {
      if (updated && updated.length > 0) {
        setAllMovies(updated);
      }
    });
    return () => unsub();
  }, []);

  // Sort and filter top 10 movies
  let filtered = allMovies;
  if (selectedCat === 'Việt Nam') {
    filtered = allMovies.filter(m => m.country === 'Việt Nam' || m.categoryTag === 'vietnam');
  } else if (selectedCat === 'Chiếu Rạp') {
    filtered = allMovies.filter(m => m.categoryTag === 'cinema' || (m.rating && m.rating >= 8.5));
  } else if (selectedCat === 'Hàn Quốc') {
    filtered = allMovies.filter(m => m.country === 'Hàn Quốc' || m.categoryTag === 'korean');
  }

  const top10Movies = [...filtered]
    .sort((a, b) => (b.rating || 8.5) - (a.rating || 8.5))
    .slice(0, 10);

  const renderRankItem = ({ item: movie, index }) => {
    const rank = index + 1;
    const isTop3 = rank <= 3;
    const posterUri = movie.posterUrl || movie.poster || movie.backdropUrl || movie.backdrop;
    const bgUri = movie.backdropUrl || movie.backdrop;

    return (
      <TouchableOpacity
        style={[styles.rankCard, { backgroundColor: theme.surface, borderColor: isTop3 ? `${accentColor}4D` : theme.border }]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('Detail', { movie })}
      >
        {/* Big Rank Number */}
        <View style={styles.rankNumberBox}>
          <Text
            style={[
              styles.rankNumber,
              { color: isTop3 ? accentColor : (theme.isLight ? '#C7C7CC' : '#3A3A3C') }
            ]}
          >
            {rank}
          </Text>
        </View>

        {/* Poster */}
        <View style={styles.posterWrap}>
          <CinemaImage uri={posterUri} fallbackUri={bgUri} style={styles.poster} resizeMode="cover" />
          <View style={[styles.qualityBadge, { borderColor: accentColor }]}>
            <Text style={styles.qualityText}>4K</Text>
          </View>
        </View>

        {/* Movie Info */}
        <View style={styles.infoWrap}>
          <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
            {movie.title}
          </Text>

          <Text style={[styles.originalTitle, { color: theme.textMuted }]} numberOfLines={1}>
            {movie.originalTitle || movie.title}
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.ratingText}>⭐ {movie.rating || '8.8'}</Text>
            <Text style={[styles.metaDot, { color: theme.textMuted }]}>•</Text>
            <Text style={[styles.metaText, { color: theme.textMuted }]}>{movie.duration || '115 phút'}</Text>
            <Text style={[styles.metaDot, { color: theme.textMuted }]}>•</Text>
            <Text style={[styles.metaText, { color: theme.textMuted }]}>{movie.releaseYear || '2025'}</Text>
          </View>

          <Text style={[styles.genreText, { color: isTop3 ? '#D4AF37' : theme.textSecondary }]} numberOfLines={1}>
            {Array.isArray(movie.genres) ? movie.genres.join(' • ') : (movie.country || 'Điện ảnh')}
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.playBtn, { backgroundColor: accentColor }]}
              activeOpacity={0.85}
              onPress={() => setActiveMovieForPlayer(movie)}
            >
              <Ionicons name="play" size={13} color="#FFFFFF" />
              <Text style={styles.playBtnText}>Xem ngay</Text>
            </TouchableOpacity>

            <View style={styles.trendingBadge}>
              <Ionicons name="flame" size={13} color="#FF9500" />
              <Text style={styles.trendingText}>Top {rank} tuần này</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: theme.textPrimary, fontSize: 26 * fontSizeScale }]}>
          Bảng Xếp Hạng
        </Text>
        <Text style={[styles.screenSubtitle, { color: theme.textMuted }]}>
          Top 10 phim bom tấn chiếu rạp được xem nhiều nhất
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsRow}>
        {CATEGORIES.map((cat) => {
          const active = selectedCat === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.catPill,
                { backgroundColor: active ? `${accentColor}1A` : theme.surface, borderColor: active ? accentColor : theme.border }
              ]}
              activeOpacity={0.8}
              onPress={() => setSelectedCat(cat)}
            >
              <Text
                style={[
                  styles.catText,
                  { color: active ? accentColor : theme.textSecondary, fontWeight: active ? '700' : '500' }
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List Top 10 */}
      <FlatList
        data={top10Movies}
        keyExtractor={(item) => item.id}
        renderItem={renderRankItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    marginBottom: 14
  },
  screenTitle: {
    fontWeight: '900',
    letterSpacing: -0.5
  },
  screenSubtitle: {
    fontSize: 12,
    marginTop: 2
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 14
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1
  },
  catText: {
    fontSize: 12
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12
  },
  rankCard: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3
  },
  rankNumberBox: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6
  },
  rankNumber: {
    fontSize: 26,
    fontWeight: '900',
    fontStyle: 'italic'
  },
  posterWrap: {
    width: 76,
    height: 108,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E1E24'
  },
  poster: {
    width: '100%',
    height: '100%'
  },
  qualityBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 3,
    borderWidth: 0.7
  },
  qualityText: {
    color: '#D4AF37',
    fontSize: 7.5,
    fontWeight: '900'
  },
  infoWrap: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center'
  },
  title: {
    fontSize: 14.5,
    fontWeight: '700'
  },
  originalTitle: {
    fontSize: 11,
    marginTop: 1
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4
  },
  ratingText: {
    color: '#D4AF37',
    fontSize: 11,
    fontWeight: '700'
  },
  metaDot: {
    fontSize: 8
  },
  metaText: {
    fontSize: 11
  },
  genreText: {
    fontSize: 11,
    marginTop: 2
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700'
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  trendingText: {
    color: '#FF9500',
    fontSize: 11,
    fontWeight: '600'
  }
});
