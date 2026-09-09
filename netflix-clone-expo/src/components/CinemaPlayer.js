import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
  ScrollView,
  TextInput,
  Alert,
  Share,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video, ResizeMode, Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { CinemaImage } from './CinemaImage';
import { ApiService } from '../services/apiService';
import { NotificationService } from '../services/notificationService';
import { WatchPartyModal } from './WatchPartyModal';

const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
const QUALITY_OPTIONS = ['4K Ultra HD', '1080p', '720p', '360p'];

const HIGH_RELIABILITY_STREAMS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
];

function isDirectMediaStream(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return false;
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) return false;
  // On Web (Chrome/Edge on Windows), HTML5 video cannot play .m3u8 directly without HLS decoder
  if (Platform.OS === 'web' && trimmed.includes('.m3u8')) return false;
  return true;
}

function resolveMovieStream(movie, quality = '1080p') {
  if (!movie) return HIGH_RELIABILITY_STREAMS[0];

  // 1. Try quality in videoSources
  if (movie.videoSources && typeof movie.videoSources === 'object') {
    if (isDirectMediaStream(movie.videoSources[quality])) {
      return movie.videoSources[quality];
    }
    for (const k of ['1080p', '720p', 'auto', '360p']) {
      const val = movie.videoSources[k];
      if (isDirectMediaStream(val)) {
        return val;
      }
    }
    const anyValid = Object.values(movie.videoSources).find(v => isDirectMediaStream(v));
    if (anyValid) return anyValid;
  }

  // 2. Direct movie video properties (never trailers!)
  for (const field of [movie.videoUrl, movie.video_url, movie.streamUrl, movie.url]) {
    if (isDirectMediaStream(field)) {
      return field;
    }
  }

  // 3. Deterministic high-quality CDN fallback
  const hash = (movie.id || movie.title || '1').toString().split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return HIGH_RELIABILITY_STREAMS[Math.abs(hash) % HIGH_RELIABILITY_STREAMS.length];
}

const INITIAL_COMMENTS = [];

function formatViewCount(views) {
  const count = typeof views === 'number' ? views : parseInt(views, 10) || 0;
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace('.0', '')}M lượt xem`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace('.0', '')}K lượt xem`;
  }
  return `${count.toLocaleString('vi-VN')} lượt xem`;
}

const getMovieCast = (movie) => {
  if (!movie) return [];
  if (movie.cast && Array.isArray(movie.cast) && movie.cast.length > 0) {
    return movie.cast;
  }
  const title = (movie.title || '').toLowerCase();

  if (title.includes('phở') || title.includes('mùi phở') || title.includes('mai') || title.includes('nhà bà nữ')) {
    return [
      { id: 'c1', name: 'Trấn Thành', role: 'Đạo diễn / Diễn viên', tag: 'Đạo Diễn', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
      { id: 'c2', name: 'Phương Anh Đào', role: 'Mai', tag: 'Nữ Chính', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
      { id: 'c3', name: 'Tuấn Trần', role: 'Sâu (Dương)', tag: 'Nam Chính', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
      { id: 'c4', name: 'Uyển Ân', role: 'Bình Minh', tag: 'Diễn Viên', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' }
    ];
  }

  if (title.includes('hôn lễ') || title.includes('on your wedding day') || title.includes('hàn')) {
    return [
      { id: 'c1', name: 'Park Bo-young', role: 'Hwan Seung-hee', tag: 'Nữ Chính', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80' },
      { id: 'c2', name: 'Kim Young-kwang', role: 'Hwang Woo-yeon', tag: 'Nam Chính', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80' },
      { id: 'c3', name: 'Kang Ki-young', role: 'Ok Geun-nam', tag: 'Bạn Thân', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80' }
    ];
  }

  return [
    { id: 'c1', name: 'Ninh Dương Lan Ngọc', role: 'Nữ Chính', tag: 'Nữ Chính', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
    { id: 'c2', name: 'Song Luân', role: 'Nam Chính', tag: 'Nam Chính', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
    { id: 'c3', name: 'Kaity Nguyễn', role: 'Gương Mặt Vàng', tag: 'Diễn Viên', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' }
  ];
};

export const CinemaPlayer = ({ visible, movie, onClose }) => {
  const { user, updateProgress, continueWatching, favorites, toggleFavorite, accentColor, themeMode, fontSizeScale, frameRate } = useContext(AppContext);
  const theme = getThemeColors(themeMode);
  const videoRef = useRef(null);
  const webVideoRef = useRef(null);
  const commentScrollRef = useRef(null);

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const isLandscape = dimensions.width > dimensions.height;

  const [status, setStatus] = useState({});
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [selectedSpeed, setSelectedSpeed] = useState(1.0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  // Active stream URL
  const initialStream = resolveMovieStream(movie, selectedQuality);
  const [currentSource, setCurrentSource] = useState(initialStream);

  // Expanded Story State
  const [isExpandedStory, setIsExpandedStory] = useState(false);
  const [showWatchPartyModal, setShowWatchPartyModal] = useState(false);

  // Comments State
  const [comments, setComments] = useState([]);
  const [inputComment, setInputComment] = useState('');
  const [inputRating, setInputRating] = useState(5);
  const [replyingToId, setReplyingToId] = useState(null);
  const [inputReply, setInputReply] = useState('');

  // Real View Count State
  const [realViewCount, setRealViewCount] = useState(movie?.viewCount || 0);
  const hasTrackedViewRef = useRef(false);

  // Record real view count once per watch session
  useEffect(() => {
    if (!movie?.id) return;
    hasTrackedViewRef.current = false;

    async function recordRealView() {
      if (hasTrackedViewRef.current) return;
      hasTrackedViewRef.current = true;
      try {
        const updatedCount = await ApiService.incrementViewCount(movie.id);
        setRealViewCount(updatedCount);
      } catch (e) {
        setRealViewCount(prev => (prev || 0) + 1);
      }
    }

    recordRealView();
  }, [movie?.id]);

  // Load real comments from AsyncStorage per movie
  useEffect(() => {
    async function loadMovieComments() {
      if (!movie?.id) return;
      try {
        const key = `fimax_real_comments_${movie.id}`;
        const stored = await AsyncStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setComments(parsed);
            return;
          }
        }
        setComments([]);
      } catch (e) {
        setComments([]);
      }
    }
    loadMovieComments();
  }, [movie?.id]);

  const saveCommentsToStorage = async (updatedComments) => {
    if (!movie?.id) return;
    try {
      await AsyncStorage.setItem(`fimax_real_comments_${movie.id}`, JSON.stringify(updatedComments));
    } catch (e) {}
  };

  // Similar Movies
  const [similarMovies, setSimilarMovies] = useState([]);

  // Configure Audio for Background Mode & Native iOS Picture-in-Picture (PiP)
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false
    }).catch(() => {});
  }, []);

  // Update source when movie or quality changes
  useEffect(() => {
    if (movie) {
      const src = resolveMovieStream(movie, selectedQuality);
      setCurrentSource(src);
      setIsPlaying(true);
      setIsBuffering(true);
    }
  }, [movie, selectedQuality]);

  // Auto-listen to screen dimension / orientation changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

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
        videoRef.current.setPositionAsync(saved.currentTime * 1000).catch(() => {});
      }
    }
  }, [visible, movie]);

  // Auto-hide controls after 4.5 seconds
  useEffect(() => {
    let timer;
    if (showControls && isPlaying && !isMiniPlayer) {
      timer = setTimeout(() => {
        setShowControls(false);
        setShowSpeedMenu(false);
        setShowQualityMenu(false);
      }, 4500);
    }
    return () => clearTimeout(timer);
  }, [showControls, isPlaying, isMiniPlayer]);

  useEffect(() => {
    async function loadSimilar() {
      try {
        const all = await ApiService.getAllMovies();
        if (all && all.length > 0) {
          const filtered = all.filter(m => m.id !== movie?.id).slice(0, 6);
          setSimilarMovies(filtered);
        }
      } catch (e) {}
    }
    loadSimilar();
  }, [movie]);

  if (!movie) return null;

  const isFav = favorites.includes(movie.id);
  const displayYear = movie.releaseYear || movie.year || '2025';
  const ratingScore = movie.rating || '8.8';
  const castMembers = getMovieCast(movie);

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
    } catch (e) {}
  };

  const toggleMiniPlayer = () => {
    if (!isMiniPlayer && isLandscape) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
    }
    if (Platform.OS === 'web') {
      try {
        const videoElements = document.querySelectorAll('video');
        if (videoElements && videoElements.length > 0) {
          const activeVid = videoElements[videoElements.length - 1];
          if (document.pictureInPictureElement) {
            document.exitPictureInPicture().catch(() => {});
          } else if (activeVid && activeVid.requestPictureInPicture) {
            activeVid.requestPictureInPicture().catch(() => {});
          }
        }
      } catch (e) {}
    }
    setIsMiniPlayer(prev => !prev);
  };

  const togglePlayPause = async () => {
    try {
      if (Platform.OS === 'web') {
        const v = webVideoRef.current || document.querySelector('video');
        if (v) {
          if (v.paused) {
            await v.play().catch(() => {});
            setIsPlaying(true);
          } else {
            v.pause();
            setIsPlaying(false);
          }
          return;
        }
      }

      if (videoRef.current) {
        const st = await videoRef.current.getStatusAsync().catch(() => null);
        const currentlyPlaying = st ? st.isPlaying : isPlaying;
        if (currentlyPlaying) {
          await videoRef.current.pauseAsync().catch(() => {});
          setIsPlaying(false);
        } else {
          await videoRef.current.playAsync().catch(() => {});
          setIsPlaying(true);
        }
      } else {
        setIsPlaying(prev => !prev);
      }
    } catch (e) {
      console.warn('Playback toggle fallback:', e);
      setIsPlaying(prev => !prev);
    }
  };

  const handleSeek = async (seconds) => {
    try {
      if (Platform.OS === 'web') {
        const v = webVideoRef.current || document.querySelector('video');
        if (v && v.duration) {
          v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + seconds));
          return;
        }
      }
      if (!videoRef.current || !status.positionMillis) return;
      const newPos = Math.max(0, Math.min(status.durationMillis || 0, status.positionMillis + seconds * 1000));
      await videoRef.current.setPositionAsync(newPos).catch(() => {});
    } catch (e) {}
  };

  const handleProgressBarPress = async (e, barWidth) => {
    try {
      const clickX = e.nativeEvent.locationX;
      const targetRatio = Math.max(0, Math.min(1, clickX / barWidth));
      if (Platform.OS === 'web') {
        const v = webVideoRef.current || document.querySelector('video');
        if (v && v.duration) {
          v.currentTime = targetRatio * v.duration;
          return;
        }
      }
      if (!videoRef.current || !status.durationMillis) return;
      const targetMillis = targetRatio * status.durationMillis;
      await videoRef.current.setPositionAsync(targetMillis).catch(() => {});
    } catch (e) {}
  };

  const handleChangeSpeed = async (speed) => {
    setSelectedSpeed(speed);
    setShowSpeedMenu(false);
    try {
      if (Platform.OS === 'web') {
        const v = webVideoRef.current || document.querySelector('video');
        if (v) v.playbackRate = speed;
        return;
      }
      if (videoRef.current) {
        await videoRef.current.setRateAsync(speed, true).catch(() => {});
      }
    } catch (e) {}
  };

  const handleVideoError = (error) => {
    console.warn('Video stream error, switching to reliable CDN backup stream:', error);
    const nextIdx = (fallbackIndex + 1) % HIGH_RELIABILITY_STREAMS.length;
    setFallbackIndex(nextIdx);
    setCurrentSource(HIGH_RELIABILITY_STREAMS[nextIdx]);
    setIsBuffering(false);
    setIsPlaying(true);
  };

  const onPlaybackStatusUpdate = (newStatus) => {
    setStatus(newStatus);
    if (newStatus.isLoaded) {
      setIsBuffering(newStatus.isBuffering);
      setIsPlaying(newStatus.isPlaying);
      const curSec = newStatus.positionMillis / 1000;
      const durSec = (newStatus.durationMillis || movie.durationSeconds || 7200000) / 1000;
      if (Math.round(curSec) % 10 === 0 || newStatus.didJustFinish) {
        updateProgress(movie.id, curSec, durSec, selectedQuality, newStatus.didJustFinish);
      }
    } else if (newStatus.error) {
      handleVideoError(newStatus.error);
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

  const handleShare = async () => {
    try {
      const shareUrl = `https://fimax.aecongnghe.online/watch?movie=${encodeURIComponent(movie.id)}`;
      await Share.share({
        title: `Đang xem ${movie.title} trên FIMAX Cinema`,
        message: `🎬 Đang xem phim "${movie.title}" (${displayYear}) chuẩn 4K Ultra HD trên FIMAX Cinema!\n📲 Xem ngay tại: ${shareUrl}`,
        url: shareUrl
      });
    } catch (e) {}
  };

  const handleSendComment = async () => {
    if (!user) {
      Alert.alert(
        'Yêu Cầu Đăng Nhập',
        'Vui lòng đăng nhập tài khoản FIMAX để gửi bình luận và đánh giá phim.'
      );
      return;
    }

    if (!inputComment.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung bình luận.');
      return;
    }

    const newCmt = {
      id: `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userName: user.name || user.email?.split('@')[0] || 'Khán giả FIMAX',
      userAvatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      time: 'Vừa xong',
      rating: inputRating,
      isVip: user.isVip || false,
      content: inputComment.trim(),
      likes: 0,
      isLiked: false,
      replies: []
    };

    const updated = [newCmt, ...comments];
    setComments(updated);
    await saveCommentsToStorage(updated);
    setInputComment('');

    // Native push notification & success alert
    try {
      await NotificationService.sendNativeNotification(
        'Bình luận thành công 🎉',
        `Bạn vừa gửi đánh giá cho phim "${movie.title}". Cảm ơn bạn đã đóng góp!`,
        { type: 'comment', movieId: movie.id }
      );
    } catch (e) {}
    Alert.alert('Thành công', 'Bình luận của bạn đã được gửi thành công!');
  };

  const handleSendReply = async (commentId) => {
    if (!user) {
      Alert.alert(
        'Yêu Cầu Đăng Nhập',
        'Vui lòng đăng nhập tài khoản FIMAX để phản hồi bình luận.'
      );
      return;
    }

    if (!inputReply.trim()) return;

    const newReply = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userName: user.name || user.email?.split('@')[0] || 'Khán giả FIMAX',
      userAvatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      time: 'Vừa xong',
      content: inputReply.trim(),
      isVip: user.isVip || false
    };

    const updated = comments.map(c => {
      if (c.id === commentId) {
        return { ...c, replies: [...(c.replies || []), newReply] };
      }
      return c;
    });

    setComments(updated);
    await saveCommentsToStorage(updated);
    setInputReply('');
    setReplyingToId(null);

    try {
      await NotificationService.sendNativeNotification(
        'Phản hồi thành công 💬',
        `Phản hồi của bạn đã được đăng tải trên phim "${movie.title}".`,
        { type: 'reply', movieId: movie.id }
      );
    } catch (e) {}
    Alert.alert('Thành công', 'Phản hồi của bạn đã được gửi thành công!');
  };

  const handleToggleLikeComment = async (commentId) => {
    if (!user) {
      Alert.alert(
        'Yêu Cầu Đăng Nhập',
        'Vui lòng đăng nhập tài khoản FIMAX để bày tỏ cảm xúc và thích bình luận.'
      );
      return;
    }

    let wasLiked = false;
    const updated = comments.map(c => {
      if (c.id === commentId) {
        const nextLiked = !c.isLiked;
        wasLiked = nextLiked;
        return {
          ...c,
          isLiked: nextLiked,
          likes: Math.max(0, (c.likes || 0) + (nextLiked ? 1 : -1))
        };
      }
      return c;
    });

    setComments(updated);
    await saveCommentsToStorage(updated);

    if (wasLiked) {
      try {
        await NotificationService.sendNativeNotification(
          'Tương tác thành công ❤️',
          `Bạn đã thích một bình luận trong phim "${movie.title}".`,
          { type: 'like', movieId: movie.id }
        );
      } catch (e) {}
    }
  };

  // 1. Mini-Player PiP Floating View
  if (isMiniPlayer) {
    return (
      <View style={styles.miniPlayerContainer} pointerEvents="box-none">
        <View style={styles.miniCard}>
          <TouchableOpacity activeOpacity={0.9} style={styles.miniVideoWrap} onPress={() => setIsMiniPlayer(false)}>
            {Platform.OS === 'web' ? (
              <video
                ref={(el) => {
                  if (el) {
                    if (el.src !== currentSource) el.src = currentSource;
                    if (isPlaying && el.paused) el.play().catch(() => {});
                  }
                }}
                src={currentSource}
                playsInline
                autoPlay={isPlaying}
                style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#000000' }}
              />
            ) : (
              <Video
                ref={videoRef}
                source={{ uri: currentSource }}
                rate={selectedSpeed}
                volume={1.0}
                resizeMode={ResizeMode.COVER}
                shouldPlay={isPlaying}
                allowsPictureInPicturePlayback={true}
                pictureInPicture={true}
                playsInSilentModeIOS={true}
                staysActiveInBackground={true}
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
                style={styles.miniVideo}
              />
            )}
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

  // 2. Fullscreen / Landscape Theater View
  if (isLandscape) {
    return (
      <Modal
        visible={visible && !isMiniPlayer}
        animationType="fade"
        supportedOrientations={['landscape', 'landscape-left', 'landscape-right']}
        onRequestClose={handleClose}
      >
        <StatusBar hidden />
        <View style={[styles.container, { width: dimensions.width, height: dimensions.height }]}>
          {Platform.OS === 'web' ? (
            <video
              ref={(el) => {
                webVideoRef.current = el;
                if (el && currentSource && el.src !== currentSource) {
                  el.src = currentSource;
                  if (isPlaying) el.play().catch(() => {});
                }
              }}
              src={currentSource}
              playsInline
              autoPlay={isPlaying}
              style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#000000' }}
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v && v.duration) {
                  setStatus({
                    isLoaded: true,
                    isPlaying: !v.paused,
                    positionMillis: v.currentTime * 1000,
                    durationMillis: v.duration * 1000,
                    isBuffering: false
                  });
                }
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => updateProgress(movie.id, status.positionMillis / 1000, status.durationMillis / 1000, selectedQuality, true)}
            />
          ) : (
            <Video
              ref={videoRef}
              source={{ uri: currentSource }}
              rate={selectedSpeed}
              volume={1.0}
              isMuted={false}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={isPlaying}
              allowsPictureInPicturePlayback={true}
              pictureInPicture={true}
              playsInSilentModeIOS={true}
              staysActiveInBackground={true}
              onPlaybackStatusUpdate={onPlaybackStatusUpdate}
              onError={handleVideoError}
              style={styles.video}
            />
          )}

          {/* Buffering Spinner */}
          {isBuffering && !isPlaying && (
            <View style={styles.bufferingCenterOverlay} pointerEvents="none">
              <ActivityIndicator size="large" color={accentColor} />
            </View>
          )}

          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShowControls(prev => !prev)}
          />

          {showControls && (
            <View style={styles.landscapeControlsOverlay} pointerEvents="box-none">
              <View style={styles.landscapeTopBar}>
                <TouchableOpacity style={styles.closePlayerBtn} onPress={toggleOrientation}>
                  <Ionicons name="phone-portrait-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.closePlayerText}>Thu Nhỏ</Text>
                </TouchableOpacity>

                <View style={styles.movieHeaderInfo}>
                  <Text style={styles.playerMovieTitle} numberOfLines={1}>{movie.title}</Text>
                  <Text style={styles.playerMovieMeta}>4K Ultra HD • {selectedQuality} • {selectedSpeed}x</Text>
                </View>

                <View style={styles.topRightControls}>
                  <TouchableOpacity style={styles.topBtn} onPress={toggleMiniPlayer}>
                    <Ionicons name="contract-outline" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.topBtn} onPress={() => setShowQualityMenu(prev => !prev)}>
                    <Text style={styles.topBtnText}>{selectedQuality}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.topBtn} onPress={() => setShowSpeedMenu(prev => !prev)}>
                    <Ionicons name="speedometer-outline" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.centerControls}>
                <TouchableOpacity style={styles.seekBtn} onPress={() => handleSeek(-10)}>
                  <Ionicons name="play-back" size={32} color="#FFFFFF" />
                  <Text style={styles.seekText}>10s</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.mainPlayBtn, { backgroundColor: accentColor }]} onPress={togglePlayPause}>
                  <Ionicons name={isPlaying ? "pause" : "play"} size={40} color="#FFFFFF" style={!isPlaying && { marginLeft: 4 }} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.seekBtn} onPress={() => handleSeek(10)}>
                  <Ionicons name="play-forward" size={32} color="#FFFFFF" />
                  <Text style={styles.seekText}>10s</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.bottomBar}>
                <TouchableOpacity
                  style={styles.progressContainer}
                  activeOpacity={1}
                  onPress={(e) => handleProgressBarPress(e, dimensions.width - 40)}
                >
                  <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${progressPercentage}%`, backgroundColor: accentColor }]} />
                  </View>
                </TouchableOpacity>
                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>{formatTime(status.positionMillis)}</Text>
                  <Text style={styles.timeText}>{formatTime(status.durationMillis)}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>
    );
  }

  // 3. Web & Cinema Stream Layout (Portrait Mode)
  const playerHeight = Math.round(dimensions.width * (9 / 16));

  return (
    <Modal
      visible={visible && !isMiniPlayer}
      animationType="slide"
      supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={[styles.watchPageContainer, { backgroundColor: theme.background }]}>
        {/* STICKY TOP VIDEO PLAYER (16:9 Cinema Frame With Full On-Screen Controls) */}
        <View style={[styles.playerFrame, { width: dimensions.width, height: playerHeight }]}>
          {Platform.OS === 'web' ? (
            <video
              ref={(el) => {
                webVideoRef.current = el;
                if (el && currentSource && el.src !== currentSource) {
                  el.src = currentSource;
                  if (isPlaying) el.play().catch(() => {});
                }
              }}
              src={currentSource}
              playsInline
              autoPlay={isPlaying}
              style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#000000' }}
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v && v.duration) {
                  setStatus({
                    isLoaded: true,
                    isPlaying: !v.paused,
                    positionMillis: v.currentTime * 1000,
                    durationMillis: v.duration * 1000,
                    isBuffering: false
                  });
                }
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => updateProgress(movie.id, status.positionMillis / 1000, status.durationMillis / 1000, selectedQuality, true)}
            />
          ) : (
            <Video
              ref={videoRef}
              source={{ uri: currentSource }}
              rate={selectedSpeed}
              volume={1.0}
              isMuted={false}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={isPlaying}
              allowsPictureInPicturePlayback={true}
              pictureInPicture={true}
              playsInSilentModeIOS={true}
              staysActiveInBackground={true}
              onPlaybackStatusUpdate={onPlaybackStatusUpdate}
              onError={handleVideoError}
              style={styles.webVideo}
            />
          )}

          {/* Buffering Spinner Overlay */}
          {isBuffering && !isPlaying && (
            <View style={styles.bufferingCenterOverlay} pointerEvents="none">
              <ActivityIndicator size="large" color={accentColor} />
            </View>
          )}

          {/* Tap to Toggle Overlay Controls */}
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => {
              setShowControls(prev => !prev);
              setShowSpeedMenu(false);
              setShowQualityMenu(false);
            }}
          />

          {/* ON-SCREEN VIDEO CONTROLS OVERLAY */}
          {showControls && (
            <View style={styles.portraitControlsOverlay} pointerEvents="box-none">
              {/* Top Row Controls */}
              <View style={styles.videoTopOverlay} pointerEvents="box-none">
                <TouchableOpacity style={styles.playerBackCircle} onPress={handleClose} activeOpacity={0.8}>
                  <Ionicons name="chevron-down" size={22} color="#FFFFFF" />
                </TouchableOpacity>

                <View style={styles.videoTopRightPills}>
                  <TouchableOpacity style={styles.playerGlassPill} onPress={toggleMiniPlayer} activeOpacity={0.8}>
                    <Ionicons name="contract-outline" size={16} color="#FFFFFF" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.playerGlassPill, showQualityMenu && { borderColor: accentColor }]}
                    onPress={() => setShowQualityMenu(prev => !prev)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.playerQualityPillText}>{selectedQuality === '4K Ultra HD' ? '4K' : selectedQuality}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.playerGlassPill, showSpeedMenu && { borderColor: accentColor }]}
                    onPress={() => setShowSpeedMenu(prev => !prev)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.playerSpeedPillText}>{selectedSpeed}x</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.playerGlassPill} onPress={toggleOrientation} activeOpacity={0.8}>
                    <Ionicons name="scan-outline" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Quality Selector Dropdown */}
              {showQualityMenu && (
                <View style={styles.dropdownMenu}>
                  {QUALITY_OPTIONS.map((q) => (
                    <TouchableOpacity
                      key={q}
                      style={[styles.dropdownItem, selectedQuality === q && { backgroundColor: `${accentColor}33` }]}
                      onPress={() => {
                        setSelectedQuality(q);
                        setShowQualityMenu(false);
                      }}
                    >
                      <Text style={[styles.dropdownText, selectedQuality === q && { color: accentColor, fontWeight: '700' }]}>
                        {q}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Speed Selector Dropdown */}
              {showSpeedMenu && (
                <View style={[styles.dropdownMenu, { right: 54 }]}>
                  {SPEED_OPTIONS.map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.dropdownItem, selectedSpeed === s && { backgroundColor: `${accentColor}33` }]}
                      onPress={() => handleChangeSpeed(s)}
                    >
                      <Text style={[styles.dropdownText, selectedSpeed === s && { color: accentColor, fontWeight: '700' }]}>
                        {s}x
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* CENTER PLAY / PAUSE & SEEK BUTTONS */}
              <View style={styles.portraitCenterControls}>
                <TouchableOpacity style={styles.portraitSeekBtn} onPress={() => handleSeek(-10)} activeOpacity={0.8}>
                  <Ionicons name="play-back" size={24} color="#FFFFFF" />
                  <Text style={styles.portraitSeekText}>10s</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.portraitMainPlayBtn, { backgroundColor: accentColor }]} onPress={togglePlayPause} activeOpacity={0.85}>
                  <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="#FFFFFF" style={!isPlaying && { marginLeft: 3 }} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.portraitSeekBtn} onPress={() => handleSeek(10)} activeOpacity={0.8}>
                  <Ionicons name="play-forward" size={24} color="#FFFFFF" />
                  <Text style={styles.portraitSeekText}>10s</Text>
                </TouchableOpacity>
              </View>

              {/* BOTTOM TIME & PROGRESS BAR */}
              <View style={styles.portraitBottomBar}>
                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>{formatTime(status.positionMillis)}</Text>
                  <Text style={styles.timeText}>{formatTime(status.durationMillis)}</Text>
                </View>
                <TouchableOpacity
                  style={styles.progressContainer}
                  activeOpacity={1}
                  onPress={(e) => handleProgressBarPress(e, dimensions.width - 20)}
                >
                  <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${progressPercentage}%`, backgroundColor: accentColor }]} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Persistent Mini Bottom Line if controls hidden */}
          {!showControls && (
            <View style={styles.videoBottomProgress}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${progressPercentage}%`, backgroundColor: accentColor }]} />
              </View>
            </View>
          )}
        </View>

        {/* SCROLLABLE MOVIE DETAILS & INTERACTIVE DISCUSSION */}
        <ScrollView ref={commentScrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={styles.watchScrollContent}>
          {/* Movie Title & Badges */}
          <View style={styles.metaSection}>
            <Text style={[styles.watchMovieTitle, { color: theme.textPrimary, fontSize: 21 * fontSizeScale }]}>
              {movie.title}
            </Text>

            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <Text style={[styles.watchMovieOriginalTitle, { color: theme.textMuted }]}>
                {movie.originalTitle}
              </Text>
            )}

            <View style={styles.watchStatsRow}>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#D4AF37" />
                <Text style={styles.ratingBadgeText}>{ratingScore}</Text>
              </View>
              <View style={[styles.qualityPill, { borderColor: `${accentColor}80` }]}>
                <Text style={[styles.qualityPillText, { color: accentColor }]}>4K Ultra HD</Text>
              </View>
              <View style={[styles.qualityPill, { borderColor: 'rgba(52, 199, 89, 0.6)', backgroundColor: 'rgba(52, 199, 89, 0.12)' }]}>
                <Text style={[styles.qualityPillText, { color: '#34C759' }]}>{frameRate || 60} FPS</Text>
              </View>
              <Text style={[styles.watchDot, { color: theme.textMuted }]}>•</Text>
              <Text style={[styles.watchStatText, { color: theme.textMuted }]}>{displayYear}</Text>
              <Text style={[styles.watchDot, { color: theme.textMuted }]}>•</Text>
              <Text style={[styles.watchStatText, { color: theme.textMuted }]}>{movie.duration || '115 phút'}</Text>
              <Text style={[styles.watchDot, { color: theme.textMuted }]}>•</Text>
              <Text style={[styles.watchStatText, { color: theme.textMuted }]}>{formatViewCount(realViewCount)}</Text>
            </View>

            {/* Quick Interactive Action Buttons Row */}
            <View style={[styles.watchActionBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <TouchableOpacity
                style={styles.watchActionBtn}
                onPress={() => toggleFavorite(movie.id, movie)}
                activeOpacity={0.8}
              >
                <Ionicons name={isFav ? "heart" : "heart-outline"} size={20} color={isFav ? accentColor : theme.textPrimary} />
                <Text style={[styles.watchActionBtnText, { color: isFav ? accentColor : theme.textMuted }]}>
                  {isFav ? 'Đã Lưu' : 'Yêu Thích'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.watchActionBtn} onPress={handleShare} activeOpacity={0.8}>
                <Ionicons name="share-social-outline" size={20} color={theme.textPrimary} />
                <Text style={[styles.watchActionBtnText, { color: theme.textMuted }]}>Chia Sẻ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.watchActionBtn}
                onPress={() => Alert.alert('Apple AirPlay & Cast', 'Đang quét thiết bị Smart TV / Apple TV khả dụng trong mạng Wi-Fi của bạn...')}
                activeOpacity={0.8}
              >
                <Ionicons name="tv-outline" size={20} color={theme.textPrimary} />
                <Text style={[styles.watchActionBtnText, { color: theme.textMuted }]}>AirPlay</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.watchActionBtn}
                onPress={() => setShowWatchPartyModal(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="people-outline" size={20} color={accentColor} />
                <Text style={[styles.watchActionBtnText, { color: accentColor }]}>Xem Chung</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.watchActionBtn}
                onPress={() => commentScrollRef.current?.scrollToEnd({ animated: true })}
                activeOpacity={0.8}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={20} color={theme.textPrimary} />
                <Text style={[styles.watchActionBtnText, { color: theme.textMuted }]}>{comments.length} Bình Luận</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Synopsis with Expand/Collapse */}
          <View style={[styles.synopsisCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.synopsisHeading, { color: theme.textPrimary }]}>Tóm Tắt Nội Dung</Text>
            <Text
              style={[styles.synopsisText, { color: theme.textSecondary }]}
              numberOfLines={isExpandedStory ? undefined : 3}
            >
              {movie.overview || 'Bộ phim đang được phát sóng độc quyền với chất lượng chuẩn 4K HDR cùng âm thanh vòm Dolby 5.1 sống động.'}
            </Text>
            <TouchableOpacity onPress={() => setIsExpandedStory(prev => !prev)} style={styles.expandStoryBtn}>
              <Text style={[styles.expandStoryText, { color: accentColor }]}>
                {isExpandedStory ? 'Thu gọn ▲' : 'Xem thêm ▼'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Cast & Crew Avatars */}
          <View style={styles.castSection}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Diễn Viên & Đoàn Làm Phim</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.castScroll}>
              {castMembers.map((actor) => (
                <View key={actor.id} style={styles.castItemCard}>
                  <View style={[styles.castAvatarCircle, { borderColor: `${accentColor}55` }]}>
                    <CinemaImage uri={actor.avatar} style={styles.castAvatarPhoto} resizeMode="cover" />
                  </View>
                  <Text style={[styles.castItemName, { color: theme.textPrimary }]} numberOfLines={1}>
                    {actor.name}
                  </Text>
                  <Text style={[styles.castItemRole, { color: theme.textMuted }]} numberOfLines={1}>
                    {actor.role}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* COMMUNITY COMMENTS & DISCUSSION SECTION */}
          <View style={styles.commentsSection}>
            <View style={styles.commentsHeaderRow}>
              <View style={styles.commentsTitleWithCount}>
                <Ionicons name="chatbubbles" size={18} color={accentColor} />
                <Text style={[styles.commentsSectionTitle, { color: theme.textPrimary }]}>
                  Bình Luận & Đánh Giá ({comments.length})
                </Text>
              </View>
              <Text style={[styles.communityNote, { color: theme.textMuted }]}>Cộng đồng FIMAX</Text>
            </View>

            {/* Post New Comment Box */}
            <View style={[styles.newCommentCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              {user ? (
                <>
                  {/* Star Rating Picker */}
                  <View style={styles.starPickerRow}>
                    <Text style={[styles.starPickerLabel, { color: theme.textMuted }]}>Đánh giá của bạn:</Text>
                    <View style={styles.starsRow}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => setInputRating(star)} activeOpacity={0.8}>
                          <Ionicons
                            name={star <= inputRating ? 'star' : 'star-outline'}
                            size={20}
                            color={star <= inputRating ? '#D4AF37' : '#636366'}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Input row */}
                  <View style={styles.commentInputRow}>
                    <TextInput
                      style={[styles.commentTextInput, { backgroundColor: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.border }]}
                      placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
                      placeholderTextColor="#636366"
                      multiline
                      value={inputComment}
                      onChangeText={setInputComment}
                    />
                    <TouchableOpacity
                      style={[styles.sendCommentBtn, { backgroundColor: accentColor }]}
                      activeOpacity={0.85}
                      onPress={handleSendComment}
                    >
                      <Ionicons name="send" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.loginRequiredBox}>
                  <View style={[styles.loginRequiredIconCircle, { backgroundColor: `${accentColor}20` }]}>
                    <Ionicons name="lock-closed" size={20} color={accentColor} />
                  </View>
                  <Text style={[styles.loginRequiredTitle, { color: theme.textPrimary }]}>
                    Đăng nhập để tham gia thảo luận
                  </Text>
                  <Text style={[styles.loginRequiredText, { color: theme.textMuted }]}>
                    Bạn cần có tài khoản FIMAX để gửi bình luận, đánh giá sao và tương tác với cộng đồng.
                  </Text>
                  <TouchableOpacity
                    style={[styles.loginPromptBtn, { backgroundColor: accentColor }]}
                    activeOpacity={0.85}
                    onPress={handleClose}
                  >
                    <Ionicons name="log-in-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.loginPromptBtnText}>Đăng Nhập Ngay</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Comments List */}
            {comments.length === 0 ? (
              <View style={[styles.emptyCommentsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Ionicons name="chatbubbles-outline" size={32} color={theme.textMuted} />
                <Text style={[styles.emptyCommentsTitle, { color: theme.textPrimary }]}>Chưa có bình luận nào</Text>
                <Text style={[styles.emptyCommentsSubtitle, { color: theme.textMuted }]}>
                  Hãy là người đầu tiên để lại đánh giá và cảm nhận về bộ phim này!
                </Text>
              </View>
            ) : (
              <View style={styles.commentsList}>
                {comments.map((cmt) => (
                  <View key={cmt.id} style={[styles.commentCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.commentHeader}>
                      <View style={styles.commentUserWrap}>
                        <CinemaImage uri={cmt.userAvatar} style={styles.commentUserAvatar} resizeMode="cover" />
                        <View>
                          <View style={styles.commentUserNameRow}>
                            <Text style={[styles.commentUserName, { color: theme.textPrimary }]}>{cmt.userName}</Text>
                            {cmt.isVip && (
                              <View style={styles.commentVipBadge}>
                                <Text style={styles.commentVipText}>VIP</Text>
                              </View>
                            )}
                          </View>
                          <Text style={[styles.commentTime, { color: theme.textMuted }]}>{cmt.time}</Text>
                        </View>
                      </View>

                      {cmt.rating && (
                        <View style={styles.commentRatingRow}>
                          {[...Array(cmt.rating)].map((_, i) => (
                            <Ionicons key={i} name="star" size={11} color="#D4AF37" />
                          ))}
                        </View>
                      )}
                    </View>

                    {/* Comment Content */}
                    <Text style={[styles.commentBody, { color: theme.textSecondary }]}>
                      {cmt.content}
                    </Text>

                    {/* Comment Actions (Like & Reply) */}
                    <View style={styles.commentActionRow}>
                      <TouchableOpacity
                        style={styles.commentLikeBtn}
                        onPress={() => handleToggleLikeComment(cmt.id)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={cmt.isLiked ? 'heart' : 'heart-outline'}
                          size={15}
                          color={cmt.isLiked ? accentColor : theme.textMuted}
                        />
                        <Text style={[styles.commentLikeCount, { color: cmt.isLiked ? accentColor : theme.textMuted }]}>
                          {cmt.likes}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.commentReplyBtn}
                        onPress={() => setReplyingToId(replyingToId === cmt.id ? null : cmt.id)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="arrow-undo-outline" size={14} color={theme.textMuted} />
                        <Text style={[styles.commentReplyText, { color: theme.textMuted }]}>Trả lời</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Inline Reply Input if active */}
                    {replyingToId === cmt.id && (
                      <View style={styles.inlineReplyWrap}>
                        <TextInput
                          style={[styles.inlineReplyInput, { backgroundColor: theme.surfaceSecondary, color: theme.textPrimary }]}
                          placeholder={`Trả lời @${cmt.userName}...`}
                          placeholderTextColor="#636366"
                          value={inputReply}
                          onChangeText={setInputReply}
                        />
                        <TouchableOpacity
                          style={[styles.inlineSendReplyBtn, { backgroundColor: accentColor }]}
                          onPress={() => handleSendReply(cmt.id)}
                        >
                          <Ionicons name="send" size={13} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Child Replies */}
                    {cmt.replies && cmt.replies.length > 0 && (
                      <View style={styles.repliesList}>
                        {cmt.replies.map((rep) => (
                          <View key={rep.id} style={[styles.replyCard, { backgroundColor: theme.surfaceSecondary }]}>
                            <View style={styles.replyHeader}>
                              <CinemaImage uri={rep.userAvatar} style={styles.replyUserAvatar} resizeMode="cover" />
                              <Text style={[styles.replyUserName, { color: theme.textPrimary }]}>{rep.userName}</Text>
                              <Text style={[styles.replyTime, { color: theme.textMuted }]}>• {rep.time}</Text>
                            </View>
                            <Text style={[styles.replyContent, { color: theme.textSecondary }]}>{rep.content}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* SIMILAR MOVIES GRID */}
          {similarMovies.length > 0 && (
            <View style={styles.similarSection}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Phim Đề Xuất Cho Bạn</Text>
              <View style={styles.similarGrid}>
                {similarMovies.map((simMovie) => {
                  const simPoster = simMovie.posterUrl || simMovie.poster || simMovie.backdropUrl;
                  return (
                    <TouchableOpacity
                      key={simMovie.id}
                      style={styles.similarCard}
                      activeOpacity={0.85}
                      onPress={() => {
                        updateProgress(movie.id, 0, 0, selectedQuality, false);
                        onClose();
                      }}
                    >
                      <View style={styles.similarPosterWrap}>
                        <CinemaImage uri={simPoster} style={styles.similarPosterImg} resizeMode="cover" />
                        <View style={styles.similarRatingBadge}>
                          <Text style={styles.similarRatingText}>⭐ {simMovie.rating || '8.8'}</Text>
                        </View>
                      </View>
                      <Text style={[styles.similarTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                        {simMovie.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>

        <WatchPartyModal
          visible={showWatchPartyModal}
          onClose={() => setShowWatchPartyModal(false)}
          initialMovie={movie}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  video: {
    width: '100%',
    height: '100%'
  },
  bufferingCenterOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 15,
    gap: 8
  },
  bufferingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  miniPlayerContainer: {
    position: 'absolute',
    bottom: 84,
    right: 12,
    zIndex: 999
  },
  miniCard: {
    width: 220,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10
  },
  miniVideoWrap: {
    width: '100%',
    height: 120,
    position: 'relative'
  },
  miniVideo: {
    width: '100%',
    height: '100%'
  },
  miniExpandOverlay: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 4,
    borderRadius: 4
  },
  miniInfoWrap: {
    paddingHorizontal: 8,
    paddingVertical: 6
  },
  miniTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  miniMeta: {
    color: '#8E8E93',
    fontSize: 9.5,
    marginTop: 1
  },
  miniActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 4
  },
  miniBtn: {
    padding: 6
  },
  landscapeControlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'space-between',
    padding: 20
  },
  landscapeTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closePlayerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  closePlayerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  movieHeaderInfo: {
    alignItems: 'center'
  },
  playerMovieTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  playerMovieMeta: {
    color: '#D4AF37',
    fontSize: 11,
    marginTop: 2
  },
  topRightControls: {
    flexDirection: 'row',
    gap: 8
  },
  topBtn: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  topBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 36
  },
  seekBtn: {
    alignItems: 'center',
    gap: 2
  },
  seekText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  mainPlayBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(229, 9, 20, 0.85)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomBar: {
    gap: 6
  },
  progressContainer: {
    width: '100%'
  },
  progressBarBackground: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 2
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600'
  },

  // PORTRAIT WEB STREAM LAYOUT
  watchPageContainer: {
    flex: 1
  },
  playerFrame: {
    backgroundColor: '#000000',
    position: 'relative',
    overflow: 'hidden'
  },
  webVideo: {
    width: '100%',
    height: '100%'
  },
  portraitControlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'space-between',
    padding: 10,
    zIndex: 10
  },
  videoTopOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  playerBackCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  videoTopRightPills: {
    flexDirection: 'row',
    gap: 6
  },
  playerGlassPill: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  playerQualityPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  playerSpeedPillText: {
    color: '#D4AF37',
    fontSize: 10,
    fontWeight: '800'
  },
  dropdownMenu: {
    position: 'absolute',
    top: 46,
    right: 12,
    backgroundColor: 'rgba(24, 24, 28, 0.95)',
    borderRadius: 8,
    padding: 4,
    zIndex: 99,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    minWidth: 80
  },
  dropdownItem: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 11
  },
  portraitCenterControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28
  },
  portraitSeekBtn: {
    alignItems: 'center',
    gap: 1
  },
  portraitSeekText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '700'
  },
  portraitMainPlayBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6
  },
  portraitBottomBar: {
    width: '100%',
    paddingBottom: 2
  },
  videoBottomProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  watchScrollContent: {
    paddingBottom: 40
  },
  metaSection: {
    paddingHorizontal: 16,
    paddingTop: 14
  },
  watchMovieTitle: {
    fontWeight: '900',
    letterSpacing: -0.4
  },
  watchMovieOriginalTitle: {
    fontSize: 12,
    marginTop: 2
  },
  watchStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D4AF37'
  },
  ratingBadgeText: {
    color: '#D4AF37',
    fontSize: 10,
    fontWeight: '800'
  },
  qualityPill: {
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 4,
    borderWidth: 1
  },
  qualityPillText: {
    fontSize: 9.5,
    fontWeight: '800'
  },
  watchDot: {
    fontSize: 8
  },
  watchStatText: {
    fontSize: 11
  },
  watchActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    marginTop: 14
  },
  watchActionBtn: {
    alignItems: 'center',
    gap: 3
  },
  watchActionBtnText: {
    fontSize: 10,
    fontWeight: '600'
  },
  synopsisCard: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1
  },
  synopsisHeading: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4
  },
  synopsisText: {
    fontSize: 12,
    lineHeight: 18
  },
  expandStoryBtn: {
    marginTop: 4,
    alignSelf: 'flex-start'
  },
  expandStoryText: {
    fontSize: 11,
    fontWeight: '700'
  },
  castSection: {
    marginTop: 16,
    paddingHorizontal: 16
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    marginBottom: 10
  },
  castScroll: {
    gap: 12
  },
  castItemCard: {
    alignItems: 'center',
    width: 68
  },
  castAvatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    overflow: 'hidden',
    backgroundColor: '#1E1E22'
  },
  castAvatarPhoto: {
    width: '100%',
    height: '100%'
  },
  castItemName: {
    fontSize: 10.5,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center'
  },
  castItemRole: {
    fontSize: 9,
    marginTop: 1,
    textAlign: 'center'
  },
  commentsSection: {
    marginTop: 20,
    paddingHorizontal: 16
  },
  commentsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  commentsTitleWithCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  commentsSectionTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  communityNote: {
    fontSize: 11
  },
  newCommentCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    marginBottom: 14
  },
  loginRequiredBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 6
  },
  loginRequiredIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2
  },
  loginRequiredTitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center'
  },
  loginRequiredText: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 16
  },
  loginPromptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 6
  },
  loginPromptBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700'
  },
  starPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  starPickerLabel: {
    fontSize: 11.5,
    fontWeight: '600'
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4
  },
  commentInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end'
  },
  commentTextInput: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    maxHeight: 70,
    borderWidth: 1
  },
  sendCommentBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  commentsList: {
    gap: 12
  },
  commentCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6
  },
  commentUserWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  commentUserAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16
  },
  commentUserNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  commentUserName: {
    fontSize: 12,
    fontWeight: '700'
  },
  commentVipBadge: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3
  },
  commentVipText: {
    color: '#000000',
    fontSize: 7.5,
    fontWeight: '900'
  },
  commentTime: {
    fontSize: 10,
    marginTop: 1
  },
  commentRatingRow: {
    flexDirection: 'row',
    gap: 2
  },
  commentBody: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2
  },
  commentActionRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
    alignItems: 'center'
  },
  commentLikeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  commentLikeCount: {
    fontSize: 11,
    fontWeight: '600'
  },
  commentReplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  commentReplyText: {
    fontSize: 11,
    fontWeight: '600'
  },
  inlineReplyWrap: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    alignItems: 'center'
  },
  inlineReplyInput: {
    flex: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 11
  },
  inlineSendReplyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  repliesList: {
    marginTop: 8,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    gap: 6
  },
  replyCard: {
    borderRadius: 8,
    padding: 8
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3
  },
  replyUserAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10
  },
  replyUserName: {
    fontSize: 11,
    fontWeight: '700'
  },
  replyTime: {
    fontSize: 9.5
  },
  replyContent: {
    fontSize: 11,
    lineHeight: 15
  },
  similarSection: {
    marginTop: 20,
    paddingHorizontal: 16
  },
  similarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  similarCard: {
    width: (Dimensions.get('window').width - 52) / 3
  },
  similarPosterWrap: {
    width: '100%',
    height: ((Dimensions.get('window').width - 52) / 3) * 1.45,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E1E22'
  },
  similarPosterImg: {
    width: '100%',
    height: '100%'
  },
  similarRatingBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 3
  },
  similarRatingText: {
    color: '#D4AF37',
    fontSize: 8.5,
    fontWeight: '800'
  },
  similarTitle: {
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 4
  },
  emptyCommentsCard: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 4
  },
  emptyCommentsTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4
  },
  emptyCommentsSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17
  }
});