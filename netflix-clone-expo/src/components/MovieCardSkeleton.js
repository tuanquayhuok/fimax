import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ShimmerSkeleton } from './ShimmerSkeleton';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.32;

export const MovieCardSkeleton = () => {
  return (
    <View style={styles.card}>
      {/* Poster Skeleton */}
      <ShimmerSkeleton width={CARD_WIDTH} height={CARD_WIDTH * 1.5} borderRadius={8} />
      {/* Title Bar Skeleton */}
      <ShimmerSkeleton width={CARD_WIDTH * 0.85} height={12} borderRadius={4} style={{ marginTop: 8 }} />
      {/* Meta Bar Skeleton */}
      <ShimmerSkeleton width={CARD_WIDTH * 0.5} height={10} borderRadius={3} style={{ marginTop: 5 }} />
    </View>
  );
};

export const MovieRowSkeleton = () => {
  return (
    <View style={styles.rowContainer}>
      <ShimmerSkeleton width={160} height={18} borderRadius={4} style={{ marginHorizontal: 16, marginBottom: 12 }} />
      <View style={styles.horizontalRow}>
        {[1, 2, 3, 4].map((item) => (
          <MovieCardSkeleton key={item} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginRight: 10
  },
  rowContainer: {
    marginVertical: 14
  },
  horizontalRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10
  }
});
