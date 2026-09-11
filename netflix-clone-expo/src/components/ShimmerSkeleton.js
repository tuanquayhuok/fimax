import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const ShimmerSkeleton = ({ width = '100%', height = '100%', borderRadius = 8, style }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1100,
          useNativeDriver: true
        })
      ])
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.35, 0.75, 0.35]
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, 60]
  });

  return (
    <View style={[styles.skeletonContainer, { width, height, borderRadius }, style]}>
      <Animated.View
        style={[
          styles.shimmerWave,
          {
            opacity,
            transform: [{ translateX }]
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    backgroundColor: '#1C1D22',
    overflow: 'hidden',
    position: 'relative'
  },
  shimmerWave: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.12)'
  }
});
