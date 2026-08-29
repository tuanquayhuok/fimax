import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

export const SocialAuthModal = ({ visible, provider, onClose, onSuccess }) => {
  const isGoogle = provider === 'Google';
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('choose'); // 'choose' or 'custom'

  const handleSelectAccount = (selectedEmail, selectedName) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess({
        id: (isGoogle ? 'gg_' : 'apple_') + Date.now(),
        name: selectedName,
        email: selectedEmail,
        avatar: isGoogle
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        plan: 'Thành viên Tiêu chuẩn',
        isVip: false,
        authProvider: provider
      });
      onClose();
    }, 800);
  };

  const handleCustomSubmit = () => {
    if (!emailInput.trim()) {
      Alert.alert('Thông báo', `Vui lòng nhập địa chỉ ${isGoogle ? 'Gmail' : 'Apple ID / iCloud'} của bạn.`);
      return;
    }
    const displayName = nameInput.trim() || emailInput.split('@')[0] || (isGoogle ? 'Google User' : 'Apple User');
    handleSelectAccount(emailInput.trim(), displayName);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.providerRow}>
              <Ionicons
                name={isGoogle ? 'logo-google' : 'logo-apple'}
                size={22}
                color={isGoogle ? '#EA4335' : '#FFFFFF'}
              />
              <Text style={styles.headerTitle}>
                {isGoogle ? 'Đăng nhập với Google' : 'Sign in with Apple ID'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            {isGoogle
              ? 'Chọn hoặc nhập tài khoản Google (Gmail) của bạn để ủy quyền đăng nhập vào FIMAX:'
              : 'Xác thực tài khoản Apple ID / iCloud của bạn để tiếp tục:'}
          </Text>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={isGoogle ? '#EA4335' : '#E50914'} />
              <Text style={styles.loadingText}>Đang xác thực và đồng bộ tài khoản...</Text>
            </View>
          ) : step === 'choose' ? (
            <View style={styles.accountList}>
              {/* Option 1: Quick input / custom account */}
              <TouchableOpacity
                style={styles.accountItem}
                activeOpacity={0.8}
                onPress={() => setStep('custom')}
              >
                <View style={[styles.avatarCircle, { backgroundColor: isGoogle ? 'rgba(234, 67, 53, 0.15)' : 'rgba(255, 255, 255, 0.15)' }]}>
                  <Ionicons name="add" size={20} color={isGoogle ? '#EA4335' : '#FFFFFF'} />
                </View>
                <View style={styles.accountInfo}>
                  <Text style={styles.accountName}>Sử dụng tài khoản khác</Text>
                  <Text style={styles.accountEmail}>Nhập Email {isGoogle ? 'Gmail' : 'Apple ID'} của bạn</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#636366" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.customForm}>
              <Text style={styles.inputLabel}>HỌ VÀ TÊN HIỂN THỊ</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: Nguyễn Văn A"
                placeholderTextColor="#636366"
                value={nameInput}
                onChangeText={setNameInput}
              />

              <Text style={styles.inputLabel}>{isGoogle ? 'ĐỊA CHỈ GMAIL' : 'APPLE ID / ICLOUD EMAIL'}</Text>
              <TextInput
                style={styles.input}
                placeholder={isGoogle ? "tencuaban@gmail.com" : "tencuaban@icloud.com"}
                placeholderTextColor="#636366"
                keyboardType="email-address"
                autoCapitalize="none"
                value={emailInput}
                onChangeText={setEmailInput}
              />

              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: isGoogle ? '#EA4335' : '#FFFFFF' }]}
                activeOpacity={0.85}
                onPress={handleCustomSubmit}
              >
                <Text style={[styles.submitBtnText, { color: isGoogle ? '#FFFFFF' : '#000000' }]}>
                  XÁC NHẬN ĐĂNG NHẬP
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.backBtn} onPress={() => setStep('choose')}>
                <Text style={styles.backBtnText}>Quay lại</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.privacyNote}>
            <Ionicons name="shield-checkmark-outline" size={14} color="#8E8E93" />
            <Text style={styles.privacyText}>
              Bảo mật 100% qua tiêu chuẩn OAuth 2.0 của {isGoogle ? 'Google' : 'Apple'}.
            </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#18181A',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700'
  },
  closeBtn: {
    padding: 4
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 18
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12
  },
  loadingText: {
    color: '#8E8E93',
    fontSize: 13
  },
  accountList: {
    gap: 10,
    marginBottom: 16
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#101012',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 12
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center'
  },
  accountInfo: {
    flex: 1
  },
  accountName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  accountEmail: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 2
  },
  customForm: {
    gap: 12,
    marginBottom: 16
  },
  inputLabel: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  input: {
    backgroundColor: '#101012',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  submitBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  backBtn: {
    alignItems: 'center',
    paddingVertical: 6
  },
  backBtnText: {
    color: '#8E8E93',
    fontSize: 13
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 14
  },
  privacyText: {
    color: '#636366',
    fontSize: 11
  }
});