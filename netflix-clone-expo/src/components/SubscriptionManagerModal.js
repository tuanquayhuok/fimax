import React, { useState, useContext } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/colors';

export const SubscriptionManagerModal = ({ visible, onClose, onOpenUpgradeModal }) => {
  const { user, setUser } = useContext(AppContext);
  const [autoRenew, setAutoRenew] = useState(true);

  const isVip = user?.isVip || (user?.plan && user.plan.includes('VIP'));
  const planName = user?.plan || 'Thành viên Tiêu chuẩn';

  const handleToggleAutoRenew = (value) => {
    setAutoRenew(value);
    if (!value) {
      Alert.alert(
        'Đã tắt tự động gia hạn',
        'Gói của bạn sẽ không tự động trừ tiền ở kỳ tới nhưng bạn vẫn được dùng dịch vụ đầy đủ đến hết ngày 28/02/2027.'
      );
    } else {
      Alert.alert('Đã bật tự động gia hạn', 'Gói cước sẽ tự động gia hạn khi đến hạn tiếp theo.');
    }
  };

  const handleCancelPlan = () => {
    Alert.alert(
      'Xác nhận hủy gói VIP',
      'Bạn có chắc chắn muốn hủy gói cước hiện tại? Sau khi hủy, tài khoản sẽ chuyển về gói Tiêu chuẩn.',
      [
        { text: 'Giữ lại gói', style: 'cancel' },
        {
          text: 'Xác nhận hủy',
          style: 'destructive',
          onPress: () => {
            setUser(prev => ({
              ...prev,
              plan: 'Thành viên Tiêu chuẩn',
              isVip: false
            }));
            Alert.alert('Đã hủy gói', 'Tài khoản của bạn đã chuyển về gói Tiêu chuẩn.');
            onClose();
          }
        }
      ]
    );
  };

  const handlePausePlan = () => {
    Alert.alert('Tạm dừng gói', 'Gói cước của bạn đã được tạm dừng bảo lưu ngày xem trong 30 ngày tới.');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Quản Lý Gói Đang Dùng</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Active Plan Card with Responsive No-Overflow Layout */}
            <View style={styles.planCard}>
              <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                  <Text style={styles.planTitle} numberOfLines={2}>
                    {planName}
                  </Text>
                  {isVip && (
                    <View style={styles.daysBadge}>
                      <Text style={styles.daysBadgeText}>Còn 182 ngày</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.planStatus}>
                  {isVip ? '🟢 Đang hoạt động • Hết hạn 28/02/2027' : '⚪ Gói Miễn Phí'}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Chu kỳ thanh toán:</Text>
                <Text style={styles.detailVal}>{isVip ? '249.000đ / 6 Tháng' : '0đ (Miễn phí)'}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Phương thức:</Text>
                <Text style={styles.detailVal}>{isVip ? 'Apple Pay (•••• 8821)' : 'Chưa liên kết'}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Ngày kích hoạt:</Text>
                <Text style={styles.detailVal}>29/08/2026</Text>
              </View>
            </View>

            {/* Active Benefits Checklist */}
            <Text style={styles.sectionHeading}>ĐẶC QUYỀN ĐANG ĐƯỢC HƯỞNG</Text>
            <View style={styles.benefitGroup}>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={18} color="#E50914" />
                <Text style={styles.benefitText}>Chất lượng: {isVip ? '4K Ultra HD & HDR10' : 'HD 720p'}</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={18} color="#E50914" />
                <Text style={styles.benefitText}>Âm thanh: {isVip ? 'Dolby Atmos 5.1 Surround' : 'Stereo 2.0'}</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={18} color="#E50914" />
                <Text style={styles.benefitText}>Quảng cáo: {isVip ? '100% Không có quảng cáo' : 'Có quảng cáo'}</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={18} color="#E50914" />
                <Text style={styles.benefitText}>Thiết bị: {isVip ? '2 Thiết bị cùng lúc (Đang dùng 1/2)' : '1 Thiết bị'}</Text>
              </View>
            </View>

            {/* Auto-renew Switch */}
            {isVip && (
              <View style={styles.switchGroup}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={styles.switchTitle}>Tự động gia hạn</Text>
                  <Text style={styles.switchSub}>Tự động trừ tiền và gia hạn khi hết chu kỳ</Text>
                </View>
                <Switch
                  value={autoRenew}
                  onValueChange={handleToggleAutoRenew}
                  trackColor={{ false: '#2C2C2E', true: '#E50914' }}
                />
              </View>
            )}

            {/* Management Actions */}
            <Text style={styles.sectionHeading}>TÙY CHỌN GÓI CƯỚC</Text>
            <View style={styles.actionGroup}>
              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => {
                  onClose();
                  onOpenUpgradeModal();
                }}
              >
                <Ionicons name="arrow-up-circle-outline" size={20} color="#FFFFFF" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.actionTitle}>Nâng cấp lên gói 1 Năm (Ultimate)</Text>
                  <Text style={styles.actionSub}>Tiết kiệm 50% & mở khóa 4 thiết bị</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#636366" />
              </TouchableOpacity>

              {isVip && (
                <TouchableOpacity style={styles.actionRow} onPress={handlePausePlan}>
                  <Ionicons name="pause-circle-outline" size={20} color="#FFFFFF" />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.actionTitle}>Tạm dừng gói (Bảo lưu ngày xem)</Text>
                    <Text style={styles.actionSub}>Tạm dừng tối đa 30 ngày</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#636366" />
                </TouchableOpacity>
              )}

              {isVip && (
                <TouchableOpacity style={styles.actionRow} onPress={handleCancelPlan}>
                  <Ionicons name="close-circle-outline" size={20} color="#E50914" />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.actionTitle, { color: '#E50914' }]}>Hủy gói VIP hiện tại</Text>
                    <Text style={styles.actionSub}>Chuyển về gói thành viên miễn phí</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#636366" />
                </TouchableOpacity>
              )}
            </View>

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
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end'
  },
  sheet: {
    backgroundColor: '#121214',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)'
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700'
  },
  closeBtn: {
    padding: 4
  },
  body: {
    padding: 20
  },
  planCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20
  },
  cardHeader: {
    width: '100%'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4
  },
  planTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1,
    maxWidth: '70%'
  },
  planStatus: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 2
  },
  daysBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  daysBadgeText: {
    color: '#D4AF37',
    fontSize: 11,
    fontWeight: '700'
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 12
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  detailKey: {
    color: '#8E8E93',
    fontSize: 13
  },
  detailVal: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600'
  },
  sectionHeading: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4
  },
  benefitGroup: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  benefitText: {
    color: '#FFFFFF',
    fontSize: 13
  },
  switchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  switchTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  switchSub: {
    color: '#8E8E93',
    fontSize: 11,
    marginTop: 2
  },
  actionGroup: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)'
  },
  actionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500'
  },
  actionSub: {
    color: '#8E8E93',
    fontSize: 11,
    marginTop: 2
  }
});