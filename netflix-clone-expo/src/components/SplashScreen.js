import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const letterSpacingAnim = useRef(new Animated.Value(2)).current;
  const lineScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Clean, Minimalist Apple/Netflix Cinematic Logo Reveal
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true
      }),
      Animated.timing(letterSpacingAnim, {
        toValue: 6,
        duration: 1800,
        useNativeDriver: false
      }),
      Animated.timing(lineScale, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true
      })
    ]).start();

    // Smooth elegant exit
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }).start(() => {
        onFinish();
      });
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoRow}>
          <Text style={styles.logoRed}>F</Text>
          <Text style={styles.logoWhite}>IMAX</Text>
        </View>

        <Animated.View style={[styles.accentLine, { transform: [{ scaleX: lineScale }] }]} />

        <Animated.Text style={[styles.subtitle, { letterSpacing: letterSpacingAnim }]}>
          CINEMA
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999
  },
  content: {
    alignItems: 'center'
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  logoRed: {
    fontSize: 52,
    fontWeight: '900',
    color: '#E50914',
    letterSpacing: 2
  },
  logoWhite: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3
  },
  accentLine: {
    width: 120,
    height: 1.5,
    backgroundColor: '#E50914',
    marginVertical: 10,
    borderRadius: 1
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase'
  }
});