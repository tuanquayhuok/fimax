import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { ApiService, subscribeMovieUpdates } from '../services/apiService';
import { MOCK_MOVIES } from '../data/mockMovies';
import { CinemaImage } from '../components/CinemaImage';
import { TrailerModal } from '../components/TrailerModal';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const BACKDROP_HEIGHT = Math.round(CARD_WIDTH * (9 / 16));

const COMING_SOON_DATA = [
  {
    id: 'cs_1',
    title: 'Avatar 3: Lửa Và Tro Tàn',
    originalTitle: 'Avatar: Fire and Ash (2025)',
    releaseDate: '19/12/2025',
    releaseDaysLeft: 106,
    genres: ['Hành Động', 'Khoa Học Viễn Tưởng', 'Phiêu Lưu'],
    director: 'James Cameron',
    overview: 'Hành trình tiếp theo của gia đình Jake Sully khám phá bộ tộc Người Tro (Ash People) đầy bí ẩn và tàn bạo trên hành tinh Pandora xinh đẹp.',
    backdropUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1200&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0'
  },
  {
    id: 'cs_2',
    title: 'Đất Rừng Phương Nam 2',
    originalTitle: 'Song of the South Season 2',
    releaseDate: '25/01/2026',
    releaseDaysLeft: 143,
    genres: ['Điện ảnh', 'Lịch Sử', 'Phiêu Lưu'],
    director: 'Nguyễn Quang Dũng',
    overview: 'Cuộc phiêu lưu tiếp theo của bé An cùng Út Lục Lâm trên hành trình tìm cha và khám phá vẻ đẹp hào hùng của đất rừng Nam Bộ xưa.',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=yF2pXRJictA'
  },
  {
    id: 'cs_3',
    title: 'Avengers: Doomsday',
    originalTitle: 'Avengers: Doomsday (2026)',
    releaseDate: '01/05/2026',
    releaseDaysLeft: 240,
    genres: ['Bom Tấn', 'Siêu Anh Hùng', 'Marvel'],
    director: 'Anh em nhà Russo',
    overview: 'Sự trở lại vĩ đại của Robert Downey Jr. trong vai phản diện tối thượng Doctor Doom, đe dọa sự tồn vong của toàn bộ Đa vũ trụ Marvel.',
    backdropUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=BwPL0Md_QFQ'
  }
];

export const ComingSoonScreen = ({ navigation }) => {
  const { themeMode, accentColor, fontSizeScale, showNotificationPopup } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  const [reminders, setReminders] = useState([]);
  const [activeTrailerMovie, setActiveTrailerMovie] = useState(null);

  const toggleReminder = (movie) => {
    const isSet = reminders.includes(movie.id);
    if (isSet) {
      setReminders(prev => prev.filter(id => id !== movie.id));
      Alert.alert('Đã hủy thông báo', `Đã tắt nhắc nhở cho phim "${movie.title}".`);
    } else {
      setReminders(prev => [...prev, movie.id]);
      Alert.alert(
        'Đã Đặt Lịch Nhắc!',
        `Hệ thống sẽ tự động gửi thông báo Apple iOS vào ngày ${movie.releaseDate} khi phim "${movie.title}" chính thức công chiếu!`,
        [{ text: 'Tuyệt vời' }]
      );

      showNotificationPopup(
        '🔔 ĐÃ ĐẶT NHẮC LỊCH CHIẾU',
        `Bạn sẽ nhận được thông báo ngay khi "${movie.title}" khởi chiếu vào ngày ${movie.releaseDate}.`,
        movie,
        'movie'
      );
    }
  };

  const renderComingSoonItem = ({ item: movie }) => {
    const isReminded = reminders.includes(movie.id);

    return (
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {/* Backdrop 16:9 with Play Trailer overlay */}
        <View style={styles.imageWrap}>
          <CinemaImage uri={movie.backdropUrl} fallbackUri={movie.posterUrl} style={styles.image} resizeMode="cover" />
          <View style={styles.imageDarkGrad} />

          {/* Release Date Badge */}
          <View style={[styles.releaseBadge, { backgroundColor: accentColor }]}>
            <Ionicons name="calendar" size={11} color="#FFFFFF" />
            <Text style={styles.releaseBadgeText}>Khởi chiếu: {movie.releaseDate}</Text>
          </View>

          {/* Days left pill */}
          <View style={styles.daysLeftPill}>
            <Text style={styles.daysLeftText}>Còn {movie.releaseDaysLeft} ngày</Text>
          </View>

          {/* Center Play Trailer Button */}
          <TouchableOpacity
            style={styles.trailerCenterBtn}
            activeOpacity={0.85}
            onPress={() => setActiveTrailerMovie(movie)}
          >
            <Ionicons name="play" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.contentWrap}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
                {movie.title}
              </Text>
              <Text style={[styles.originalTitle, { color: theme.textMuted }]}>
                {movie.originalTitle} • Đạo diễn: {movie.director}
              </Text>
            </View>

            {/* Remind Me Button */}
            <TouchableOpacity
              style={[
                styles.remindBtn,
                { backgroundColor: isReminded ? `${accentColor}1A` : theme.surfaceSecondary, borderColor: isReminded ? accentColor : theme.border }
              ]}
              activeOpacity={0.8}
              onPress={() => toggleReminder(movie)}
            >
              <Ionicons
                name={isReminded ? "notifications" : "notifications-outline"}
                size={18}
                color={isReminded ? accentColor : theme.textPrimary}
              />
              <Text style={[styles.remindBtnText, { color: isReminded ? accentColor : theme.textPrimary }]}>
                {isReminded ? 'Đã Đặt Nhắc' : 'Nhắc Tôi'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Genres */}
          <View style={styles.genreRow}>
            {movie.genres.map((g, idx) => (
              <View key={idx} style={[styles.genrePill, { backgroundColor: theme.surfaceSecondary }]}>
                <Text style={[styles.genreText, { color: theme.textSecondary }]}>{g}</Text>
              </View>
            ))}
          </View>

          {/* Overview */}
          <Text style={[styles.overview, { color: theme.textSecondary }]} numberOfLines={3}>
            {movie.overview}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: theme.textPrimary, fontSize: 26 * fontSizeScale }]}>
          Lịch Chiếu & Sắp Ra Mắt
        </Text>
        <Text style={[styles.screenSubtitle, { color: theme.textMuted }]}>
          Đăng ký nhận thông báo sớm nhất khi phim ra rạp
        </Text>
      </View>

      <FlatList
        data={COMING_SOON_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderComingSoonItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Trailer Modal */}
      {activeTrailerMovie && (
        <TrailerModal
          visible={!!activeTrailerMovie}
          movie={activeTrailerMovie}
          trailerUrl={activeTrailerMovie.trailerUrl}
          accentColor={accentColor}
          onClose={() => setActiveTrailerMovie(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54
  },
  header: {
    paddingHorizontal: 18,
    marginBottom: 14
  },
  screenTitle: {
    fontWeight: '900',
    letterSpacing: -0.5
  },
  screenSubtitle: {
    fontSize: 12,
    marginTop: 2
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  imageWrap: {
    width: '100%',
    height: BACKDROP_HEIGHT,
    position: 'relative',
    backgroundColor: '#1E1E24'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  imageDarkGrad: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  releaseBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  releaseBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  daysLeftPill: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  daysLeftText: {
    color: '#FFD700',
    fontSize: 10.5,
    fontWeight: '800'
  },
  trailerCenterBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -24,
    marginLeft: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)'
  },
  contentWrap: {
    padding: 14
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 10
  },
  title: {
    fontSize: 16,
    fontWeight: '800'
  },
  originalTitle: {
    fontSize: 11.5,
    marginTop: 2
  },
  remindBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1
  },
  remindBtnText: {
    fontSize: 11.5,
    fontWeight: '700'
  },
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10
  },
  genrePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5
  },
  genreText: {
    fontSize: 10.5,
    fontWeight: '500'
  },
  overview: {
    fontSize: 12,
    lineHeight: 17
  }
});
