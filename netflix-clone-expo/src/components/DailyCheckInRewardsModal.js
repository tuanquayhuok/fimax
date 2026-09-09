import React, { useContext } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';

const CHECKIN_DAYS = [
  { day: 1, points: 50, label: 'Ngày 1' },
  { day: 2, points: 100, label: 'Ngày 2' },
  { day: 3, points: 150, label: 'Ngày 3' },
  { day: 4, points: 200, label: 'Ngày 4' },
  { day: 5, points: 250, label: 'Ngày 5' },
  { day: 6, points: 300, label: 'Ngày 6' },
  { day: 7, points: 500, label: 'Ngày 7', isBigReward: true, bonus: '+1 Ngày VIP' }
];

const REWARD_STORE_ITEMS = [
  {
    id: 'r_vip_3d',
    title: '3 Ngày VIP Cinema 4K',
    sub: 'Xem phim 4K HDR & âm thanh Dolby không giới hạn',
    cost: 500,
    icon: 'diamond-outline',
    badge: 'HOT',
    isVip: true
  },
  {
    id: 'r_vip_1m',
    title: '1 Tháng VIP Trọn Gói',
    sub: 'Đặc quyền rạp phim cao cấp 30 ngày',
    cost: 2500,
    icon: 'sparkles-outline',
    badge: 'BEST DEAL',
    isVip: true
  },
  {
    id: 'r_popcorn',
    title: 'Voucher Combo Bắp Nước CGV/Lotte',
    sub: 'Đổi 1 bắp rang bơ + 1 nước ngọt tại các cụm rạp',
    cost: 1200,
    icon: 'fast-food-outline',
    badge: 'VOUCHER'
  },
  {
    id: 'r_icon_dragon',
    title: 'App Icon Độc Quyền "Golden Dragon"',
    sub: 'Mở khóa biểu tượng rồng vàng hoàng gia trong Studio',
    cost: 800,
    icon: 'color-palette-outline',
    badge: 'EXCLUSIVE'
  },
  {
    id: 'r_badge_cinephile',
    title: 'Huy Hiệu Hồ Sơ "Top 1 Cinephile"',
    sub: 'Hiển thị huy hiệu vinh danh độc quyền bên cạnh tên',
    cost: 350,
    icon: 'trophy-outline',
    badge: 'BADGE'
  }
];

export const DailyCheckInRewardsModal = ({ visible, onClose }) => {
  const {
    themeMode,
    accentColor,
    fimaxPoints,
    checkInStreak,
    lastCheckInDate,
    checkInToday,
    redeemReward,
    redeemedRewards
  } = useContext(AppContext);

  const theme = getThemeColors(themeMode);

  if (!visible) return null;

  const todayStr = new Date().toDateString();
  const isCheckedInToday = lastCheckInDate === todayStr;

  const handleCheckIn = () => {
    const res = checkInToday();
    if (res.success) {
      Alert.alert('🎉 Điểm Danh Thành Công!', res.message);
    } else {
      Alert.alert('Thông Báo', res.message);
    }
  };

  const handleRedeem = (item) => {
    Alert.alert(
      'Đổi Quà Thưởng',
      `Bạn có chắc chắn muốn dùng ${item.cost} F-Points để đổi "${item.title}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đổi Ngay',
          onPress: () => {
            const res = redeemReward(item);
            if (res.success) {
              Alert.alert(
                '🎉 Đổi Quà Thành Công!',
                `${res.message}\nMã ưu đãi của bạn: ${res.code}\n(Đã tự động kích hoạt vào tài khoản của bạn)`
              );
            } else {
              Alert.alert('Không đủ điểm', res.message);
            }
          }
        }
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.isLight ? '#FFFFFF' : '#101014', borderColor: theme.border }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBoxMini, { backgroundColor: theme.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.07)', borderColor: theme.borderLight }]}>
                <Ionicons name="gift-outline" size={20} color={theme.textPrimary} />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
                  Điểm Danh & Đổi Quà F-Points
                </Text>
                <Text style={[styles.headerSub, { color: theme.textMuted }]}>
                  Tích lũy điểm danh 7 ngày & đổi quà rạp phim VIP
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Wallet Points Balance Card */}
            <View style={[styles.walletCard, { backgroundColor: theme.surface, borderColor: '#D4AF37' }]}>
              <View style={styles.walletLeft}>
                <Text style={[styles.walletLabel, { color: theme.textMuted }]}>VÍ ĐIỂM TÍCH LŨY CỦA BẠN</Text>
                <View style={styles.pointsNumRow}>
                  <Text style={[styles.pointsNumber, { color: '#D4AF37' }]}>
                    {fimaxPoints ? fimaxPoints.toLocaleString('vi-VN') : '0'}
                  </Text>
                  <Text style={styles.pointsUnit}>F-POINTS</Text>
                </View>
                <Text style={[styles.streakStatusText, { color: theme.textSecondary }]}>
                  🔥 Chuỗi điểm danh hiện tại: <Text style={{ color: accentColor, fontWeight: '800' }}>{checkInStreak || 0} Ngày Liên Tục</Text>
                </Text>
              </View>

              <View style={[styles.coinIconCircle, { backgroundColor: 'rgba(212, 175, 55, 0.15)', borderColor: 'rgba(212, 175, 55, 0.3)', borderWidth: 1 }]}>
                <Ionicons name="ribbon-outline" size={30} color="#D4AF37" />
              </View>
            </View>

            {/* 7-Day Streak Grid */}
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>LỊCH ĐIỂM DANH 7 NGÀY</Text>
            <View style={[styles.streakCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.daysRow}>
                {CHECKIN_DAYS.map((d) => {
                  const isPassed = (checkInStreak || 0) >= d.day;
                  const isCurrent = (checkInStreak || 0) === d.day;
                  return (
                    <View
                      key={d.day}
                      style={[
                        styles.dayItem,
                        {
                          backgroundColor: isPassed ? `${accentColor}25` : (theme.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)'),
                          borderColor: isPassed ? accentColor : (d.isBigReward ? '#D4AF37' : theme.borderLight)
                        }
                      ]}
                    >
                      <Text style={[styles.dayLabel, { color: isPassed ? accentColor : theme.textMuted }]}>
                        {d.label}
                      </Text>
                      <Ionicons
                        name={isPassed ? "checkmark-circle" : (d.isBigReward ? "gift-outline" : "star-outline")}
                        size={16}
                        color={isPassed ? accentColor : (d.isBigReward ? "#D4AF37" : theme.textMuted)}
                      />
                      <Text style={[styles.dayPoints, { color: isPassed ? accentColor : (d.isBigReward ? "#D4AF37" : theme.textPrimary) }]}>
                        +{d.points}
                      </Text>
                      {d.bonus && (
                        <View style={styles.bonusTag}>
                          <Text style={styles.bonusTagText}>VIP</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>

              {/* Check-In CTA Button */}
              <TouchableOpacity
                style={[
                  styles.checkInBtn,
                  { backgroundColor: isCheckedInToday ? '#2C2C2E' : accentColor }
                ]}
                onPress={handleCheckIn}
                disabled={isCheckedInToday}
                activeOpacity={0.85}
              >
                <Ionicons name={isCheckedInToday ? "checkmark-done-circle-outline" : "calendar-outline"} size={18} color="#FFFFFF" />
                <Text style={styles.checkInBtnText}>
                  {isCheckedInToday ? 'ĐÃ ĐIỂM DANH HÔM NAY ✓' : 'ĐIỂM DANH NHẬN ĐIỂM NGAY'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* REWARD EXCHANGE STORE */}
            <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginTop: 14 }]}>
              CỬA HÀNG ĐỔI QUÀ THƯỞNG
            </Text>

            <View style={styles.storeList}>
              {REWARD_STORE_ITEMS.map((item) => {
                const canAfford = fimaxPoints >= item.cost;
                return (
                  <View
                    key={item.id}
                    style={[styles.rewardRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  >
                    <View style={[styles.rewardIconBox, { backgroundColor: theme.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)', borderColor: theme.borderLight }]}>
                      <Ionicons name={item.icon} size={22} color={item.badge === 'HOT' || item.badge === 'BEST DEAL' ? '#D4AF37' : theme.textPrimary} />
                    </View>

                    <View style={styles.rewardContent}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.rewardTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <View style={[styles.itemBadge, { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)', borderWidth: 0.5 }]}>
                          <Text style={[styles.itemBadgeText, { color: theme.textPrimary }]}>{item.badge}</Text>
                        </View>
                      </View>
                      <Text style={[styles.rewardSub, { color: theme.textMuted }]} numberOfLines={2}>
                        {item.sub}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.redeemBtn,
                        { backgroundColor: canAfford ? accentColor : theme.surfaceSecondary }
                      ]}
                      onPress={() => handleRedeem(item)}
                      activeOpacity={0.85}
                    >
                      <Text style={[styles.costText, { color: canAfford ? '#FFFFFF' : theme.textMuted }]}>
                        {item.cost}
                      </Text>
                      <Text style={[styles.costUnit, { color: canAfford ? '#FFFFFF' : theme.textMuted }]}>
                        Điểm
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>

            {/* Redeemed history */}
            {redeemedRewards && redeemedRewards.length > 0 && (
              <View style={[styles.historyBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.historyTitle, { color: theme.textPrimary }]}>Lịch Sử Quà Đã Đổi ({redeemedRewards.length}):</Text>
                {redeemedRewards.map((r, idx) => (
                  <View key={idx} style={styles.historyItem}>
                    <Ionicons name="checkmark-circle" size={14} color="#30D158" />
                    <Text style={[styles.historyItemText, { color: theme.textSecondary }]}>
                      {r.title} - Mã: <Text style={{ color: accentColor, fontWeight: '800' }}>{r.code}</Text>
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
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
  scrollBody: {
    padding: 16,
    gap: 10
  },

  // Wallet Card
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3
  },
  walletLeft: {
    flex: 1
  },
  walletLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  pointsNumRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2
  },
  pointsNumber: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  pointsUnit: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D4AF37'
  },
  streakStatusText: {
    fontSize: 11,
    marginTop: 4
  },
  coinIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center'
  },

  // Streak Grid
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 6,
    marginLeft: 2
  },
  streakCard: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    gap: 12
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4
  },
  dayItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    position: 'relative'
  },
  dayLabel: {
    fontSize: 8.5,
    fontWeight: '700'
  },
  dayPoints: {
    fontSize: 10,
    fontWeight: '800'
  },
  bonusTag: {
    position: 'absolute',
    top: -4,
    right: -2,
    backgroundColor: '#D4AF37',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3
  },
  bonusTagText: {
    color: '#000000',
    fontSize: 6.5,
    fontWeight: '900'
  },
  checkInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6
  },
  checkInBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5
  },

  // Reward Store
  storeList: {
    gap: 8
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10
  },
  rewardIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rewardContent: {
    flex: 1
  },
  rewardTitle: {
    fontSize: 12.5,
    fontWeight: '700'
  },
  itemBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4
  },
  itemBadgeText: {
    fontSize: 7.5,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  rewardSub: {
    fontSize: 10.5,
    marginTop: 2,
    lineHeight: 14
  },
  redeemBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 64
  },
  costText: {
    fontSize: 12.5,
    fontWeight: '900'
  },
  costUnit: {
    fontSize: 8.5,
    fontWeight: '700'
  },

  // History
  historyBox: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    marginTop: 8,
    gap: 6
  },
  historyTitle: {
    fontSize: 11.5,
    fontWeight: '700'
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  historyItemText: {
    fontSize: 11
  }
});