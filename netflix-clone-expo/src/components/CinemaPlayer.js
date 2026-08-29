import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { AppContext } from '../context/AppContext';

const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
const QUALITY_OPTIONS = ['1080p', '720p', '360p'];

export const CinemaPlayer = ({ visible, movie, onClose }) => {
  const { updateProgress, continueWatching } = useContext(AppContext);
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
    if (showControls && isPlaying) timer = setTimeout(() => setShowControls(false), 4000);
    return () => clearTimeout(timer);
  }, [showControls, isPlaying]);

  if (!movie) return null;
  const currentSource = movie.videoSources?.[selectedQuality] || movie.videoSources?.['1080p'] || Object.values(movie.videoSources || {})[0];

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
    <Modal visible={visible} animationType="fade" supportedOrientations={['portrait', 'landscape']}>
      <StatusBar hidden />
      <View style={styles.container}>
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
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setShowControls(prev => !prev)} />
        {showControls && (
          <View style={styles.controlsOverlay} pointerEvents="box-none">
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
                <Ionicons name="arrow-back" size={26} color={Colors.white} />
              </TouchableOpacity>
              <View style={styles.movieHeaderInfo}>
                <Text style={styles.playerMovieTitle} numberOfLines={1}>{movie.title}</Text>
                <Text style={styles.playerMovieMeta}>Cinema Single • {selectedQuality} • {selectedSpeed}x</Text>
              </View>
              <View style={styles.topRightControls}>
                <TouchableOpacity style={styles.topBtn} onPress={() => setActiveSheet('quality')}>
                  <Text style={styles.topBtnText}>{selectedQuality}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.topBtn} onPress={() => setActiveSheet('audio_sub')}>
                  <Ionicons name="chatbubbles-outline" size={20} color={Colors.white} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.topBtn} onPress={() => setActiveSheet('speed')}>
                  <Ionicons name="speedometer-outline" size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.centerControls}>
              <TouchableOpacity style={styles.seekBtn} onPress={() => handleSeek(-10)}>
                <Ionicons name="play-back" size={32} color={Colors.white} />
                <Text style={styles.seekText}>10s</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.playPauseBtn} onPress={togglePlayPause}>
                <Ionicons name={isPlaying ? "pause" : "play"} size={44} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.seekBtn} onPress={() => handleSeek(10)}>
                <Ionicons name="play-forward" size={32} color={Colors.white} />
                <Text style={styles.seekText}>10s</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bottomBar}>
              <View style={styles.timelineRow}>
                <Text style={styles.timeText}>{formatTime(status.positionMillis)}</Text>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
                </View>
                <Text style={styles.timeText}>{formatTime(status.durationMillis)}</Text>
              </View>
              <View style={styles.bottomFooter}>
                <Text style={styles.badgeFooter}>Âm thanh: {selectedAudio} | Phụ đề: {selectedSubtitle}</Text>
                <Text style={styles.badgeCallback}>📡 Live Webhook Sync</Text>
              </View>
            </View>
          </View>
        )}
        {activeSheet === 'quality' && (
          <View style={styles.sheetOverlay}>
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>Chọn Độ Phân Giải Video</Text>
              {QUALITY_OPTIONS.map(q => (
                <TouchableOpacity key={q} style={[styles.sheetItem, selectedQuality === q && styles.sheetItemActive]} onPress={() => { setSelectedQuality(q); setActiveSheet(null); }}>
                  <Text style={[styles.sheetItemText, selectedQuality === q && styles.sheetItemTextActive]}>{q}</Text>
                  {selectedQuality === q && <Ionicons name="checkmark" size={20} color={Colors.primary} />}
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.sheetCloseBtn} onPress={() => setActiveSheet(null)}>
                <Text style={styles.sheetCloseText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {activeSheet === 'audio_sub' && (
          <View style={styles.sheetOverlay}>
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>Âm Thanh & Phụ Đề</Text>
              <Text style={styles.sheetSubTitle}>ÂM THANH</Text>
              {['Gốc (Dolby Atmos)', 'Thuyết minh Tiếng Việt', 'Lồng tiếng Việt'].map(a => (
                <TouchableOpacity key={a} style={[styles.sheetItem, selectedAudio === a && styles.sheetItemActive]} onPress={() => setSelectedAudio(a)}>
                  <Text style={[styles.sheetItemText, selectedAudio === a && styles.sheetItemTextActive]}>{a}</Text>
                </TouchableOpacity>
              ))}
              <Text style={[styles.sheetSubTitle, { marginTop: 12 }]}>PHỤ ĐỀ</Text>
              {['Tiếng Việt', 'English (CC)', 'Tắt phụ đề'].map(s => (
                <TouchableOpacity key={s} style={[styles.sheetItem, selectedSubtitle === s && styles.sheetItemActive]} onPress={() => setSelectedSubtitle(s)}>
                  <Text style={[styles.sheetItemText, selectedSubtitle === s && styles.sheetItemTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.sheetCloseBtn} onPress={() => setActiveSheet(null)}>
                <Text style={styles.sheetCloseText}>Hoàn tất</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {activeSheet === 'speed' && (
          <View style={styles.sheetOverlay}>
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>Tốc Độ Phát Video</Text>
              {SPEED_OPTIONS.map(s => (
                <TouchableOpacity key={s} style={[styles.sheetItem, selectedSpeed === s && styles.sheetItemActive]} onPress={async () => { setSelectedSpeed(s); if (videoRef.current) await videoRef.current.setRateAsync(s, true); setActiveSheet(null); }}>
                  <Text style={[styles.sheetItemText, selectedSpeed === s && styles.sheetItemTextActive]}>{s === 1.0 ? '1.0x (Bình thường)' : `${s}x`}</Text>
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
  container: { flex: 1, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },
  controlsOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'space-between', padding: 16 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10 },
  iconBtn: { padding: 8 },
  movieHeaderInfo: { flex: 1, marginHorizontal: 12 },
  playerMovieTitle: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  playerMovieMeta: { color: Colors.textSecondary, fontSize: 11 },
  topRightControls: { flexDirection: 'row', gap: 8 },
  topBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  topBtnText: { color: Colors.white, fontWeight: 'bold', fontSize: 12 },
  centerControls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 40 },
  playPauseBtn: { backgroundColor: 'rgba(229, 9, 20, 0.85)', width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  seekBtn: { alignItems: 'center' },
  seekText: { color: Colors.white, fontSize: 11, fontWeight: 'bold' },
  bottomBar: { paddingBottom: 10 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  timeText: { color: Colors.white, fontSize: 12, fontWeight: '600', fontFamily: 'monospace' },
  progressBarBackground: { flex: 1, height: 5, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: Colors.primary },
  bottomFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  badgeFooter: { color: Colors.textSecondary, fontSize: 11 },
  badgeCallback: { color: Colors.success, fontSize: 11, fontWeight: 'bold' },
  sheetOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  sheet: { backgroundColor: Colors.card, borderRadius: 12, padding: 20, width: '100%', maxWidth: 360, borderWidth: 1, borderColor: Colors.border },
  sheetTitle: { color: Colors.white, fontSize: 16, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  sheetSubTitle: { color: Colors.primary, fontSize: 12, fontWeight: 'bold', marginBottom: 6 },
  sheetItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#2b2b2b' },
  sheetItemActive: { backgroundColor: 'rgba(229, 9, 20, 0.15)', paddingHorizontal: 8, borderRadius: 6 },
  sheetItemText: { color: Colors.textSecondary, fontSize: 14 },
  sheetItemTextActive: { color: Colors.white, fontWeight: 'bold' },
  sheetCloseBtn: { backgroundColor: '#333', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  sheetCloseText: { color: Colors.white, fontWeight: '600' }
});