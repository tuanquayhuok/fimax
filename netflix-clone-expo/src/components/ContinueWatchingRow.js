import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { MOCK_MOVIES } from '../data/mockMovies';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.52;

export const ContinueWatchingRow = ({ navigation }) => {
  const { continueWatching, setActiveMovieForPlayer, themeMode, accentColor, fontSizeScale } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  if (!continueWatching || continueWatching.length === 0) return null;

  const movies = continueWatching.map(item => {
    const m = MOCK_MOVIES.find(movie => movie.id === item.movieId);
    return m ? { ...m, progress: item.percentage } : null;
  }).filter(Boolean);

  if (movies.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.textPrimary, fontSize: 17 * fontSizeScale }]}>
        Tiếp Tục Xem
      </Text>
      <FlatList
        data={movies}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => setActiveMovieForPlayer(item)}
          >
            <View style={styles.thumbWrapper}>
              <Image source={{ uri: item.backdrop || item.poster }} style={styles.thumb} />
              <View style={styles.playOverlay}>
                <View style={[styles.playCircle, { backgroundColor: 'rgba(0,0,0,0.6)', borderColor: '#FFFFFF' }]}>
                  <Ionicons name="play" size={16} color="#FFFFFF" />
                </View>
              </View>
              {/* Progress Bar */}
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${item.progress || 30}%`, backgroundColor: accentColor }]} />
              </View>
            </View>
            <Text style={[styles.movieTitle, { color: theme.textPrimary }]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={[styles.progressText, { color: theme.textSecondary }]}>
              Còn {Math.round(100 - (item.progress || 30))}% thời lượng
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12
  },
  title: {
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 10,
    letterSpacing: -0.3
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12
  },
  card: {
    width: CARD_WIDTH
  },
  thumbWrapper: {
    width: '100%',
    height: CARD_WIDTH * 0.58,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#222'
  },
  thumb: {
    width: '100%',
    height: '100%'
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  playCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5
  },
  progressBarBg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  progressBarFill: {
    height: '100%'
  },
  movieTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6
  },
  progressText: {
    fontSize: 11,
    marginTop: 2
  }
});