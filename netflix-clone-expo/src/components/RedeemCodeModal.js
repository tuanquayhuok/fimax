import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/colors';

const VALID_CODES = {
  'FIMAXVIP': { plan: 'VIP 1 Năm (Ultimate)', days: 365 },
  'VIP4K': { plan: 'VIP 6 Tháng (4K Ultra HD)', days: 180 },
  'CINEMA2026': { plan: 'VIP 1 Tháng (Full HD)', days: 30 }
};

export const RedeemCodeModal = ({ visible, onClose }) => {
  const { setUser } = useContext(AppContext);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRedeem = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      Alert.alert('Thông báo', 'Vui lòng nhập mã kích hoạt hoặc mã quà tặng.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const match = VALID_CODES[trimmed] || { plan: `VIP Kích Hoạt (${trimmed})`, days: 90 };

      setUser(prev => ({
        ...prev,
        plan: match.plan,
        isVip: true
      }));

      Alert.alert(
        '🎉 Kích hoạt thành công!',
        `Chúc mừng bạn đã kích hoạt ${match.plan} (+${match.days} ngày sử dụng).`,
        [{ text: 'Bắt đầu xem', onPress: () => { setCode(''); onClose(); } }]
      );
    }, 1000);
  };

  const handleQuickCode = (sample) => {
    setCode(sample);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="gift-outline" size={24} color="#D4AF37" />
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Đổi Mã Kích Hoạt VIP</Text>
          <Text style={styles.subtitle}>Nhập mã thẻ quà tặng hoặc mã ưu đãi từ đối tác của bạn để mở khóa đặc quyền FIMAX VIP.</Text>

          {/* Quick Demo Codes */}
          <View style={styles.demoWrap}>
            <Text style={styles.demoLabel}>Mã quà tặng mẫu:</Text>
            <View style={styles.demoChips}>
              {['FIMAXVIP', 'VIP4K', 'CINEMA2026'].map((c) => (
                <TouchableOpacity key={c} style={styles.demoChip} onPress={() => handleQuickCode(c)}>
                  <Text style={styles.demoChipText}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Code Input */}
          <TextInput
            style={styles.input}
            placeholder="NHẬP MÃ TẠI ĐÂY (VD: VIP4K)"
            placeholderTextColor="#636366"
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitBtn}
            activeOpacity={0.85}
            onPress={handleRedeem}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>XÁC NHẬN KÍCH HOẠT</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#18181A',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeBtn: {
    padding: 4
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16
  },
  demoWrap: {
    marginBottom: 14
  },
  demoLabel: {
    color: '#636366',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase'
  },
  demoChips: {
    flexDirection: 'row',
    gap: 8
  },
  demoChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6
  },
  demoChipText: {
    color: '#D4AF37',
    fontSize: 11,
    fontWeight: '700'
  },
  input: {
    backgroundColor: '#101012',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 2
  },
  submitBtn: {
    backgroundColor: '#E50914',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5
  }
});