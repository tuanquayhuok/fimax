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
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';

const { width } = Dimensions.get('window');

export const PopupNotification = () => {
  const { popupNotification, hideNotificationPopup, setActiveMovieForPlayer, themeMode, accentColor } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  const translateY = useRef(new Animated.Value(-150)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    if (popupNotification) {
      // Slide Down & Fade In
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: Platform.OS === 'ios' ? 50 : 20,
          friction: 8,
          tension: 60,
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
            backgroundColor: theme.isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(24, 24, 28, 0.96)',
            borderColor: theme.isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)'
          }
        ]}
        activeOpacity={0.9}
        onPress={handlePress}
      >
        {/* Left Icon / Poster */}
        {popupNotification.movie?.posterUrl ? (
          <Image
            source={{ uri: popupNotification.movie.posterUrl }}
            style={styles.poster}
          />
        ) : (
          <View style={[styles.iconWrap, { backgroundColor: `${accentColor}25` }]}>
            <Ionicons
              name={popupNotification.type === 'vip' ? 'sparkles' : 'notifications'}
              size={20}
              color={accentColor}
            />
          </View>
        )}

        {/* Content */}
        <View style={styles.contentWrap}>
          <View style={styles.headerRow}>
            <Text style={[styles.appName, { color: accentColor }]}>FIMAX NOTIFICATION</Text>
            <Text style={[styles.timeTag, { color: theme.textMuted }]}>Vừa xong</Text>
          </View>
          <Text
            style={[styles.title, { color: theme.textPrimary }]}
            numberOfLines={1}
          >
            {popupNotification.title}
          </Text>
          <Text
            style={[styles.message, { color: theme.textSecondary }]}
            numberOfLines={2}
          >
            {popupNotification.message}
          </Text>
        </View>

        {/* Dismiss Button */}
        <TouchableOpacity
          onPress={handleDismiss}
          style={styles.closeBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close-circle" size={20} color={theme.textMuted} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 14,
    right: 14,
    zIndex: 999999,
    alignItems: 'center'
  },
  banner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 12,
    gap: 12
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  poster: {
    width: 40,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#333'
  },
  contentWrap: {
    flex: 1,
    gap: 2
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2
  },
  appName: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  timeTag: {
    fontSize: 10
  },
  title: {
    fontSize: 13,
    fontWeight: '700'
  },
  message: {
    fontSize: 12,
    lineHeight: 16
  },
  closeBtn: {
    padding: 4
  }
});
