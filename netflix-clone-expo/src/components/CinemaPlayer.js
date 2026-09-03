import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, StatusBar, Platform, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';

const { width, height } = Dimensions.get('window');
const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
const QUALITY_OPTIONS = ['1080p', '720p', '360p'];

export const CinemaPlayer = ({ visible, movie, onClose }) => {
  const { updateProgress, continueWatching, accentColor } = useContext(AppContext);
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [selectedSpeed, setSelectedSpeed] = useState(1.0);
  const [selectedSubtitle, setSelectedSubtitle] = useState('Tiếng Việt');
  const [selectedAudio, setSelectedAudio] = useState('Gốc');
  const [activeSheet, setActiveSheet] = useState(null);

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
    if (showControls && isPlaying) {
      timer = setTimeout(() => setShowControls(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [showControls, isPlaying]);

  if (!movie) return null;
  const currentSource = movie.videoSources?.[selectedQuality] || movie.videoSources?.['1080p'] || movie.videoSources?.['auto'] || Object.values(movie.videoSources || {})[0] || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  const handleClose = async () => {
    try {
      if (videoRef.current) {
        await videoRef.current.stopAsync();
      }
    } catch (e) {}
    onClose();
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

  return (
    <Modal visible={visible} animationType="fade" supportedOrientations={['portrait', 'landscape']} onRequestClose={handleClose}>
      <StatusBar hidden />
      <View style={styles.container}>
        {/* Main Video Stream */}
        <Video
          ref={videoRef}
          source={{ uri: currentSource }}
          rate={selectedSpeed}
          volume={1.0}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={true}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          style={styles.video}
        />

        {/* Screen Tap Handler to toggle controls */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => setShowControls(prev => !prev)}
        />

        {/* Permanent Quick-Exit Close Button (always visible if controls are hidden) */}
        {!showControls && (
          <TouchableOpacity
            style={styles.floatingCloseBtn}
            activeOpacity={0.8}
            onPress={handleClose}
          >
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* Controls Overlay */}
        {showControls && (
          <View style={styles.controlsOverlay} pointerEvents="box-none">
            {/* Top Bar with Prominent [X ĐÓNG] Button */}
            <View style={styles.topBar}>
              <TouchableOpacity
                style={[styles.closePlayerBtn, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}
                activeOpacity={0.8}
                onPress={handleClose}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
                <Text style={styles.closePlayerText}>ĐÓNG</Text>
              </TouchableOpacity>

              <View style={styles.movieHeaderInfo}>
                <Text style={styles.playerMovieTitle} numberOfLines={1}>{movie.title}</Text>
                <Text style={styles.playerMovieMeta}>FIMAX Cinema 4K • {selectedQuality} • {selectedSpeed}x</Text>
              </View>

              <View style={styles.topRightControls}>
                <TouchableOpacity style={styles.topBtn} onPress={() => setActiveSheet('quality')}>
                  <Text style={styles.topBtnText}>{selectedQuality}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.topBtn} onPress={() => setActiveSheet('audio_sub')}>
                  <Ionicons name="chatbubbles-outline" size={18} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.topBtn} onPress={() => setActiveSheet('speed')}>
                  <Ionicons name="speedometer-outline" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Center Playback Controls */}
            <View style={styles.centerControls}>
              <TouchableOpacity style={styles.seekBtn} onPress={() => handleSeek(-10)}>
                <Ionicons name="play-back" size={32} color="#FFFFFF" />
                <Text style={styles.seekText}>-10s</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.playPauseBtn, { backgroundColor: accentColor }]} onPress={togglePlayPause}>
                <Ionicons name={isPlaying ? "pause" : "play"} size={42} color="#FFFFFF" style={{ marginLeft: isPlaying ? 0 : 3 }} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.seekBtn} onPress={() => handleSeek(10)}>
                <Ionicons name="play-forward" size={32} color="#FFFFFF" />
                <Text style={styles.seekText}>+10s</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Timeline & Progress Bar */}
            <View style={styles.bottomBar}>
              <View style={styles.timelineRow}>
                <Text style={styles.timeText}>{formatTime(status.positionMillis)}</Text>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${progressPercentage}%`, backgroundColor: accentColor }]} />
                </View>
                <Text style={styles.timeText}>{formatTime(status.durationMillis)}</Text>
              </View>

              <View style={styles.bottomFooter}>
                <Text style={styles.badgeFooter}>Âm thanh: {selectedAudio} | Phụ đề: {selectedSubtitle}</Text>
                <Text style={styles.badgeCallback}>📡 FIMAX Live Stream</Text>
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
    width: 42,
    height: 42,
    borderRadius: 21,
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
    paddingHorizontal: 10,
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
    color: '#30D158',
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
  }
});