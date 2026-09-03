import React, { useContext, useRef } from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions, Text, View, Animated } from 'react-native';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.32;

export const MovieCard = ({ movie, navigation, onLongPress }) => {
  const { themeMode } = useContext(AppContext);
  const theme = getThemeColors(themeMode);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  if (!movie) return null;

  const posterUri = movie.posterUrl || movie.poster || movie.backdropUrl || movie.backdrop || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600';
  const displayYear = movie.releaseYear || movie.year || '2024';

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true
    }).start();
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.88}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => navigation?.navigate('Detail', { movie })}
        onLongPress={() => {
          if (onLongPress) {
            onLongPress(movie);
          }
        }}
        delayLongPress={350}
      >
        <Image
          source={{ uri: posterUri }}
          style={styles.poster}
          resizeMode="cover"
        />
        <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
          {movie.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.rating}>⭐ {movie.rating || '8.5'}</Text>
          <Text style={[styles.year, { color: theme.textMuted }]}>{displayYear}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH
  },
  poster: {
    width: '100%',
    height: CARD_WIDTH * 1.5,
    borderRadius: 8,
    backgroundColor: '#1E1E22'
  },
  title: {
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
  rating: {
    color: '#D4AF37',
    fontSize: 10,
    fontWeight: '700'
  },
  year: {
    fontSize: 10
  }
});