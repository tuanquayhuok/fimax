import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, StatusBar } from 'react-native';

const { width } = Dimensions.get('window');

export const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    // 1. Smooth Fade-in & Scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true
      })
    ]).start();

    // 2. Guaranteed Transition to Main App after 1.2s
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        if (onFinish) onFinish();
      });
    }, 1200);

    // 3. Failsafe timeout
    const failsafe = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1800);

    return () => {
      clearTimeout(timer);
      clearTimeout(failsafe);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0C" />
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.textRow}>
          <Text style={styles.logoRed}>F</Text>
          <Text style={styles.logoWhite}>IMAX</Text>
        </View>

        <View style={styles.badgeWrap}>
          <Text style={styles.badge}>CINEMA PRO</Text>
        </View>

        <Text style={styles.tagline}>RẠP PHIM ĐIỆN ẢNH TRỰC TUYẾN</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0A0A0C',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 4
  },
  logoRed: {
    fontSize: 54,
    fontWeight: '900',
    color: '#E50914',
    letterSpacing: 1
  },
  logoWhite: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3
  },
  badgeWrap: {
    marginTop: 4,
    marginBottom: 14
  },
  badge: {
    backgroundColor: '#E50914',
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    letterSpacing: 2,
    overflow: 'hidden'
  },
  tagline: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase'
  }
});
