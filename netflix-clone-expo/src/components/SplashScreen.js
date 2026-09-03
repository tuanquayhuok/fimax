import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Image, Dimensions, StatusBar } from 'react-native';

const { width } = Dimensions.get('window');

export const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    // 1. Smooth Fade-in & Scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true
      })
    ]).start();

    // 2. Guaranteed Transition to Main App after 1.4s
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true
      }).start(() => {
        if (onFinish) onFinish();
      });
    }, 1400);

    // 3. Failsafe timeout to prevent any stuck state
    const failsafe = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2200);

    return () => {
      clearTimeout(timer);
      clearTimeout(failsafe);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Image
          source={require('../../assets/icon.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        
        <View style={styles.textRow}>
          <Text style={styles.logoRed}>F</Text>
          <Text style={styles.logoWhite}>IMAX</Text>
          <Text style={styles.badge}>CINEMA</Text>
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
  logoImage: {
    width: 140,
    height: 140,
    borderRadius: 28,
    marginBottom: 16
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2
  },
  logoRed: {
    fontSize: 38,
    fontWeight: '900',
    color: '#E50914',
    letterSpacing: 1
  },
  logoWhite: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2
  },
  badge: {
    backgroundColor: '#E50914',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
    overflow: 'hidden'
  },
  tagline: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 10,
    textTransform: 'uppercase'
  }
});
