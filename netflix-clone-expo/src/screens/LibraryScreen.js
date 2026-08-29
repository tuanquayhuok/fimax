import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { MOCK_MOVIES } from '../data/mockMovies';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 3;

export const LibraryScreen = ({ navigation }) => {
  const { favorites, watchHistory, setActiveMovieForPlayer, themeMode, accentColor, fontSizeScale } = useContext(AppContext);
  const theme = getThemeColors(themeMode);
  
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' | 'history'

  const favoriteMovies = MOCK_MOVIES.filter(m => favorites.includes(m.id));
  const historyMovies = watchHistory.map(h => {
    const movie = MOCK_MOVIES.find(m => m.id === h.movieId);
    return movie ? { ...movie, progress: h.percentage } : null;
  }).filter(Boolean);

  const displayMovies = activeTab === 'favorites' ? favoriteMovies : historyMovies;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: theme.textPrimary, fontSize: 28 * fontSizeScale }]}>Thư Viện</Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'favorites' && { backgroundColor: theme.surfaceSecondary }]}
          onPress={() => setActiveTab('favorites')}
        >
          <Ionicons name="heart" size={16} color={activeTab === 'favorites' ? accentColor : theme.textSecondary} />
          <Text style={[styles.tabText, { color: activeTab === 'favorites' ? theme.textPrimary : theme.textSecondary }]}>
            Yêu Thích ({favoriteMovies.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'history' && { backgroundColor: theme.surfaceSecondary }]}
          onPress={() => setActiveTab('history')}
        >
          <Ionicons name="time" size={16} color={activeTab === 'history' ? accentColor : theme.textSecondary} />
          <Text style={[styles.tabText, { color: activeTab === 'history' ? theme.textPrimary : theme.textSecondary }]}>
            Đã Xem ({historyMovies.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Grid */}
      {displayMovies.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="film-outline" size={48} color={theme.textMuted} />
          <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Chưa có phim nào ở mục này</Text>
          <Text style={[styles.emptySub, { color: theme.textSecondary }]}>Khám phá kho phim và thêm các tựa phim yêu thích của bạn!</Text>
        </View>
      ) : (
        <FlatList
          data={displayMovies}
          numColumns={3}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.gridItem}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Detail', { movie: item })}
            >
              <Image source={{ uri: item.poster }} style={styles.poster} />
              <Text style={[styles.movieTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                {item.title}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.ratingText}>⭐ {item.rating}</Text>
                <Text style={[styles.yearText, { color: theme.textMuted }]}>{item.year}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16
  },
  screenTitle: {
    fontWeight: '800',
    letterSpacing: -0.5
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600'
  },
  gridContent: {
    paddingHorizontal: 16,
    gap: 12
  },
  gridItem: {
    width: ITEM_WIDTH,
    marginHorizontal: 4,
    marginBottom: 12
  },
  poster: {
    width: '100%',
    height: ITEM_WIDTH * 1.48,
    borderRadius: 8,
    backgroundColor: '#222'
  },
  movieTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2
  },
  ratingText: {
    color: '#D4AF37',
    fontSize: 10,
    fontWeight: '700'
  },
  yearText: {
    fontSize: 10
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 10
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center'
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18
  }
});