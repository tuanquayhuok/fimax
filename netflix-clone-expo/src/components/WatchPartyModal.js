import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { ApiService } from '../services/apiService';
import { MOCK_MOVIES } from '../data/mockMovies';

const { width } = Dimensions.get('window');

const REACTIONS = ['🍿', '❤️', '🔥', '👏', '🤣', '😱', '🎉'];

export const WatchPartyModal = ({ visible, onClose, initialMovie = null }) => {
  const {
    user,
    themeMode,
    accentColor,
    activeWatchParty,
    createWatchParty,
    joinWatchParty,
    leaveWatchParty,
    setActiveMovieForPlayer
  } = useContext(AppContext);

  const theme = getThemeColors(themeMode);

  // Dynamic movie catalog synced with app/backend
  const [movieCatalog, setMovieCatalog] = useState(MOCK_MOVIES);
  const [tab, setTab] = useState(activeWatchParty ? 'active' : 'create');
  const [roomName, setRoomName] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(initialMovie || MOCK_MOVIES[0]);
  const [inputCode, setInputCode] = useState('');

  // Fetch real movie database
  useEffect(() => {
    async function fetchMovies() {
      try {
        const list = await ApiService.getAllMovies();
        if (list && list.length > 0) {
          setMovieCatalog(list);
          if (!initialMovie && !selectedMovie) {
            setSelectedMovie(list[0]);
          }
        }
      } catch (e) {
        // Fallback to mock movies
      }
    }
    fetchMovies();
  }, []);

  // Synchronize when initialMovie is passed (from player or detail)
  useEffect(() => {
    if (initialMovie) {
      setSelectedMovie(initialMovie);
    }
  }, [initialMovie, visible]);

  // Active Room State
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'Minh Trí (Host)', text: 'Chào mừng các bạn vào xem chung nhé! Chuẩn bị bắp nước nào 🍿', time: 'Vừa xong', isHost: true },
    { id: '2', sender: 'Phương Thảo', text: 'Phim này 4K nét dã man 🔥', time: 'Vừa xong' }
  ]);
  const [inputChat, setInputChat] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  useEffect(() => {
    if (activeWatchParty) {
      setTab('active');
    }
  }, [activeWatchParty]);

  if (!visible) return null;

  const handleCreateRoom = () => {
    if (!selectedMovie) {
      Alert.alert('Thông báo', 'Vui lòng chọn một bộ phim để xem chung.');
      return;
    }
    const room = createWatchParty(selectedMovie, roomName.trim());
    setTab('active');
    Alert.alert(
      '🎉 Tạo Phòng Thành Công!',
      `Mã phòng của bạn là: ${room.roomCode}\nHãy chia sẻ mã này cho bạn bè cùng vào xem phim đồng bộ!`
    );
  };

  const handleJoinRoom = () => {
    if (!inputCode.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập mã phòng (Ví dụ: FMX-8899).');
      return;
    }
    const room = joinWatchParty(inputCode.trim(), selectedMovie);
    setTab('active');
    Alert.alert('Tham Gia Thành Công! 🎉', `Đã kết nối vào phòng "${room.name}".`);
  };

  const handleSendChat = () => {
    if (!inputChat.trim()) return;
    const newMsg = {
      id: 'msg_' + Date.now(),
      sender: user ? user.name : 'Bạn',
      text: inputChat.trim(),
      time: 'Vừa xong',
      isHost: activeWatchParty?.host?.id === user?.id
    };
    setChatMessages(prev => [...prev, newMsg]);
    setInputChat('');
  };

  const handleReaction = (emoji) => {
    const id = Date.now();
    setFloatingEmojis(prev => [...prev, { id, emoji }]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 2000);
  };

  const handleStartMovie = () => {
    if (activeWatchParty?.movie) {
      onClose();
      if (setActiveMovieForPlayer) {
        setActiveMovieForPlayer(activeWatchParty.movie);
      }
    }
  };

  const handleLeave = () => {
    Alert.alert(
      'Rời Phòng Xem Chung',
      'Bạn có chắc chắn muốn rời khỏi phòng xem phim này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Rời Phòng',
          style: 'destructive',
          onPress: () => {
            leaveWatchParty();
            setTab('create');
          }
        }
      ]
    );
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
              <View style={[styles.iconBoxMini, { backgroundColor: theme.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.07)', borderColor: theme.borderLight }]}>
                <Ionicons name="people-outline" size={20} color={theme.textPrimary} />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
                  Phòng Xem Chung (Watch Party)
                </Text>
                <Text style={[styles.headerSub, { color: theme.textMuted }]}>
                  Xem phim & trò chuyện đồng bộ cùng bạn bè
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Tab Switcher if not in active room */}
          {!activeWatchParty && (
            <View style={[styles.tabBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <TouchableOpacity
                style={[styles.tabItem, tab === 'create' && { backgroundColor: accentColor }]}
                onPress={() => setTab('create')}
              >
                <Ionicons name="add-circle-outline" size={16} color={tab === 'create' ? '#FFFFFF' : theme.textMuted} />
                <Text style={[styles.tabText, { color: tab === 'create' ? '#FFFFFF' : theme.textMuted }]}>
                  Tạo Phòng Mới
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabItem, tab === 'join' && { backgroundColor: accentColor }]}
                onPress={() => setTab('join')}
              >
                <Ionicons name="enter-outline" size={16} color={tab === 'join' ? '#FFFFFF' : theme.textMuted} />
                <Text style={[styles.tabText, { color: tab === 'join' ? '#FFFFFF' : theme.textMuted }]}>
                  Nhập Mã Vào Phòng
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* TAB 1: CREATE ROOM */}
          {tab === 'create' && !activeWatchParty && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>TÊN PHÒNG XEM PHIM:</Text>
              <TextInput
                style={[styles.inputField, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.textPrimary }]}
                placeholder="Ví dụ: Rạp Phim Hội Bạn Thân 🍿"
                placeholderTextColor={theme.textMuted}
                value={roomName}
                onChangeText={setRoomName}
              />

              <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 14 }]}>
                CHỌN PHIM ĐỂ XEM CÙNG NHAU ({movieCatalog.length} Phim Có Sẵn):
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moviePickerScroll}>
                {movieCatalog.map((m) => {
                  const isPicked = selectedMovie?.id === m.id;
                  const poster = m.posterUrl || m.poster || m.backdropUrl;
                  return (
                    <TouchableOpacity
                      key={m.id}
                      style={[
                        styles.moviePickCard,
                        { borderColor: isPicked ? accentColor : theme.border, backgroundColor: theme.surface }
                      ]}
                      onPress={() => setSelectedMovie(m)}
                      activeOpacity={0.85}
                    >
                      <Image source={{ uri: poster }} style={styles.moviePickImg} resizeMode="cover" />
                      {isPicked && (
                        <View style={[styles.pickedBadge, { backgroundColor: accentColor }]}>
                          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                        </View>
                      )}
                      <Text style={[styles.moviePickTitle, { color: isPicked ? accentColor : theme.textPrimary }]} numberOfLines={1}>
                        {m.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={[styles.featuresCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.featureItem}>
                  <Ionicons name="sync-outline" size={18} color={theme.textPrimary} />
                  <Text style={[styles.featureText, { color: theme.textSecondary }]}>Đồng bộ tua phim & tạm dừng tự động</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="chatbubbles-outline" size={18} color={theme.textPrimary} />
                  <Text style={[styles.featureText, { color: theme.textSecondary }]}>Phòng chat trực tiếp & gửi reaction cảm xúc</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="shield-checkmark-outline" size={18} color={theme.textPrimary} />
                  <Text style={[styles.featureText, { color: theme.textSecondary }]}>Chất lượng 4K HDR & âm thanh Dolby vòm</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.primaryActionBtn, { backgroundColor: accentColor }]}
                activeOpacity={0.85}
                onPress={handleCreateRoom}
              >
                <Ionicons name="sparkles" size={18} color="#FFFFFF" />
                <Text style={styles.primaryActionBtnText}>TẠO PHÒNG & MỜI BẠN BÈ</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* TAB 2: JOIN ROOM */}
          {tab === 'join' && !activeWatchParty && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
              <View style={[styles.joinIntroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Ionicons name="key-outline" size={32} color={accentColor} />
                <Text style={[styles.joinIntroTitle, { color: theme.textPrimary }]}>Nhập Mã Phòng Watch Party</Text>
                <Text style={[styles.joinIntroSub, { color: theme.textMuted }]}>
                  Nhập mã 6 ký tự do chủ phòng cung cấp để tham gia xem phim ngay.
                </Text>
              </View>

              <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 14 }]}>MÃ PHÒNG (ROOM CODE):</Text>
              <TextInput
                style={[
                  styles.codeInputField,
                  { backgroundColor: theme.inputBg, borderColor: accentColor, color: theme.textPrimary }
                ]}
                placeholder="FMX-8899"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="characters"
                value={inputCode}
                onChangeText={setInputCode}
              />

              <TouchableOpacity
                style={[styles.primaryActionBtn, { backgroundColor: accentColor, marginTop: 20 }]}
                activeOpacity={0.85}
                onPress={handleJoinRoom}
              >
                <Ionicons name="log-in-outline" size={18} color="#FFFFFF" />
                <Text style={styles.primaryActionBtnText}>VÀO PHÒNG XEM NGAY</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* TAB 3: ACTIVE ROOM (WATCH PARTY LIVE) */}
          {(tab === 'active' || activeWatchParty) && activeWatchParty && (
            <View style={styles.activeRoomWrap}>
              {/* Room Live Info Card */}
              <View style={[styles.roomLiveCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Image
                  source={{ uri: activeWatchParty.movie?.posterUrl || activeWatchParty.movie?.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400' }}
                  style={styles.roomMoviePoster}
                />
                <View style={styles.roomLiveInfo}>
                  <View style={styles.roomCodeRow}>
                    <View style={[styles.livePill, { backgroundColor: '#FF3B30' }]}>
                      <Text style={styles.livePillText}>ĐỒNG BỘ 4K</Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.codeBadge, { backgroundColor: `${accentColor}25` }]}
                      onPress={() => Alert.alert('Mã Phòng', `Đã sao chép mã phòng: ${activeWatchParty.roomCode}`)}
                    >
                      <Text style={[styles.codeBadgeText, { color: accentColor }]}>{activeWatchParty.roomCode}</Text>
                      <Ionicons name="copy-outline" size={12} color={accentColor} />
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.roomMovieTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                    {activeWatchParty.movie?.title || 'Phim Chiếu Rạp'}
                  </Text>
                  <Text style={[styles.roomHostName, { color: theme.textMuted }]}>
                    {activeWatchParty.movie?.duration || '115 phút'} • {activeWatchParty.movie?.releaseYear || 2026} • ⭐ {activeWatchParty.movie?.rating || 8.8}
                  </Text>
                  <Text style={[styles.roomHostSub, { color: accentColor }]}>
                    Chủ phòng: {activeWatchParty.host?.name || 'Khán giả FIMAX'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.startWatchBtn, { backgroundColor: accentColor }]}
                  onPress={handleStartMovie}
                  activeOpacity={0.85}
                >
                  <Ionicons name="play" size={16} color="#FFFFFF" />
                  <Text style={styles.startWatchBtnText}>Xem Ngay</Text>
                </TouchableOpacity>
              </View>

              {/* Members Avatar Row */}
              <View style={styles.membersRow}>
                <Text style={[styles.membersCount, { color: theme.textMuted }]}>
                  Thành viên ({activeWatchParty.members?.length || 1}):
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.membersScroll}>
                  {activeWatchParty.members?.map((m, idx) => (
                    <View key={idx} style={styles.memberAvatarWrap}>
                      <Image source={{ uri: m.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }} style={styles.memberAvatar} />
                      {m.isHost && (
                        <View style={styles.hostCrown}>
                          <Ionicons name="sparkles" size={8} color="#000000" />
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>
                <TouchableOpacity style={styles.leaveBtn} onPress={handleLeave}>
                  <Ionicons name="exit-outline" size={16} color="#FF3B30" />
                  <Text style={styles.leaveBtnText}>Rời</Text>
                </TouchableOpacity>
              </View>

              {/* Live Chat Box */}
              <View style={[styles.chatBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.chatScroll}>
                  {chatMessages.map((msg) => (
                    <View key={msg.id} style={styles.chatMsgRow}>
                      <Text style={[styles.chatSender, { color: msg.isHost ? '#D4AF37' : accentColor }]}>
                        {msg.sender}:{' '}
                      </Text>
                      <Text style={[styles.chatText, { color: theme.textPrimary }]}>{msg.text}</Text>
                    </View>
                  ))}
                </ScrollView>

                {/* Floating Emojis Reaction stream */}
                <View style={styles.floatingEmojiContainer} pointerEvents="none">
                  {floatingEmojis.map((e) => (
                    <Text key={e.id} style={styles.floatingEmojiText}>{e.emoji}</Text>
                  ))}
                </View>

                {/* Quick Emoji Reaction Pills */}
                <View style={styles.reactionsBar}>
                  {REACTIONS.map((em, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.reactionPill, { backgroundColor: theme.surfaceSecondary }]}
                      onPress={() => handleReaction(em)}
                      activeOpacity={0.7}
                    >
                      <Text style={{ fontSize: 16 }}>{em}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Chat Input */}
                <View style={[styles.chatInputRow, { borderTopColor: theme.border }]}>
                  <TextInput
                    style={[styles.chatInput, { backgroundColor: theme.inputBg, color: theme.textPrimary }]}
                    placeholder="Nhập tin nhắn bình luận..."
                    placeholderTextColor={theme.textMuted}
                    value={inputChat}
                    onChangeText={setInputChat}
                    onSubmitEditing={handleSendChat}
                  />
                  <TouchableOpacity
                    style={[styles.sendChatBtn, { backgroundColor: accentColor }]}
                    onPress={handleSendChat}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="send" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
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
    maxHeight: '90%',
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
  iconBoxMini: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1
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
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    gap: 4
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 8,
    gap: 6
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700'
  },
  scrollBody: {
    padding: 16,
    gap: 6
  },
  inputLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginLeft: 2,
    marginBottom: 4
  },
  inputField: {
    height: 46,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 13,
    borderWidth: 1
  },
  codeInputField: {
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
    borderWidth: 1.5
  },
  moviePickerScroll: {
    gap: 10,
    paddingVertical: 6
  },
  moviePickCard: {
    width: 90,
    borderRadius: 10,
    padding: 6,
    borderWidth: 1.5,
    position: 'relative'
  },
  moviePickImg: {
    width: '100%',
    height: 110,
    borderRadius: 6
  },
  pickedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  moviePickTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center'
  },
  featuresCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    marginTop: 10,
    gap: 8
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  featureText: {
    fontSize: 11.5,
    fontWeight: '500'
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 14,
    gap: 8
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  joinIntroCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6
  },
  joinIntroTitle: {
    fontSize: 14,
    fontWeight: '800'
  },
  joinIntroSub: {
    fontSize: 11,
    textAlign: 'center'
  },

  // Active Room Styles
  activeRoomWrap: {
    padding: 14,
    gap: 10,
    flex: 1
  },
  roomLiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10
  },
  roomMoviePoster: {
    width: 44,
    height: 58,
    borderRadius: 6
  },
  roomLiveInfo: {
    flex: 1,
    gap: 2
  },
  roomCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  livePill: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 3
  },
  livePillText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900'
  },
  codeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    gap: 3
  },
  codeBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  roomMovieTitle: {
    fontSize: 13,
    fontWeight: '800'
  },
  roomHostName: {
    fontSize: 10.5
  },
  roomHostSub: {
    fontSize: 10,
    fontWeight: '700'
  },
  startWatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4
  },
  startWatchBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2
  },
  membersCount: {
    fontSize: 10.5,
    fontWeight: '700'
  },
  membersScroll: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 8
  },
  memberAvatarWrap: {
    position: 'relative'
  },
  memberAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#30D158'
  },
  hostCrown: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#D4AF37',
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  leaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    gap: 3
  },
  leaveBtnText: {
    color: '#FF3B30',
    fontSize: 10,
    fontWeight: '700'
  },
  chatBox: {
    height: 210,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative'
  },
  chatScroll: {
    padding: 10,
    gap: 6
  },
  chatMsgRow: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  chatSender: {
    fontSize: 11.5,
    fontWeight: '700'
  },
  chatText: {
    fontSize: 11.5
  },
  floatingEmojiContainer: {
    position: 'absolute',
    right: 14,
    bottom: 70,
    alignItems: 'center'
  },
  floatingEmojiText: {
    fontSize: 28,
    marginBottom: 4
  },
  reactionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 4,
    paddingHorizontal: 6
  },
  reactionPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderTopWidth: 1,
    gap: 6
  },
  chatInput: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 12,
    fontSize: 12
  },
  sendChatBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  }
});