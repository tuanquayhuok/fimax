import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { WatchPartyModal } from './WatchPartyModal';
import { DailyCheckInRewardsModal } from './DailyCheckInRewardsModal';
import { MovieRequestModal } from './MovieRequestModal';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(width * 0.82, 340);

export const HamburgerMenuModal = ({ visible, onClose, navigation }) => {
  const {
    user,
    logout,
    themeMode,
    accentColor,
    frameRate,
    setFrameRate,
    fimaxPoints
  } = useContext(AppContext);

  const theme = getThemeColors(themeMode);

  // Sub-Modals
  const [showWatchParty, setShowWatchParty] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showMovieRequest, setShowMovieRequest] = useState(false);
  const [sleepTimer, setSleepTimer] = useState(null); // in minutes: 15, 30, 45, 60

  if (!visible) return null;

  const handleNavigate = (tabName, screenName = null) => {
    onClose();
    if (navigation) {
      if (screenName) {
        navigation.navigate(tabName, { screen: screenName });
      } else {
        navigation.navigate(tabName);
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng Xuất',
      'Bạn có chắc chắn muốn đăng xuất tài khoản FIMAX?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng Xuất',
          style: 'destructive',
          onPress: () => {
            logout();
            onClose();
            Alert.alert('Thành công', 'Bạn đã đăng xuất tài khoản thành công.');
          }
        }
      ]
    );
  };

  const handleSetSleepTimer = (mins) => {
    setSleepTimer(mins);
    if (mins) {
      Alert.alert(
        'Hẹn Giờ Tắt Phim ⏱️',
        `Đã hẹn giờ tự động dừng phát phim sau ${mins} phút. Chúc bạn có giấc ngủ ngon!`
      );
    } else {
      Alert.alert('Hẹn Giờ Tắt Phim', 'Đã tắt tính năng hẹn giờ.');
    }
  };

  const handleSetFrameRate = (fps) => {
    setFrameRate(fps);
    let desc = '';
    if (fps === 30) desc = 'Chế độ 30 FPS (Tiết kiệm pin) đã kích hoạt.';
    else if (fps === 45) desc = 'Chế độ 45 FPS (Cân bằng hiệu năng) đã kích hoạt.';
    else if (fps === 60) desc = 'Chế độ 60 FPS (Chuẩn mượt mà điện ảnh) đã kích hoạt.';
    else if (fps === 90) desc = 'Chế độ 90 FPS ProMotion (Siêu mượt 90Hz) đã kích hoạt!';
    else if (fps === 120) desc = 'Chế độ 120 FPS Ultra Extreme (Cực đại siêu mượt 120Hz) đã kích hoạt!';
    Alert.alert(`Tốc Độ Khung Hình ${fps} FPS ⚡`, desc);
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          {/* Tap outside backdrop to close */}
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          {/* Right Sliding Drawer */}
          <View style={[styles.drawerContainer, { backgroundColor: theme.isLight ? '#FFFFFF' : '#101014', borderLeftColor: theme.border }]}>
            {/* Drawer Header with Close Button */}
            <View style={[styles.drawerHeader, { borderBottomColor: theme.border }]}>
              <View style={styles.brandRow}>
                <Text style={[styles.brandRed, { color: accentColor }]}>F</Text>
                <Text style={[styles.brandWhite, { color: theme.textPrimary }]}>IMAX</Text>
                <View style={[styles.menuTagBadge, { backgroundColor: `${accentColor}20` }]}>
                  <Text style={[styles.menuTagText, { color: accentColor }]}>MENU</Text>
                </View>
              </View>

              <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                <Ionicons name="close" size={22} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.drawerScroll}>
              {/* User Profile / Guest Card */}
              {user ? (
                <TouchableOpacity
                  style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  activeOpacity={0.85}
                  onPress={() => handleNavigate('AccountTab')}
                >
                  <View style={styles.profileTopRow}>
                    <Image
                      source={{ uri: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80' }}
                      style={[styles.profileAvatar, { borderColor: accentColor }]}
                    />
                    <View style={styles.profileInfo}>
                      <View style={styles.nameBadgeRow}>
                        <Text style={[styles.profileName, { color: theme.textPrimary }]} numberOfLines={1}>
                          {user.name || 'Khán giả FIMAX'}
                        </Text>
                        {user.isVip && (
                          <View style={styles.vipBadge}>
                            <Text style={styles.vipBadgeText}>VIP</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.profileEmail, { color: theme.textMuted }]} numberOfLines={1}>
                        {user.email}
                      </Text>
                      <Text style={[styles.memberIdText, { color: accentColor }]}>
                        {user.plan || (user.isVip ? 'Gói VIP Cinema 4K' : 'Thành viên Tiêu chuẩn')}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={[styles.guestCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <View style={[styles.guestIconCircle, { backgroundColor: `${accentColor}20` }]}>
                    <Ionicons name="person" size={24} color={accentColor} />
                  </View>
                  <Text style={[styles.guestTitle, { color: theme.textPrimary }]}>
                    Chào Mừng Đến FIMAX
                  </Text>
                  <Text style={[styles.guestSub, { color: theme.textMuted }]}>
                    Đăng nhập để xem phim 4K không quảng cáo và đồng bộ phim yêu thích.
                  </Text>
                  <TouchableOpacity
                    style={[styles.guestLoginBtn, { backgroundColor: accentColor }]}
                    activeOpacity={0.85}
                    onPress={() => handleNavigate('AccountTab')}
                  >
                    <Ionicons name="log-in-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.guestLoginBtnText}>Đăng Nhập / Đăng Ký</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* SECTION: BỘ SƯU TẬP & KHO PHIM */}
              <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>KHO PHIM & BỘ SƯU TẬP</Text>

              {/* 1. Danh Sách Yêu Thích */}
              <TouchableOpacity
                style={[styles.menuItemRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
                activeOpacity={0.8}
                onPress={() => handleNavigate('LibraryTab')}
              >
                <View style={[styles.menuItemIconBox, { backgroundColor: theme.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.07)', borderColor: theme.borderLight }]}>
                  <Ionicons name="heart-outline" size={18} color={theme.textPrimary} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemTitle, { color: theme.textPrimary }]}>Danh Sách Yêu Thích</Text>
                  <Text style={[styles.menuItemSub, { color: theme.textMuted }]}>Các bộ phim bạn đã lưu lại</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
              </TouchableOpacity>

              {/* 2. Lịch Sử Xem Phim */}
              <TouchableOpacity
                style={[styles.menuItemRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
                activeOpacity={0.8}
                onPress={() => handleNavigate('LibraryTab')}
              >
                <View style={[styles.menuItemIconBox, { backgroundColor: theme.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.07)', borderColor: theme.borderLight }]}>
                  <Ionicons name="time-outline" size={18} color={theme.textPrimary} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemTitle, { color: theme.textPrimary }]}>Lịch Sử Xem Phim</Text>
                  <Text style={[styles.menuItemSub, { color: theme.textMuted }]}>Tiếp tục xem các tập dang dở</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
              </TouchableOpacity>

              {/* 3. Phòng Xem Chung (Watch Party) */}
              <TouchableOpacity
                style={[styles.menuItemRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
                activeOpacity={0.8}
                onPress={() => {
                  onClose();
                  setShowWatchParty(true);
                }}
              >
                <View style={[styles.menuItemIconBox, { backgroundColor: theme.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.07)', borderColor: theme.borderLight }]}>
                  <Ionicons name="people-outline" size={18} color={theme.textPrimary} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemTitle, { color: theme.textPrimary }]}>Phòng Xem Chung (Watch Party)</Text>
                  <Text style={[styles.menuItemSub, { color: theme.textMuted }]}>Tạo room xem phim & live chat cùng bạn bè</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
              </TouchableOpacity>

              {/* 4. Điểm Danh Nhận Điểm & Đổi Quà (F-Points) */}
              <TouchableOpacity
                style={[styles.menuItemRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
                activeOpacity={0.8}
                onPress={() => {
                  onClose();
                  setShowCheckIn(true);
                }}
              >
                <View style={[styles.menuItemIconBox, { backgroundColor: theme.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.07)', borderColor: theme.borderLight }]}>
                  <Ionicons name="gift-outline" size={18} color={theme.textPrimary} />
                </View>
                <View style={styles.menuItemContent}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[styles.menuItemTitle, { color: theme.textPrimary }]}>Điểm Danh & Đổi Quà VIP</Text>
                    <View style={[styles.pointsBadge, { backgroundColor: 'rgba(212, 175, 55, 0.15)', borderColor: 'rgba(212, 175, 55, 0.3)', borderWidth: 0.5 }]}>
                      <Text style={styles.pointsBadgeText}>{fimaxPoints || 0} PTS</Text>
                    </View>
                  </View>
                  <Text style={[styles.menuItemSub, { color: theme.textMuted }]}>Tích lũy 7 ngày đổi vé rạp, bắp nước & VIP</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
              </TouchableOpacity>

              {/* 5. Yêu Cầu Thêm Phim Mới */}
              <TouchableOpacity
                style={[styles.menuItemRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
                activeOpacity={0.8}
                onPress={() => {
                  onClose();
                  setShowMovieRequest(true);
                }}
              >
                <View style={[styles.menuItemIconBox, { backgroundColor: theme.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.07)', borderColor: theme.borderLight }]}>
                  <Ionicons name="film-outline" size={18} color={theme.textPrimary} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemTitle, { color: theme.textPrimary }]}>Yêu Cầu Thêm Phim Mới</Text>
                  <Text style={[styles.menuItemSub, { color: theme.textMuted }]}>Gửi tên phim bạn muốn rạp cập nhật</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
              </TouchableOpacity>

              {/* 6. TỐC ĐỘ KHUNG HÌNH (FPS: 30, 45, 60, 90, 120) */}
              <View style={[styles.fpsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.fpsHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={[styles.menuItemIconBox, { width: 28, height: 28, borderRadius: 7, backgroundColor: theme.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.07)', borderColor: theme.borderLight }]}>
                      <Ionicons name="speedometer-outline" size={15} color={theme.textPrimary} />
                    </View>
                    <Text style={[styles.menuItemTitle, { color: theme.textPrimary }]}>Tốc Độ Khung Hình</Text>
                  </View>
                  <View style={[styles.fpsActivePill, { backgroundColor: `${accentColor}18`, borderColor: accentColor }]}>
                    <Text style={[styles.fpsActivePillText, { color: accentColor }]}>{frameRate} FPS</Text>
                  </View>
                </View>
                
                <Text style={[styles.fpsSubText, { color: theme.textMuted }]}>
                  {frameRate === 30 && '🔋 30 FPS - Tiết kiệm pin tối đa'}
                  {frameRate === 45 && '⚖️ 45 FPS - Cân bằng hiệu năng & pin'}
                  {frameRate === 60 && '⚡ 60 FPS - Chuẩn mượt mà điện ảnh'}
                  {frameRate === 90 && '🚀 90 FPS - ProMotion 90Hz siêu mượt'}
                  {frameRate === 120 && '💎 120 FPS - Ultra Extreme 120Hz mượt đỉnh cao'}
                </Text>

                <View style={styles.fpsPillsRow}>
                  {[30, 45, 60, 90, 120].map((fps) => {
                    const isSelected = frameRate === fps;
                    return (
                      <TouchableOpacity
                        key={fps}
                        style={[
                          styles.fpsPill,
                          {
                            backgroundColor: isSelected ? accentColor : (theme.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)'),
                            borderColor: isSelected ? accentColor : theme.borderLight
                          }
                        ]}
                        onPress={() => handleSetFrameRate(fps)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.fpsPillText, { color: isSelected ? '#FFFFFF' : theme.textPrimary }]}>
                          {fps}
                        </Text>
                        <Text style={[styles.fpsPillUnit, { color: isSelected ? 'rgba(255,255,255,0.85)' : theme.textMuted }]}>
                          FPS
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 7. Sleep Timer Quick Picker */}
              <View style={[styles.sleepTimerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.sleepTimerHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={[styles.menuItemIconBox, { width: 28, height: 28, borderRadius: 7, backgroundColor: theme.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.07)', borderColor: theme.borderLight }]}>
                      <Ionicons name="moon-outline" size={15} color={theme.textPrimary} />
                    </View>
                    <Text style={[styles.menuItemTitle, { color: theme.textPrimary }]}>Hẹn Giờ Tắt Phim (Sleep)</Text>
                  </View>
                  {sleepTimer && (
                    <View style={[styles.sleepActivePill, { backgroundColor: accentColor }]}>
                      <Text style={styles.sleepActivePillText}>{sleepTimer}p</Text>
                    </View>
                  )}
                </View>
                <View style={styles.sleepPillsRow}>
                  {[15, 30, 45, 60].map((mins) => {
                    const isSelected = sleepTimer === mins;
                    return (
                      <TouchableOpacity
                        key={mins}
                        style={[
                          styles.sleepPill,
                          {
                            backgroundColor: isSelected ? accentColor : (theme.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)'),
                            borderColor: isSelected ? accentColor : theme.borderLight
                          }
                        ]}
                        onPress={() => handleSetSleepTimer(isSelected ? null : mins)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.sleepPillText, { color: isSelected ? '#FFFFFF' : theme.textPrimary }]}>
                          {mins}p
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity
                    style={[styles.sleepPill, { backgroundColor: theme.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)', borderColor: theme.borderLight }]}
                    onPress={() => handleSetSleepTimer(null)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.sleepPillText, { color: theme.textMuted }]}>Tắt</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Đăng Xuất */}
              {user && (
                <TouchableOpacity
                  style={[styles.menuItemRow, { backgroundColor: 'rgba(255, 69, 58, 0.08)', borderColor: 'rgba(255, 69, 58, 0.2)', marginTop: 8 }]}
                  activeOpacity={0.8}
                  onPress={handleLogout}
                >
                  <View style={[styles.menuItemIconBox, { backgroundColor: 'rgba(255, 69, 58, 0.12)', borderColor: 'rgba(255, 69, 58, 0.25)' }]}>
                    <Ionicons name="log-out-outline" size={18} color="#FF453A" />
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={[styles.menuItemTitle, { color: '#FF453A', fontWeight: '700' }]}>Đăng Xuất</Text>
                    <Text style={[styles.menuItemSub, { color: 'rgba(255, 69, 58, 0.7)' }]}>Thoát tài khoản khỏi thiết bị</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#FF453A" />
                </TouchableOpacity>
              )}

              {/* Footer info */}
              <View style={styles.footerWrap}>
                <Text style={[styles.footerText, { color: theme.textMuted }]}>
                  FIMAX Cinema v2.5 (Build 2026.9)
                </Text>
                <Text style={[styles.footerSub, { color: theme.textMuted }]}>
                  Chuẩn Rạp Chiếu Phim 4K HDR & Dolby 5.1
                </Text>
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Sub-Modals */}
      <WatchPartyModal
        visible={showWatchParty}
        onClose={() => setShowWatchParty(false)}
      />

      <DailyCheckInRewardsModal
        visible={showCheckIn}
        onClose={() => setShowCheckIn(false)}
      />

      <MovieRequestModal
        visible={showMovieRequest}
        onClose={() => setShowMovieRequest(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.65)'
  },
  backdrop: {
    flex: 1
  },
  drawerContainer: {
    width: DRAWER_WIDTH,
    height: '100%',
    borderLeftWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20
  },
  drawerHeader: {
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  brandRed: {
    fontSize: 22,
    fontWeight: '900'
  },
  brandWhite: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5
  },
  menuTagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6
  },
  menuTagText: {
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  closeBtn: {
    padding: 6
  },
  drawerScroll: {
    padding: 14,
    gap: 10
  },

  // Profile Card
  profileCard: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    marginBottom: 6,
    gap: 10
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2
  },
  profileInfo: {
    flex: 1
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  profileName: {
    fontSize: 13.5,
    fontWeight: '700',
    flex: 1
  },
  vipBadge: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 3
  },
  vipBadgeText: {
    color: '#000000',
    fontSize: 8,
    fontWeight: '900'
  },
  profileEmail: {
    fontSize: 11,
    marginTop: 1
  },
  memberIdText: {
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 2
  },

  // Guest Card
  guestCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 6,
    gap: 6
  },
  guestIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2
  },
  guestTitle: {
    fontSize: 14,
    fontWeight: '800'
  },
  guestSub: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 15,
    paddingHorizontal: 8
  },
  guestLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 18,
    marginTop: 4,
    gap: 6
  },
  guestLoginBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },

  // Sections
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 2,
    marginLeft: 4
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10
  },
  menuItemIconBox: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1
  },
  menuItemIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuItemContent: {
    flex: 1
  },
  menuItemTitle: {
    fontSize: 12.5,
    fontWeight: '700'
  },
  menuItemSub: {
    fontSize: 10,
    marginTop: 1
  },
  pointsBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4
  },
  pointsBadgeText: {
    color: '#D4AF37',
    fontSize: 8.5,
    fontWeight: '900'
  },

  // FPS Card
  fpsCard: {
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    gap: 6
  },
  fpsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  fpsActivePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1
  },
  fpsActivePillText: {
    fontSize: 9.5,
    fontWeight: '800'
  },
  fpsSubText: {
    fontSize: 10,
    lineHeight: 14,
    marginTop: 2
  },
  fpsPillsRow: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 4
  },
  fpsPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  },
  fpsPillText: {
    fontSize: 12,
    fontWeight: '800'
  },
  fpsPillUnit: {
    fontSize: 7.5,
    fontWeight: '800',
    marginTop: 1
  },

  // Sleep Timer Card
  sleepTimerCard: {
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    gap: 8
  },
  sleepTimerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sleepActivePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  sleepActivePillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800'
  },
  sleepPillsRow: {
    flexDirection: 'row',
    gap: 6
  },
  sleepPill: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1
  },
  sleepPillText: {
    fontSize: 11,
    fontWeight: '700'
  },

  // Footer
  footerWrap: {
    alignItems: 'center',
    marginTop: 12,
    gap: 2
  },
  footerText: {
    fontSize: 10,
    fontWeight: '700'
  },
  footerSub: {
    fontSize: 9
  }
});