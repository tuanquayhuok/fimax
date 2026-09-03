import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, StatusBar, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SplashScreen = ({ onFinish }) => {
  // Animated values
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;
  const lightSweep = useRef(new Animated.Value(-width * 0.8)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglocationY = useRef(new Animated.Value(15)).current;
  const lineExpand = useRef(new Animated.Value(0)).current;
  const exitFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Cinematic Lens Glow Pulse Loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(glowPulse, {
          toValue: 0.4,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    ).start();

    // 2. Main Cinematic Sequence
    Animated.sequence([
      // Step 1: Logo Zoom & Fade In with spring tension
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true
        }),
        Animated.timing(lineExpand, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        })
      ]),

      // Step 2: Light Flare Beam Sweeping across FIMAX logo
      Animated.parallel([
        Animated.timing(lightSweep, {
          toValue: width * 0.8,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        }),
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true
        }),
        Animated.timing(taglocationY, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        })
      ])
    ]).start();

    // 3. Smooth Cinematic Exit Transition after 2.8s
    const timer = setTimeout(() => {
      Animated.timing(exitFade, {
        toValue: 0,
        duration: 450,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }).start(() => {
        onFinish();
      });
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const glowScale = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1.25]
  });

  const glowOpacity = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.65]
  });

  return (
    <Animated.View style={[styles.container, { opacity: exitFade }]}>
      <StatusBar hidden />

      {/* Ambient Cinema Lens Glow in background */}
      <Animated.View
        style={[
          styles.ambientGlow,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }]
          }
        ]}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }]
          }
        ]}
      >
        {/* Cinema Projector Flare Ring */}
        <View style={styles.projectorRing} />

        {/* FIMAX Core Typography */}
        <View style={styles.logoContainer}>
          <View style={styles.logoRow}>
            <Text style={styles.logoRed}>F</Text>
            <Text style={styles.logoWhite}>IMAX</Text>
          </View>

          {/* Sweeping Light Sheen Effect */}
          <Animated.View
            style={[
              styles.lightBeam,
              { transform: [{ translateX: lightSweep }] }
            ]}
          />
        </View>

        {/* Cinematic Laser Line */}
        <Animated.View
          style={[
            styles.laserLine,
            { transform: [{ scaleX: lineExpand }] }
          ]}
        />

        {/* Tagline & Quality Badges */}
        <Animated.View
          style={[
            styles.taglineWrap,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglocationY }]
            }
          ]}
        >
          <Text style={styles.tagline}>RẠP PHIM ĐIỆN ẢNH ĐỈNH CAO</Text>
          <View style={styles.badgeRow}>
            <Text style={styles.badgeText}>4K ULTRA HD</Text>
            <Text style={styles.badgeDot}>•</Text>
            <Text style={styles.badgeText}>DOLBY ATMOS</Text>
            <Text style={styles.badgeDot}>•</Text>
            <Text style={styles.badgeText}>HDR10</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
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
  ambientGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(229, 9, 20, 0.25)',
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 60
  },
  content: {
    alignItems: 'center',
    position: 'relative'
  },
  projectorRing: {
    position: 'absolute',
    top: -20,
    width: 260,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(229, 9, 20, 0.15)',
    transform: [{ scaleX: 1.4 }]
  },
  logoContainer: {
    overflow: 'hidden',
    position: 'relative',
    paddingHorizontal: 20,
    paddingVertical: 6
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  logoRed: {
    fontSize: 64,
    fontWeight: '900',
    color: '#E50914',
    letterSpacing: 2,
    textShadowColor: 'rgba(229, 9, 20, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20
  },
  logoWhite: {
    fontSize: 54,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15
  },
  lightBeam: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    transform: [{ skewX: '-25deg' }]
  },
  laserLine: {
    width: 180,
    height: 2,
    backgroundColor: '#E50914',
    marginVertical: 12,
    borderRadius: 1,
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8
  },
  taglineWrap: {
    alignItems: 'center',
    gap: 6
  },
  tagline: {
    color: '#D4AF37',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 3,
    textTransform: 'uppercase'
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  badgeText: {
    color: '#8E8E93',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1
  },
  badgeDot: {
    color: '#E50914',
    fontSize: 10,
    fontWeight: '900'
  }
});