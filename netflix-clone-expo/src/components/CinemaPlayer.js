import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, StatusBar, Platform, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { AppContext } from '../context/AppContext';

const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
const QUALITY_OPTIONS = ['1080p', '720p', '360p'];

export const CinemaPlayer = ({ visible, movie, onClose }) => {
  const { updateProgress, continueWatching, accentColor } = useContext(AppContext);
  const videoRef = useRef(null);

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const isLandscape = dimensions.width > dimensions.height;

  const [status, setStatus] = useState({});
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [selectedSpeed, setSelectedSpeed] = useState(1.0);
  const [selectedSubtitle, setSelectedSubtitle] = useState('Tiếng Việt');
  const [selectedAudio, setSelectedAudio] = useState('Gốc');
  const [activeSheet, setActiveSheet] = useState(null);

  // Auto-listen to screen dimension / orientation changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    // Unlock all orientations when player opens
    ScreenOrientation.unlockAsync().catch(() => {});

    return () => {
      subscription?.remove();
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (visible && movie) {
      const saved = continueWatching.find(i => i.movieId === movie.id);
      if (saved && saved.currentTime > 10 && videoRef.current) {
        videoRef.current.setPositionAsync(saved.currentTime * 1000);
      }
    }
  }, [visible, movie]);

  useEffect(() => {
    let timer;
    if (showControls && isPlaying && !isMiniPlayer) {
      timer = setTimeout(() => setShowControls(false), 4500);
    }
    return () => clearTimeout(timer);
  }, [showControls, isPlaying, isMiniPlayer]);

  if (!movie) return null;
  const currentSource = movie.videoSources?.[selectedQuality] || movie.videoSources?.['1080p'] || movie.videoSources?.['auto'] || Object.values(movie.videoSources || {})[0] || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  const handleClose = async () => {
    try {
      if (videoRef.current) {
        await videoRef.current.stopAsync();
      }
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    } catch (e) {}
    setIsMiniPlayer(false);
    onClose();
  };

  const toggleOrientation = async () => {
    try {
      if (isLandscape) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      }
    } catch (e) {
      // Fallback
    }
  };

  const toggleMiniPlayer = () => {
    if (!isMiniPlayer && isLandscape) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
    }
    setIsMiniPlayer(prev => !prev);
  };

  const togglePlayPause = async () => {
    if (!videoRef.current) return;
    if (status.isPlaying) {
      await videoRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await videoRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const handleSeek = async (seconds) => {
    if (!videoRef.current || !status.positionMillis) return;
    const newPos = Math.max(0, Math.min(status.durationMillis || 0, status.positionMillis + seconds * 1000));
    await videoRef.current.setPositionAsync(newPos);
  };

  const onPlaybackStatusUpdate = (newStatus) => {
    setStatus(newStatus);
    if (newStatus.isLoaded) {
      setIsPlaying(newStatus.isPlaying);
      const curSec = newStatus.positionMillis / 1000;
      const durSec = (newStatus.durationMillis || movie.durationSeconds || 7200000) / 1000;
      if (Math.round(curSec) % 10 === 0 || newStatus.didJustFinish) {
        updateProgress(movie.id, curSec, durSec, selectedQuality, newStatus.didJustFinish);
      }
    }
  };

  const formatTime = (millis) => {
    if (!millis) return '00:00';
    const totalSec = Math.floor(millis / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercentage = status.durationMillis ? (status.positionMillis / status.durationMillis) * 100 : 0;

  // 1. Mini-Player PiP Floating View (Khi người dùng thu nhỏ màn hình để lướt app)
  if (isMiniPlayer) {
    return (
      <View style={styles.miniPlayerContainer} pointerEvents="box-none">
        <View style={styles.miniCard}>
          <TouchableOpacity activeOpacity={0.9} style={styles.miniVideoWrap} onPress={() => setIsMiniPlayer(false)}>
            <Video
              ref={videoRef}
              source={{ uri: currentSource }}
              rate={selectedSpeed}
              volume={1.0}
              resizeMode={ResizeMode.COVER}
              shouldPlay={isPlaying}
              onPlaybackStatusUpdate={onPlaybackStatusUpdate}
              style={styles.miniVideo}
            />
            <View style={styles.miniExpandOverlay}>
              <Ionicons name="expand" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.miniInfoWrap} activeOpacity={0.8} onPress={() => setIsMiniPlayer(false)}>
            <Text style={styles.miniTitle} numberOfLines={1}>{movie.title}</Text>
            <Text style={styles.miniMeta}>{formatTime(status.positionMillis)} / {formatTime(status.durationMillis)}</Text>
          </TouchableOpacity>

          <View style={styles.miniActions}>
            <TouchableOpacity style={styles.miniBtn} onPress={togglePlayPause}>
              <Ionicons name={isPlaying ? "pause" : "play"} size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.miniBtn} onPress={handleClose}>
              <Ionicons name="close" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // 2. Fullscreen / Auto-Rotating Cinema Player Modal
  return (
    <Modal
      visible={visible && !isMiniPlayer}
      animationType="fade"
      supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
      onRequestClose={handleClose}
    >
      <StatusBar hidden />
      <View style={[styles.container, { width: dimensions.width, height: dimensions.height }]}>
        {/* Video Player */}
        <Video
          ref={videoRef}
          source={{ uri: currentSource }}
          rate={selectedSpeed}
          volume={1.0}
          resizeMode={isLandscape ? ResizeMode.COVER : ResizeMode.CONTAIN}
          shouldPlay={true}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          style={styles.video}
        />

        {/* Tap to Toggle Controls */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => setShowControls(prev => !prev)}
        />

        {/* Floating Quick Close if controls are hidden */}
        {!showControls && (
          <TouchableOpacity
            style={styles.floatingCloseBtn}
            activeOpacity={0.8}
            onPress={handleClose}
          >
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* Overlay Controls */}
        {showControls && (
          <View style={[styles.controlsOverlay, isLandscape && styles.controlsOverlayLandscape]} pointerEvents="box-none">
            {/* Top Bar */}
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.closePlayerBtn}
                activeOpacity={0.8}
                onPress={handleClose}
              >
                <Ionicons name="close" size={22} color="#FFFFFF" />
                <Text style={styles.closePlayerText}>ĐÓNG</Text>
              </TouchableOpacity>

              <View style={styles.movieHeaderInfo}>
                <Text style={styles.playerMovieTitle} numberOfLines={1}>{movie.title}</Text>
                <Text style={styles.playerMovieMeta}>FIMAX Cinema 4K • {selectedQuality} • {selectedSpeed}x</Text>
              </View>

              <View style={styles.topRightControls}>
                {/* Mini Player / Picture-in-Picture Button */}
                <TouchableOpacity style={styles.topBtn} onPress={toggleMiniPlayer}>
                  <Ionicons name="contract-outline" size={18} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Manual Screen Rotate Button */}
                <TouchableOpacity style={styles.topBtn} onPress={toggleOrientation}>
                  <Ionicons name={isLandscape ? "phone-portrait-outline" : "phone-landscape-outline"} size={18} color="#D4AF37" />
                </TouchableOpacity>

                {/* Quality Button */}
                <TouchableOpacity style={styles.topBtn} onPress={() => setActiveSheet('quality')}>
                  <Text style={styles.topBtnText}>{selectedQuality}</Text>
                </TouchableOpacity>

                {/* Audio/Subtitle Button */}
                <TouchableOpacity style={styles.topBtn} onPress={() => setActiveSheet('audio_sub')}>
                  <Ionicons name="chatbubbles-outline" size={18} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Speed Button */}
                <TouchableOpacity style={styles.topBtn} onPress={() => setActiveSheet('speed')}>
                  <Ionicons name="speedometer-outline" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Center Controls */}
            <View style={styles.centerControls}>
              <TouchableOpacity style={styles.seekBtn} onPress={() => handleSeek(-10)}>
                <Ionicons name="play-back" size={isLandscape ? 38 : 32} color="#FFFFFF" />
                <Text style={styles.seekText}>-10s</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.playPauseBtn, { backgroundColor: accentColor }]} onPress={togglePlayPause}>
                <Ionicons name={isPlaying ? "pause" : "play"} size={isLandscape ? 48 : 42} color="#FFFFFF" style={{ marginLeft: isPlaying ? 0 : 3 }} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.seekBtn} onPress={() => handleSeek(10)}>
                <Ionicons name="play-forward" size={isLandscape ? 38 : 32} color="#FFFFFF" />
                <Text style={styles.seekText}>+10s</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Timeline */}
            <View style={styles.bottomBar}>
              <View style={styles.timelineRow}>
                <Text style={styles.timeText}>{formatTime(status.positionMillis)}</Text>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${progressPercentage}%`, backgroundColor: accentColor }]} />
                </View>
                <Text style={styles.timeText}>{formatTime(status.durationMillis)}</Text>
                <TouchableOpacity style={styles.rotateInlineBtn} onPress={toggleOrientation}>
                  <Ionicons name={isLandscape ? "contract" : "expand"} size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.bottomFooter}>
                <Text style={styles.badgeFooter}>Âm thanh: {selectedAudio} | Phụ đề: {selectedSubtitle}</Text>
                <Text style={styles.badgeCallback}>{isLandscape ? '⤢ Chế độ Chiếu Rạp Ngang' : '📱 Tự động xoay khi để ngang'}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Quality Sheet */}
        {activeSheet === 'quality' && (
          <View style={styles.sheetOverlay}>
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>Chọn Độ Phân Giải Video</Text>
              {QUALITY_OPTIONS.map(q => (
                <TouchableOpacity
                  key={q}
                  style={[styles.sheetItem, selectedQuality === q && styles.sheetItemActive]}
                  onPress={() => { setSelectedQuality(q); setActiveSheet(null); }}
                >
                  <Text style={[styles.sheetItemText, selectedQuality === q && styles.sheetItemTextActive]}>{q}</Text>
                  {selectedQuality === q && <Ionicons name="checkmark" size={20} color={accentColor} />}
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.sheetCloseBtn} onPress={() => setActiveSheet(null)}>
                <Text style={styles.sheetCloseText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Audio & Subtitle Sheet */}
        {activeSheet === 'audio_sub' && (
          <View style={styles.sheetOverlay}>
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>Âm Thanh & Phụ Đề</Text>
              <Text style={styles.sheetSubTitle}>ÂM THANH</Text>
              {['Gốc (Dolby Atmos)', 'Thuyết minh Tiếng Việt', 'Lồng tiếng Việt'].map(a => (
                <TouchableOpacity key={a} style={[styles.sheetItem, selectedAudio === a && styles.sheetItemActive]} onPress={() => setSelectedAudio(a)}>
                  <Text style={[styles.sheetItemText, selectedAudio === a && styles.sheetItemTextActive]}>{a}</Text>
                  {selectedAudio === a && <Ionicons name="checkmark" size={18} color={accentColor} />}
                </TouchableOpacity>
              ))}
              <Text style={[styles.sheetSubTitle, { marginTop: 12 }]}>PHỤ ĐỀ</Text>
              {['Tiếng Việt', 'English (CC)', 'Tắt phụ đề'].map(s => (
                <TouchableOpacity key={s} style={[styles.sheetItem, selectedSubtitle === s && styles.sheetItemActive]} onPress={() => setSelectedSubtitle(s)}>
                  <Text style={[styles.sheetItemText, selectedSubtitle === s && styles.sheetItemTextActive]}>{s}</Text>
                  {selectedSubtitle === s && <Ionicons name="checkmark" size={18} color={accentColor} />}
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.sheetCloseBtn} onPress={() => setActiveSheet(null)}>
                <Text style={styles.sheetCloseText}>Hoàn tất</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Speed Sheet */}
        {activeSheet === 'speed' && (
          <View style={styles.sheetOverlay}>
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>Tốc Độ Phát Video</Text>
              {SPEED_OPTIONS.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.sheetItem, selectedSpeed === s && styles.sheetItemActive]}
                  onPress={async () => {
                    setSelectedSpeed(s);
                    if (videoRef.current) await videoRef.current.setRateAsync(s, true);
                    setActiveSheet(null);
                  }}
                >
                  <Text style={[styles.sheetItemText, selectedSpeed === s && styles.sheetItemTextActive]}>
                    {s === 1.0 ? '1.0x (Bình thường)' : `${s}x`}
                  </Text>
                  {selectedSpeed === s && <Ionicons name="checkmark" size={18} color={accentColor} />}
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.sheetCloseBtn} onPress={() => setActiveSheet(null)}>
                <Text style={styles.sheetCloseText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  video: {
    width: '100%',
    height: '100%'
  },
  floatingCloseBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 48 : 24,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 9999
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 20,
    paddingBottom: 20
  },
  controlsOverlayLandscape: {
    paddingHorizontal: 36,
    paddingTop: 20,
    paddingBottom: 16
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  closePlayerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    gap: 4
  },
  closePlayerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  movieHeaderInfo: {
    flex: 1,
    marginHorizontal: 12
  },
  playerMovieTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  playerMovieMeta: {
    color: '#8E8E93',
    fontSize: 11
  },
  topRightControls: {
    flexDirection: 'row',
    gap: 8
  },
  topBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 36
  },
  playPauseBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16
  },
  seekBtn: {
    alignItems: 'center',
    gap: 2
  },
  seekText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold'
  },
  bottomBar: {
    paddingBottom: 6
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600'
  },
  progressBarBackground: {
    flex: 1,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3
  },
  rotateInlineBtn: {
    padding: 4
  },
  bottomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  badgeFooter: {
    color: '#8E8E93',
    fontSize: 11
  },
  badgeCallback: {
    color: '#D4AF37',
    fontSize: 11,
    fontWeight: 'bold'
  },
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  sheet: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  sheetTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center'
  },
  sheetSubTitle: {
    color: '#D4AF37',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6
  },
  sheetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)'
  },
  sheetItemActive: {
    backgroundColor: 'rgba(229, 9, 20, 0.15)',
    paddingHorizontal: 8,
    borderRadius: 6
  },
  sheetItemText: {
    color: '#8E8E93',
    fontSize: 14
  },
  sheetItemTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  sheetCloseBtn: {
    backgroundColor: '#2C2C2E',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16
  },
  sheetCloseText: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  // Mini Player Picture-in-Picture styles
  miniPlayerContainer: {
    position: 'absolute',
    bottom: 74,
    left: 12,
    right: 12,
    zIndex: 99999
  },
  miniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
    gap: 10
  },
  miniVideoWrap: {
    width: 80,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative'
  },
  miniVideo: {
    width: '100%',
    height: '100%'
  },
  miniExpandOverlay: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 4,
    padding: 2
  },
  miniInfoWrap: {
    flex: 1
  },
  miniTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  miniMeta: {
    color: '#8E8E93',
    fontSize: 10,
    marginTop: 2
  },
  miniActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  miniBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  }
});