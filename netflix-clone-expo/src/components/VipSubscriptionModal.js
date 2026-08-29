import React, { useState, useContext } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { AppContext } from '../context/AppContext';

const PLANS = [
  {
    id: 'm1',
    name: 'Gói 1 Tháng',
    price: '49.000đ',
    period: '/ tháng',
    features: ['Chất lượng Full HD 1080p', 'Không quảng cáo', '1 thiết bị xem đồng thời']
  },
  {
    id: 'm6',
    name: 'Gói 6 Tháng',
    price: '249.000đ',
    period: '/ 6 tháng',
    badge: 'Phổ biến nhất',
    features: ['Chất lượng 4K Ultra HD & HDR', 'Âm thanh Dolby Atmos', '2 thiết bị xem đồng thời', 'Tải phim xem ngoại tuyến']
  },
  {
    id: 'm12',
    name: 'Gói 12 Tháng',
    price: '449.000đ',
    period: '/ năm',
    features: ['Toàn bộ đặc quyền cao cấp 4K', 'Xem sớm phim rạp mới', 'Không giới hạn thiết bị', 'Hỗ trợ ưu tiên 24/7']
  }
];

export const VipSubscriptionModal = ({ visible, onClose }) => {
  const { user, setUser } = useContext(AppContext);
  const [selectedPlan, setSelectedPlan] = useState('m6');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = () => {
    const plan = PLANS.find(p => p.id === selectedPlan);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setUser(prev => ({
        ...prev,
        plan: `Gói Thành Viên VIP (${plan.name})`,
        isVip: true
      }));

      Alert.alert(
        'Thành công',
        `Bạn đã kích hoạt thành công ${plan.name}.`,
        [{ text: 'Bắt đầu', onPress: onClose }]
      );
    }, 1000);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Gói Hội Viên FIMAX</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.subHeading}>Chọn gói đăng ký phù hợp với bạn</Text>

            {PLANS.map((plan) => {
              const active = selectedPlan === plan.id;
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[styles.card, active && styles.cardActive]}
                  activeOpacity={0.85}
                  onPress={() => setSelectedPlan(plan.id)}
                >
                  {plan.badge && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>{plan.badge}</Text>
                    </View>
                  )}

                  <View style={styles.cardTop}>
                    <View>
                      <Text style={styles.planName}>{plan.name}</Text>
                      <View style={styles.priceRow}>
                        <Text style={styles.price}>{plan.price}</Text>
                        <Text style={styles.period}>{plan.period}</Text>
                      </View>
                    </View>
                    <Ionicons
                      name={active ? "checkmark-circle" : "ellipse-outline"}
                      size={24}
                      color={active ? "#E50914" : "#636366"}
                    />
                  </View>

                  <View style={styles.featureList}>
                    {plan.features.map((feat, idx) => (
                      <View key={idx} style={styles.featureRow}>
                        <Ionicons name="checkmark" size={14} color="#8E8E93" />
                        <Text style={styles.featureText}>{feat}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.payBtn}
              activeOpacity={0.85}
              onPress={handleSubscribe}
              disabled={isProcessing}
            >
              <Text style={styles.payBtnText}>
                {isProcessing ? 'Đang xử lý...' : 'Kích Hoạt Gói'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.disclaimer}>Gia hạn tự động. Có thể hủy bất kỳ lúc nào.</Text>
          </View>
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
    maxHeight: '88%',
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
  subHeading: {
    color: '#8E8E93',
    fontSize: 13,
    marginBottom: 16
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative'
  },
  cardActive: {
    borderColor: '#E50914',
    backgroundColor: 'rgba(229, 9, 20, 0.04)'
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 14,
    backgroundColor: '#E50914',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  planName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4
  },
  price: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800'
  },
  period: {
    color: '#8E8E93',
    fontSize: 12,
    marginLeft: 4
  },
  featureList: {
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 10
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  featureText: {
    color: '#8E8E93',
    fontSize: 12
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8
  },
  payBtn: {
    backgroundColor: '#E50914',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  disclaimer: {
    color: '#636366',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8
  }
});