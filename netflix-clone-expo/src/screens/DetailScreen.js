import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Share,
  FlatList,
  Animated,
  Alert,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { RatingModal } from '../components/RatingModal';
import { TrailerModal } from '../components/TrailerModal';
import { CinemaImage } from '../components/CinemaImage';
import { ApiService } from '../services/apiService';

const { width } = Dimensions.get('window');
const HERO_HEIGHT = Math.round(width * 0.82);
const SIMILAR_CARD_WIDTH = (width - 48) / 3;

const getMovieCast = (movie) => {
  if (!movie) return [];
  if (movie.cast && Array.isArray(movie.cast) && movie.cast.length > 0) {
    return movie.cast;
  }
  const title = (movie.title || '').toLowerCase();

  if (title.includes('phở') || title.includes('mùi phở') || title.includes('mai') || title.includes('nhà bà nữ')) {
    return [
      { id: 'c1', name: 'Trấn Thành', role: 'Đạo diễn / Ông Thoại', tag: 'Đạo Diễn', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
      { id: 'c2', name: 'Phương Anh Đào', role: 'Mai', tag: 'Nữ Chính', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
      { id: 'c3', name: 'Tuấn Trần', role: 'Sâu (Dương)', tag: 'Nam Chính', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
      { id: 'c4', name: 'Uyển Ân', role: 'Bình Minh', tag: 'Diễn Viên', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' },
      { id: 'c5', name: 'Hồng Đào', role: 'Bà Đào', tag: 'Nghệ Sĩ', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80' }
    ];
  }

  if (title.includes('hôn lễ') || title.includes('on your wedding day') || title.includes('hàn')) {
    return [
      { id: 'c1', name: 'Park Bo-young', role: 'Hwan Seung-hee', tag: 'Nữ Chính', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80' },
      { id: 'c2', name: 'Kim Young-kwang', role: 'Hwang Woo-yeon', tag: 'Nam Chính', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80' },
      { id: 'c3', name: 'Kang Ki-young', role: 'Ok Geun-nam', tag: 'Bạn Thân', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80' },
      { id: 'c4', name: 'Ko Kyu-phil', role: 'Goo Ja-shik', tag: 'Diễn Viên', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80' }
    ];
  }

  if (title.includes('lật mặt') || title.includes('lý hải')) {
    return [
      { id: 'c1', name: 'Lý Hải', role: 'Đạo diễn / Biên kịch', tag: 'Đạo Diễn', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80' },
      { id: 'c2', name: 'Quách Ngọc Tuyên', role: 'Đại', tag: 'Nam Chính', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
      { id: 'c3', name: 'Đinh Y Nhung', role: 'Ba Như', tag: 'Nữ Chính', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
      { id: 'c4', name: 'Trương Minh Cường', role: 'Hai Khôn', tag: 'Diễn Viên', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' }
    ];
  }

  if (title.includes('nhện') || title.includes('spider') || title.includes('marvel') || title.includes('avengers')) {
    return [
      { id: 'c1', name: 'Tom Holland', role: 'Peter Parker / Spider-Man', tag: 'Nam Chính', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80' },
      { id: 'c2', name: 'Zendaya', role: 'MJ Watson', tag: 'Nữ Chính', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80' },
      { id: 'c3', name: 'Benedict Cumberbatch', role: 'Doctor Strange', tag: 'Phù Thủy', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80' },
      { id: 'c4', name: 'Willem Dafoe', role: 'Green Goblin', tag: 'Phản Diện', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80' }
    ];
  }

  if (title.includes('matrix') || title.includes('john wick')) {
    return [
      { id: 'c1', name: 'Keanu Reeves', role: 'Neo / Thomas Anderson', tag: 'Nam Chính', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80' },
      { id: 'c2', name: 'Carrie-Anne Moss', role: 'Trinity', tag: 'Nữ Chính', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80' },
      { id: 'c3', name: 'Yahya Abdul-Mateen II', role: 'Morpheus', tag: 'Diễn Viên', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80' },
      { id: 'c4', name: 'Jessica Henwick', role: 'Bugs', tag: 'Đồng Đội', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' }
    ];
  }

  return [
    { id: 'c1', name: 'Ninh Dương Lan Ngọc', role: 'Ngọc Nữ Màn Ảnh', tag: 'Nữ Chính', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
    { id: 'c2', name: 'Song Luân', role: 'Nam Thần Điện Ảnh', tag: 'Nam Chính', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
    { id: 'c3', name: 'Kaity Nguyễn', role: 'Gương Mặt Vàng', tag: 'Nữ Tuyến 1', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' },
    { id: 'c4', name: 'Hứa Vĩ Văn', role: 'Nhân Vật Bí Ẩn', tag: 'Diễn Viên', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' }
  ];
};

export const DetailScreen = ({ route, navigation }) => {
  const { movie } = route.params || {};
  const { user, favorites, toggleFavorite, setActiveMovieForPlayer, themeMode, accentColor, fontSizeScale } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  const pageFade = useRef(new Animated.Value(0)).current;
  const pageSlide = useRef(new Animated.Value(24)).current;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'cast' | 'similar'
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [realViews, setRealViews] = useState(movie?.viewCount || 0);

  const castMembers = getMovieCast(movie);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(pageFade, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true
      }),
      Animated.spring(pageSlide, {
        toValue: 0,
        friction: 6,
        tension: 50,
        useNativeDriver: true
      })
    ]).start();

    async function loadMovieData() {
      try {
        if (movie?.id) {
          const v = await ApiService.getViewCount(movie.id);
          if (v) setRealViews(v);
        }
        const all = await ApiService.getAllMovies();
        if (all && all.length > 0) {
          const filtered = all.filter(m => m.id !== movie?.id).slice(0, 6);
          setSimilarMovies(filtered);
        }
      } catch (e) {
        console.warn('Load movie data error:', e);
      }
    }
    loadMovieData();
  }, [movie]);

  if (!movie) {
    return (
      <View style={[styles.errorCenter, { backgroundColor: theme.background }]}>
        <Ionicons name="film-outline" size={48} color={theme.textMuted} />
        <Text style={{ color: theme.textPrimary, marginTop: 12, fontWeight: '600' }}>Không tìm thấy thông tin phim.</Text>
        <TouchableOpacity style={[styles.backHomeBtn, { backgroundColor: accentColor }]} onPress={() => navigation.goBack()}>
          <Text style={styles.backHomeText}>Quay Lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isFav = favorites.includes(movie.id);
  const bgImage = movie.backdropUrl || movie.backdrop || movie.posterUrl || movie.poster;
  const posterImage = movie.posterUrl || movie.poster || movie.backdropUrl || movie.backdrop;
  const displayYear = movie.releaseYear || movie.year || '2025';
  const ratingScore = movie.rating || '8.8';

  const handleToggleFavorite = () => {
    if (!user) {
      Alert.alert(
        'Yêu Cầu Đăng Nhập',
        'Vui lòng đăng nhập tài khoản FIMAX để thêm phim vào danh sách Yêu Thích.',
        [
          { text: 'Để Sau', style: 'cancel' },
          { text: 'Đăng Nhập Ngay', style: 'default', onPress: () => navigation.navigate('AccountTab') }
        ]
      );
      return;
    }
    toggleFavorite(movie.id, movie);
  };

  const handleOpenRating = () => {
    if (!user) {
      Alert.alert(
        'Yêu Cầu Đăng Nhập',
        'Vui lòng đăng nhập tài khoản FIMAX để đánh giá và bình chọn cho bộ phim này.',
        [
          { text: 'Để Sau', style: 'cancel' },
          { text: 'Đăng Nhập Ngay', style: 'default', onPress: () => navigation.navigate('AccountTab') }
        ]
      );
      return;
    }
    setShowRatingModal(true);
  };

  const handleShare = async () => {
    try {
      const shareUrl = `https://fimax.aecongnghe.online/download?movie=${encodeURIComponent(movie.id)}&title=${encodeURIComponent(movie.title)}`;
      const message = `🎬 Phim "${movie.title}" (${displayYear}) đang cực hot trên FIMAX Cinema!\n⭐ Đánh giá: ${ratingScore}/10 • Chuẩn 4K Ultra HD\n\n📲 Xem miễn phí ngay tại: ${shareUrl}`;

      await Share.share({
        title: `Xem phim ${movie.title} trên FIMAX Cinema`,
        message: message,
        url: shareUrl
      });
    } catch (e) {
      console.warn('Share error:', e);
    }
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: theme.background, opacity: pageFade, transform: [{ translateY: pageSlide }] }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Top Floating Glass Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.glassCircleBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.topRightActions}>
          <TouchableOpacity style={styles.glassCircleBtn} onPress={handleShare} activeOpacity={0.8}>
            <Ionicons name="share-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.glassCircleBtn} onPress={handleToggleFavorite} activeOpacity={0.8}>
            <Ionicons name={isFav ? "heart" : "heart-outline"} size={20} color={isFav ? accentColor : "#FFFFFF"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Backdrop with Ambient Gradient */}
        <View style={styles.heroWrap}>
          <CinemaImage uri={bgImage} fallbackUri={posterImage} style={styles.heroImg} resizeMode="cover" />
          <View style={styles.heroFadeGrad} />

          {/* Quick Play Trailer Overlay Button */}
          <TouchableOpacity
            style={styles.heroTrailerBtn}
            activeOpacity={0.85}
            onPress={() => setShowTrailerModal(true)}
          >
            <View style={styles.heroTrailerIconWrap}>
              <Ionicons name="play" size={20} color="#FFFFFF" style={{ marginLeft: 2 }} />
            </View>
            <Text style={styles.heroTrailerText}>Xem Trailer</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content Info */}
        <View style={styles.mainCard}>
          <Text style={[styles.movieTitle, { color: theme.textPrimary, fontSize: 23 * fontSizeScale }]}>
            {movie.title}
          </Text>

          {movie.originalTitle && movie.originalTitle !== movie.title && (
            <Text style={[styles.movieOriginalTitle, { color: theme.textMuted }]}>
              {movie.originalTitle}
            </Text>
          )}

          {/* Apple TV Style Meta Chips */}
          <View style={styles.metaChipsRow}>
            <View style={styles.ratingPill}>
              <Ionicons name="star" size={12} color="#D4AF37" />
              <Text style={styles.ratingPillText}>{ratingScore}</Text>
            </View>
            <View style={[styles.specPill, { borderColor: `${accentColor}80` }]}>
              <Text style={[styles.specPillText, { color: accentColor }]}>4K Ultra HD</Text>
            </View>
            <View style={styles.specPill}>
              <Text style={styles.specPillMuted}>HDR10+</Text>
            </View>
            <View style={styles.specPill}>
              <Text style={styles.specPillMuted}>Dolby Atmos</Text>
            </View>
            <Text style={[styles.metaDotText, { color: theme.textMuted }]}>•</Text>
            <Text style={[styles.metaText, { color: theme.textMuted }]}>{displayYear}</Text>
            <Text style={[styles.metaDotText, { color: theme.textMuted }]}>•</Text>
            <Text style={[styles.metaText, { color: theme.textMuted }]}>{movie.duration || '115 phút'}</Text>
            <Text style={[styles.metaDotText, { color: theme.textMuted }]}>•</Text>
            <Text style={[styles.metaText, { color: theme.textMuted }]}>
              {realViews >= 1000000
                ? `${(realViews / 1000000).toFixed(1).replace('.0', '')}M lượt xem`
                : realViews >= 1000
                  ? `${(realViews / 1000).toFixed(1).replace('.0', '')}K lượt xem`
                  : `${realViews} lượt xem`}
            </Text>
          </View>

          {/* Genre Tags */}
          <View style={styles.genreTagsRow}>
            {(Array.isArray(movie.genres) ? movie.genres : [movie.country || 'Điện ảnh']).map((g, idx) => (
              <View key={idx} style={[styles.genreTag, { backgroundColor: theme.surfaceSecondary }]}>
                <Text style={[styles.genreTagText, { color: theme.textSecondary }]}>{g}</Text>
              </View>
            ))}
          </View>

          {/* Primary Call to Action Button */}
          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={[styles.primaryPlayBtn, { backgroundColor: accentColor }]}
              activeOpacity={0.88}
              onPress={() => setActiveMovieForPlayer(movie)}
            >
              <Ionicons name="play" size={22} color="#FFFFFF" />
              <Text style={styles.primaryPlayText}>XEM PHIM NGAY</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryTrailerBtn, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}
              activeOpacity={0.85}
              onPress={() => setShowTrailerModal(true)}
            >
              <Ionicons name="videocam-outline" size={20} color={theme.textPrimary} />
              <Text style={[styles.secondaryTrailerText, { color: theme.textPrimary }]}>Trailer</Text>
            </TouchableOpacity>
          </View>

          {/* 4 Quick Actions Row */}
          <View style={[styles.actionGrid, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <TouchableOpacity style={styles.actionItem} onPress={handleToggleFavorite} activeOpacity={0.8}>
              <View style={[styles.actionIconCircle, { backgroundColor: isFav ? `${accentColor}26` : theme.surfaceSecondary }]}>
                <Ionicons name={isFav ? "heart" : "heart-outline"} size={20} color={isFav ? accentColor : theme.textPrimary} />
              </View>
              <Text style={[styles.actionLabel, { color: isFav ? accentColor : theme.textMuted }]}>
                {isFav ? 'Đã Lưu' : 'Yêu Thích'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={handleOpenRating} activeOpacity={0.8}>
              <View style={[styles.actionIconCircle, { backgroundColor: userRating ? '#D4AF3726' : theme.surfaceSecondary }]}>
                <Ionicons name={userRating ? "star" : "star-outline"} size={20} color={userRating ? "#D4AF37" : theme.textPrimary} />
              </View>
              <Text style={[styles.actionLabel, { color: userRating ? '#D4AF37' : theme.textMuted }]}>
                {userRating ? `${userRating} ⭐` : 'Đánh Giá'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={handleShare} activeOpacity={0.8}>
              <View style={[styles.actionIconCircle, { backgroundColor: theme.surfaceSecondary }]}>
                <Ionicons name="share-social-outline" size={20} color={theme.textPrimary} />
              </View>
              <Text style={[styles.actionLabel, { color: theme.textMuted }]}>Chia Sẻ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => Alert.alert('Chuẩn Điện Ảnh FIMAX 4K', 'Phim được mã hóa chuẩn H.265 HEVC 4K HDR cùng âm thanh vòm Dolby 5.1 đỉnh cao.')}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconCircle, { backgroundColor: theme.surfaceSecondary }]}>
                <Ionicons name="sparkles-outline" size={20} color="#D4AF37" />
              </View>
              <Text style={[styles.actionLabel, { color: theme.textMuted }]}>4K VIP</Text>
            </TouchableOpacity>
          </View>

          {/* FEATURED ACTOR AVATARS CAROUSEL (Always visible on detail screen) */}
          <View style={styles.actorsSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>Diễn Viên & Nghệ Sĩ</Text>
              <Text style={[styles.sectionCountText, { color: theme.textMuted }]}>{castMembers.length} người</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actorsScroll}>
              {castMembers.map((actor) => (
                <TouchableOpacity
                  key={actor.id}
                  style={styles.actorItem}
                  activeOpacity={0.85}
                  onPress={() => Alert.alert(actor.name, `Vai diễn: ${actor.role}\nPhân loại: ${actor.tag}`)}
                >
                  <View style={[styles.actorAvatarWrap, { borderColor: `${accentColor}55` }]}>
                    <CinemaImage uri={actor.avatar} style={styles.actorAvatarImg} resizeMode="cover" />
                    <View style={[styles.actorTagBadge, { backgroundColor: accentColor }]}>
                      <Text style={styles.actorTagText}>{actor.tag}</Text>
                    </View>
                  </View>
                  <Text style={[styles.actorName, { color: theme.textPrimary }]} numberOfLines={1}>
                    {actor.name}
                  </Text>
                  <Text style={[styles.actorRole, { color: theme.textMuted }]} numberOfLines={1}>
                    {actor.role}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Interactive Segmented Tabs Switcher */}
          <View style={[styles.tabsWrap, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'overview' && { backgroundColor: accentColor }]}
              onPress={() => setActiveTab('overview')}
              activeOpacity={0.85}
            >
              <Text style={[styles.tabBtnText, { color: activeTab === 'overview' ? '#FFFFFF' : theme.textMuted }]}>
                Tổng Quan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'similar' && { backgroundColor: accentColor }]}
              onPress={() => setActiveTab('similar')}
              activeOpacity={0.85}
            >
              <Text style={[styles.tabBtnText, { color: activeTab === 'similar' ? '#FFFFFF' : theme.textMuted }]}>
                Phim Tương Tự ({similarMovies.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* TAB 1: OVERVIEW & TECH SPECS */}
          {activeTab === 'overview' && (
            <View style={styles.tabContentBlock}>
              <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>Cốt Truyện</Text>
              <Text style={[styles.overviewParagraph, { color: theme.textSecondary }]}>
                {movie.overview || 'Bộ phim đang được cập nhật tóm tắt nội dung chi tiết. Mời bạn bấm Xem Phim để thưởng thức trọn vẹn bản 4K Ultra HD!'}
              </Text>

              {/* Cinema Specifications Grid */}
              <View style={[styles.specsTable, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.specsRow}>
                  <Text style={[styles.specsKey, { color: theme.textMuted }]}>Đạo diễn:</Text>
                  <Text style={[styles.specsVal, { color: theme.textPrimary }]}>{movie.director || 'Chưa cập nhật'}</Text>
                </View>
                <View style={styles.specsDivider} />
                <View style={styles.specsRow}>
                  <Text style={[styles.specsKey, { color: theme.textMuted }]}>Quốc gia:</Text>
                  <Text style={[styles.specsVal, { color: theme.textPrimary }]}>{movie.country || 'Việt Nam'}</Text>
                </View>
                <View style={styles.specsDivider} />
                <View style={styles.specsRow}>
                  <Text style={[styles.specsKey, { color: theme.textMuted }]}>Độ phân giải:</Text>
                  <Text style={[styles.specsVal, { color: '#30D158' }]}>3840 x 2160 (4K UHD)</Text>
                </View>
                <View style={styles.specsDivider} />
                <View style={styles.specsRow}>
                  <Text style={[styles.specsKey, { color: theme.textMuted }]}>Âm thanh:</Text>
                  <Text style={[styles.specsVal, { color: theme.textPrimary }]}>Dolby Atmos 7.1 / Stereo</Text>
                </View>
              </View>
            </View>
          )}

          {/* TAB 2: SIMILAR MOVIES GRID */}
          {activeTab === 'similar' && (
            <View style={styles.tabContentBlock}>
              <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>Có Thể Bạn Cũng Thích</Text>
              <View style={styles.similarGrid}>
                {similarMovies.map((simMovie) => {
                  const simPoster = simMovie.posterUrl || simMovie.poster || simMovie.backdropUrl;
                  return (
                    <TouchableOpacity
                      key={simMovie.id}
                      style={styles.similarCard}
                      activeOpacity={0.85}
                      onPress={() => navigation.push('Detail', { movie: simMovie })}
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
        </View>
      </ScrollView>

      {/* Trailer & Rating Modals */}
      <TrailerModal
        visible={showTrailerModal}
        movie={movie}
        trailerUrl={movie.trailerUrl}
        accentColor={accentColor}
        onClose={() => setShowTrailerModal(false)}
      />
      <RatingModal
        visible={showRatingModal}
        movie={movie}
        movieTitle={movie.title}
        onClose={() => setShowRatingModal(false)}
        onRateSubmit={setUserRating}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  errorCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  backHomeBtn: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },
  backHomeText: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 99,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  glassCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)'
  },
  scrollContent: {
    paddingBottom: 40
  },
  heroWrap: {
    width: '100%',
    height: HERO_HEIGHT,
    position: 'relative',
    backgroundColor: '#141416'
  },
  heroImg: {
    width: '100%',
    height: '100%'
  },
  heroFadeGrad: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  heroTrailerBtn: {
    position: 'absolute',
    bottom: 20,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)'
  },
  heroTrailerIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E50914',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heroTrailerText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800'
  },
  mainCard: {
    paddingHorizontal: 18,
    marginTop: 16
  },
  movieTitle: {
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 28
  },
  movieOriginalTitle: {
    fontSize: 13,
    marginTop: 4
  },
  metaChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D4AF37'
  },
  ratingPillText: {
    color: '#D4AF37',
    fontSize: 11,
    fontWeight: '800'
  },
  specPill: {
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  specPillText: {
    fontSize: 10,
    fontWeight: '800'
  },
  specPillMuted: {
    color: '#8E8E93',
    fontSize: 10,
    fontWeight: '700'
  },
  metaDotText: {
    fontSize: 10
  },
  metaText: {
    fontSize: 11.5,
    fontWeight: '600'
  },
  genreTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10
  },
  genreTag: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6
  },
  genreTagText: {
    fontSize: 11,
    fontWeight: '600'
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16
  },
  primaryPlayBtn: {
    flex: 1.6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6
  },
  primaryPlayText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  secondaryTrailerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1
  },
  secondaryTrailerText: {
    fontSize: 12.5,
    fontWeight: '700'
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    marginTop: 16
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4
  },
  actionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '600'
  },
  actorsSection: {
    marginTop: 22
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800'
  },
  sectionCountText: {
    fontSize: 11
  },
  actorsScroll: {
    gap: 14,
    paddingRight: 10
  },
  actorItem: {
    alignItems: 'center',
    width: 78
  },
  actorAvatarWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E1E22'
  },
  actorAvatarImg: {
    width: '100%',
    height: '100%'
  },
  actorTagBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 1,
    alignItems: 'center'
  },
  actorTagText: {
    color: '#FFFFFF',
    fontSize: 7.5,
    fontWeight: '800'
  },
  actorName: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center'
  },
  actorRole: {
    fontSize: 9.5,
    marginTop: 1,
    textAlign: 'center'
  },
  tabsWrap: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    marginTop: 20
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700'
  },
  tabContentBlock: {
    marginTop: 16
  },
  overviewParagraph: {
    fontSize: 13,
    lineHeight: 20
  },
  specsTable: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    marginTop: 14,
    gap: 10
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  specsKey: {
    fontSize: 12,
    fontWeight: '500'
  },
  specsVal: {
    fontSize: 12.5,
    fontWeight: '700'
  },
  specsDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  },
  similarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  similarCard: {
    width: SIMILAR_CARD_WIDTH
  },
  similarPosterWrap: {
    width: '100%',
    height: SIMILAR_CARD_WIDTH * 1.48,
    borderRadius: 10,
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
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4
  },
  similarRatingText: {
    color: '#D4AF37',
    fontSize: 9,
    fontWeight: '800'
  },
  similarTitle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 5
  }
});
