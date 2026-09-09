import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';

const GENRE_SUGGESTIONS = [
  'Chiếu Rạp Việt Nam',
  'Hành Động / Võ Thuật',
  'Kinh Dị / Giật Gân',
  'Hoạt Hình / Anime',
  'Hàn Quốc / K-Drama',
  'Khoa Học Viễn Tưởng',
  'Hài Hước / Gia Đình'
];

export const MovieRequestModal = ({ visible, onClose }) => {
  const {
    themeMode,
    accentColor,
    movieRequests,
    submitMovieRequest,
    upvoteMovieRequest
  } = useContext(AppContext);

  const theme = getThemeColors(themeMode);

  const [movieTitle, setMovieTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(GENRE_SUGGESTIONS[0]);
  const [note, setNote] = useState('');
  const [votedIds, setVotedIds] = useState([]);

  if (!visible) return null;

  const handleSubmit = () => {
    if (!movieTitle.trim()) {
      Alert.alert('Thông Báo', 'Vui lòng nhập tên bộ phim bạn muốn yêu cầu.');
      return;
    }

    const res = submitMovieRequest(movieTitle, releaseYear, selectedGenre, note);
    if (res.success) {
      Alert.alert('🎬 Đã Gửi Yêu Cầu!', res.message);
      setMovieTitle('');
      setReleaseYear('');
      setNote('');
    } else {
      Alert.alert('Thông Báo', res.message);
    }
  };

  const handleVote = (reqId) => {
    if (votedIds.includes(reqId)) {
      Alert.alert('Thông Báo', 'Bạn đã bình chọn cho phim này rồi!');
      return;
    }
    upvoteMovieRequest(reqId);
    setVotedIds(prev => [...prev, reqId]);
    Alert.alert('Bình Chọn Thành Công! 👍', 'Đã cộng +1 lượt bình chọn cho phim.');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.container, { backgroundColor: theme.isLight ? '#FFFFFF' : '#101014', borderColor: theme.border }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconCircle, { backgroundColor: `${accentColor}20` }]}>
                <Ionicons name="film-outline" size={20} color={accentColor} />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
                  Yêu Cầu Thêm Phim Mới
                </Text>
                <Text style={[styles.headerSub, { color: theme.textMuted }]}>
                  Gửi tên phim bạn muốn rạp FIMAX cập nhật bản 4K
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Form Box */}
            <View style={[styles.formCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>TÊN BỘ PHIM (BẮT BUỘC):</Text>
              <TextInput
                style={[styles.inputField, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
                placeholder="Ví dụ: Đất Rừng Phương Nam, Dune 2..."
                placeholderTextColor={theme.textMuted}
                value={movieTitle}
                onChangeText={setMovieTitle}
              />

              <View style={styles.rowInputs}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>NĂM PHÁT HÀNH:</Text>
                  <TextInput
                    style={[styles.inputField, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
                    placeholder="2026"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="numeric"
                    value={releaseYear}
                    onChangeText={setReleaseYear}
                  />
                </View>
              </View>

              <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 10 }]}>THỂ LOẠI PHIM:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.genresScroll}>
                {GENRE_SUGGESTIONS.map((g, idx) => {
                  const isSelected = selectedGenre === g;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.genrePill,
                        {
                          backgroundColor: isSelected ? accentColor : theme.surfaceSecondary,
                          borderColor: isSelected ? accentColor : theme.border
                        }
                      ]}
                      onPress={() => setSelectedGenre(g)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.genrePillText, { color: isSelected ? '#FFFFFF' : theme.textPrimary }]}>
                        {g}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 10 }]}>GHI CHÚ / LINK TRAILER (TÙY CHỌN):</Text>
              <TextInput
                style={[styles.textAreaField, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
                placeholder="Ví dụ: Phim chiếu rạp có phụ đề tiếng Việt chuẩn..."
                placeholderTextColor={theme.textMuted}
                multiline
                numberOfLines={3}
                value={note}
                onChangeText={setNote}
              />

              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: accentColor }]}
                onPress={handleSubmit}
                activeOpacity={0.85}
              >
                <Ionicons name="send" size={16} color="#FFFFFF" />
                <Text style={styles.submitBtnText}>GỬI YÊU CẦU PHIM NGAY</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end'
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingBottom: 20,
    borderWidth: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  headerSub: {
    fontSize: 10.5,
    marginTop: 1
  },
  closeBtn: {
    padding: 6
  },
  scrollBody: {
    padding: 16,
    gap: 10
  },
  formCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 6
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginLeft: 2,
    marginBottom: 2
  },
  inputField: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    borderWidth: 1
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6
  },
  genresScroll: {
    gap: 6,
    paddingVertical: 4
  },
  genrePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1
  },
  genrePillText: {
    fontSize: 11,
    fontWeight: '700'
  },
  textAreaField: {
    height: 60,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    borderWidth: 1,
    textAlignVertical: 'top'
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
    gap: 6
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.5
  },

  // Leaderboard
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginLeft: 2
  },
  requestsList: {
    gap: 8,
    marginTop: 4
  },
  reqCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10
  },
  reqContent: {
    flex: 1,
    gap: 3
  },
  reqTitle: {
    fontSize: 13,
    fontWeight: '700',
    maxWidth: '75%'
  },
  reqYear: {
    fontSize: 11
  },
  reqGenre: {
    fontSize: 10.5
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
    gap: 4
  },
  statusBadgeText: {
    fontSize: 9.5,
    fontWeight: '800'
  },
  voteBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 2,
    minWidth: 46
  },
  voteNum: {
    fontSize: 11,
    fontWeight: '800'
  }
});