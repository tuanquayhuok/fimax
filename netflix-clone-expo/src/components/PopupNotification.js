import React, { useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform
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
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (popupNotification) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true
        })
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
    }
  }, [popupNotification]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 180,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true
      })
    ]).start(() => {
      hideNotificationPopup();
    });
  };

  const handleWatchNow = () => {
    if (popupNotification?.movie) {
      setActiveMovieForPlayer(popupNotification.movie);
    }
    handleClose();
  };

  if (!popupNotification) return null;

  const movie = popupNotification.movie;

  return (
    <Modal
      visible={!!popupNotification}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleClose}
        />

        <Animated.View
          style={[
            styles.dialogContainer,
            {
              backgroundColor: theme.isLight ? '#FFFFFF' : '#16161A',
              borderColor: theme.isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)',
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Header Image / Poster Banner */}
          {movie?.backdropUrl || movie?.posterUrl ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: movie.backdropUrl || movie.posterUrl }}
                style={styles.headerImage}
                resizeMode="cover"
              />
              <View style={styles.imageGradientOverlay} />
              <View style={[styles.badgeTag, { backgroundColor: accentColor }]}>
                <Ionicons name="film" size={11} color="#FFF" style={{ marginRight: 4 }} />
                <Text style={styles.badgeTagText}>PHIM MỚI CHIẾU RẠP</Text>
              </View>
            </View>
          ) : (
            <View style={[styles.iconHeader, { backgroundColor: `${accentColor}18` }]}>
              <View style={[styles.iconCircle, { backgroundColor: accentColor }]}>
                <Ionicons name="notifications" size={26} color="#FFFFFF" />
              </View>
              <Text style={[styles.appBrandText, { color: accentColor }]}>FIMAX CINEMA PRO</Text>
            </View>
          )}

          {/* Close Button Top Right */}
          <TouchableOpacity
            style={styles.closeRoundBtn}
            onPress={handleClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Dialog Body */}
          <View style={styles.body}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              {popupNotification.title || 'Thông Báo FIMAX'}
            </Text>

            <Text style={[styles.message, { color: theme.textSecondary }]}>
              {popupNotification.message}
            </Text>

            {/* Movie Feature Badges */}
            {movie && (
              <View style={styles.tagsRow}>
                {movie.rating && (
                  <View style={styles.tagPill}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.tagPillText}>{movie.rating}</Text>
                  </View>
                )}
                {movie.releaseYear && (
                  <View style={styles.tagPill}>
                    <Text style={styles.tagPillText}>{movie.releaseYear}</Text>
                  </View>
                )}
                <View style={[styles.tagPill, { borderColor: accentColor }]}>
                  <Text style={[styles.tagPillText, { color: accentColor, fontWeight: '700' }]}>4K ULTRA HD</Text>
                </View>
                <View style={styles.tagPill}>
                  <Text style={styles.tagPillText}>Dolby Atmos</Text>
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonGroup}>
              {movie ? (
                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: accentColor }]}
                  activeOpacity={0.85}
                  onPress={handleWatchNow}
                >
                  <Ionicons name="play" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.primaryBtnText}>Xem Phim Ngay</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: accentColor }]}
                  activeOpacity={0.85}
                  onPress={handleClose}
                >
                  <Text style={styles.primaryBtnText}>Tuyệt Vời</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.secondaryBtn,
                  {
                    backgroundColor: theme.isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'
                  }
                ]}
                activeOpacity={0.8}
                onPress={handleClose}
              >
                <Text style={[styles.secondaryBtnText, { color: theme.textSecondary }]}>
                  Để Sau
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22
  },
  dialogContainer: {
    width: Math.min(width - 40, 360),
    borderRadius: 22,
    borderWidth: 1.2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.6,
    shadowRadius: 28,
    elevation: 20
  },
  imageContainer: {
    width: '100%',
    height: 165,
    position: 'relative',
    backgroundColor: '#000'
  },
  headerImage: {
    width: '100%',
    height: '100%'
  },
  imageGradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: 'rgba(22, 22, 26, 0.6)'
  },
  badgeTag: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  badgeTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  iconHeader: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6
  },
  appBrandText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1
  },
  closeRoundBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  body: {
    padding: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24
  },
  message: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 14,
    paddingHorizontal: 6
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 18
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  tagPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600'
  },
  buttonGroup: {
    width: '100%',
    gap: 10,
    marginTop: 4
  },
  primaryBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  secondaryBtn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 12
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '600'
  }
});
