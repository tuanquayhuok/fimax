import React, { useState, useEffect, useRef } from 'react';
import { Image, View, StyleSheet, Animated } from 'react-native';
import { ShimmerSkeleton } from './ShimmerSkeleton';

const FALLBACK_POSTERS = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&auto=format&fit=crop&q=80'
];

export const CinemaImage = ({ uri, fallbackUri, style, resizeMode = 'cover', blurRadius }) => {
  const [currentUri, setCurrentUri] = useState(uri || fallbackUri);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setCurrentUri(uri || fallbackUri);
    setHasError(false);
    setIsLoaded(false);
    fadeAnim.setValue(0);
  }, [uri, fallbackUri]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      if (fallbackUri && fallbackUri !== currentUri) {
        setCurrentUri(fallbackUri);
      } else {
        const randomFallback = FALLBACK_POSTERS[Math.floor(Math.random() * FALLBACK_POSTERS.length)];
        setCurrentUri(randomFallback);
      }
    }
  };

  const handleLoadSuccess = () => {
    setIsLoaded(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true
    }).start();
  };

  const imageSource = currentUri
    ? {
        uri: currentUri,
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
        }
      }
    : { uri: FALLBACK_POSTERS[0] };

  return (
    <View style={[styles.container, style]}>
      {/* Facebook-style Shimmer Skeleton Frame */}
      {!isLoaded && (
        <ShimmerSkeleton style={StyleSheet.absoluteFillObject} />
      )}

      {/* Actual Image with smooth fade-in */}
      <Animated.Image
        source={imageSource}
        style={[StyleSheet.absoluteFill, style, { opacity: fadeAnim }]}
        resizeMode={resizeMode}
        blurRadius={blurRadius}
        onLoad={handleLoadSuccess}
        onError={handleError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#16171B',
    position: 'relative'
  }
});