import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
  Linking
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

function getYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match) return match[1];
  const fallback = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return fallback ? fallback[1] : null;
}

export const TrailerModal = ({
  visible,
  movie,
  trailerUrl,
  onClose,
  accentColor = '#E50914'
}) => {
  const videoRef = useRef(null);
  const [isBuffering, setIsBuffering] = useState(true);
  const [hasError, setHasError] = useState(false);

  const rawTrailerUrl =
    trailerUrl ||
    movie?.trailerUrl ||
    movie?.trailer_url ||
    movie?.trailer ||
    movie?.videoSources?.['1080p'] ||
    movie?.videoSources?.['720p'] ||
    movie?.video_url ||
    'https://www.youtube.com/watch?v=yF2pXRJictA';

  const youtubeId = getYouTubeId(rawTrailerUrl);
  const movieTitle = movie?.title || 'Phim Chiếu Rạp';

  if (!visible) return null;

  const handleOpenExternal = () => {
    if (youtubeId) {
      Linking.openURL(`https://www.youtube.com/watch?v=${youtubeId}`);
    } else if (rawTrailerUrl) {
      Linking.openURL(rawTrailerUrl);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header Bar */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.trailerBadge, { backgroundColor: accentColor }]}>
                <Text style={styles.trailerBadgeText}>TRAILER HD</Text>
              </View>
              <Text style={styles.title} numberOfLines={1}>
                {movieTitle}
              </Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.8}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Video Player Box */}
          <View style={styles.videoBox}>
            {/* 1. YOUTUBE EMBED PLAYER (YouTube No-Cookie with strict-origin referrerpolicy) */}
            {youtubeId && Platform.OS === 'web' ? (
              <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#000' }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&playsinline=1&rel=0&enablejsapi=1`}
                  style={{ width: '100%', height: '100%', border: 'none', position: 'absolute', top: 0, left: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  title={`Trailer ${movieTitle}`}
                />
              </div>
            ) : (
              /* 2. DIRECT MEDIA STREAM (MP4 / M3U8) */
              <Video
                ref={videoRef}
                source={{
                  uri:
                    !youtubeId
                      ? rawTrailerUrl
                      : movie?.videoSources?.['1080p'] ||
                        movie?.videoSources?.['720p'] ||
                        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
                }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={true}
                useNativeControls
                style={styles.video}
                onLoadStart={() => setIsBuffering(true)}
                onReadyForDisplay={() => setIsBuffering(false)}
                onError={(e) => {
                  console.warn('Trailer video error:', e);
                  setHasError(true);
                  setIsBuffering(false);
                }}
              />
            )}

            {!youtubeId && isBuffering && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={accentColor} />
                <Text style={styles.loadingText}>Đang nạp video trailer...</Text>
              </View>
            )}

            {!youtubeId && hasError && (
              <View style={styles.errorOverlay}>
                <Ionicons name="alert-circle-outline" size={32} color="#FF3B30" />
                <Text style={styles.errorText}>Không thể phát video trực tiếp.</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={handleOpenExternal}>
                  <Ionicons name="logo-youtube" size={16} color="#FFFFFF" />
                  <Text style={styles.retryBtnText}>Mở trên YouTube</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Footer Quick Action */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.externalLinkBtn} activeOpacity={0.8} onPress={handleOpenExternal}>
              <Ionicons name="logo-youtube" size={16} color="#FF0000" />
              <Text style={styles.externalLinkText}>Xem bản đầy đủ trên YouTube</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  card: {
    width: Math.min(width - 24, 600),
    backgroundColor: '#16161A',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#1B1B20',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
    paddingRight: 8
  },
  trailerBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 4
  },
  trailerBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    flex: 1
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  videoBox: {
    width: '100%',
    height: 280,
    backgroundColor: '#000000',
    position: 'relative'
  },
  video: {
    width: '100%',
    height: '100%'
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600'
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600'
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#CC0000',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  footer: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#141418',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center'
  },
  externalLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  externalLinkText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600'
  }
});
