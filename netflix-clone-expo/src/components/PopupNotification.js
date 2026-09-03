import React, { useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  PanResponder
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';

const { width } = Dimensions.get('window');

export const PopupNotification = () => {
  const {
    popupNotification,
    hideNotificationPopup,
    setActiveMovieForPlayer,
    themeMode,
    accentColor
  } = useContext(AppContext);

  const theme = getThemeColors(themeMode);
  const translateY = useRef(new Animated.Value(-150)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    if (popupNotification) {
      // Slide Down & Fade In like native iOS Push Notification
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: Platform.OS === 'ios' ? 52 : 24,
          friction: 8,
          tension: 70,
          useNativeDriver: true
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true
        })
      ]).start();

      // Auto dismiss after 5 seconds
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        handleDismiss();
      }, 5000);
    } else {
      handleDismiss();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [popupNotification]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -150,
        duration: 250,
        useNativeDriver: true
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => {
      hideNotificationPopup();
    });
  };

  const handlePress = () => {
    if (popupNotification?.movie) {
      setActiveMovieForPlayer(popupNotification.movie);
    }
    handleDismiss();
  };

  if (!popupNotification) return null;

  const movie = popupNotification.movie;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity
        }
      ]}
    >
      <TouchableOpacity
        style={[
          styles.banner,
          {
            backgroundColor: theme.isLight ? 'rgba(250, 250, 252, 0.96)' : 'rgba(28, 28, 32, 0.95)',
            borderColor: theme.isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.18)'
          }
        ]}
        activeOpacity={0.92}
        onPress={handlePress}
      >
        {/* Left App Icon / Movie Poster */}
        <View style={styles.iconContainer}>
          {movie?.posterUrl || movie?.backdropUrl ? (
            <Image
              source={{ uri: movie.posterUrl || movie.backdropUrl }}
              style={styles.posterThumb}
            />
          ) : (
            <View style={[styles.appIconWrap, { backgroundColor: accentColor }]}>
              <Text style={styles.appIconLetter}>F</Text>
            </View>
          )}
        </View>

        {/* Content Body */}
        <View style={styles.textWrap}>
          {/* Top Header Row: App Name + Time */}
          <View style={styles.headerRow}>
            <View style={styles.appNameRow}>
              <Text style={[styles.appName, { color: theme.textPrimary }]}>
                FIMAX Cinema News
              </Text>
            </View>
            <Text style={[styles.timeText, { color: theme.textMuted }]}>
              Vừa xong
            </Text>
          </View>

          {/* Title & Message */}
          <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
            {popupNotification.title}
          </Text>
          <Text style={[styles.message, { color: theme.textSecondary }]} numberOfLines={2}>
            {popupNotification.message}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    zIndex: 999999,
    alignItems: 'center'
  },
  banner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 18,
    borderWidth: 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 14,
    gap: 12
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  appIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3
  },
  appIconLetter: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900'
  },
  posterThumb: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#333'
  },
  textWrap: {
    flex: 1,
    gap: 2
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2
  },
  appNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  appName: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2
  },
  timeText: {
    fontSize: 11,
    fontWeight: '500'
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 17
  },
  message: {
    fontSize: 12.5,
    lineHeight: 16.5
  }
});
