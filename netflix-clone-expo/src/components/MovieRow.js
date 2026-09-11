import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.32;

export const MovieRow = ({ title, movies, navigation, onLongPressMovie, isComingSoon = false, isLoading = false }) => {
  const { themeMode, fontSizeScale, accentColor } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  const showSkeletons = isLoading || (!movies || movies.length === 0);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.textPrimary, fontSize: 16 * fontSizeScale }]}>{title}</Text>
        {isComingSoon && (
          <View style={[styles.comingSoonBadge, { backgroundColor: `${accentColor}1A`, borderColor: accentColor }]}>
            <Text style={[styles.comingSoonBadgeText, { color: accentColor }]}>Sắp Chiếu</Text>
          </View>
        )}
      </View>

      {showSkeletons ? (
        <FlatList
          data={[1, 2, 3, 4, 5]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={() => <MovieCardSkeleton />}
        />
      ) : (
        <FlatList
          data={movies}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              navigation={navigation}
              onLongPress={onLongPressMovie}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.3
  },
  comingSoonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1
  },
  comingSoonBadgeText: {
    fontSize: 10,
    fontWeight: '800'
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12
  },
  comingSoonCard: {
    width: CARD_WIDTH
  },
  comingSoonBox: {
    width: '100%',
    height: CARD_WIDTH * 1.48,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3
  },
  skeletonTitle: {
    width: '85%',
    height: 10,
    borderRadius: 4,
    marginTop: 8
  },
  skeletonSub: {
    width: '55%',
    height: 8,
    borderRadius: 4,
    marginTop: 4
  }
});
