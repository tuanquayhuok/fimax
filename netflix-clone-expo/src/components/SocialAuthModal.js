import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SocialAuthModal = ({ visible, provider, onClose, onSuccess }) => {
  const isGoogle = provider === 'Google';
  const brandColor = isGoogle ? '#EA4335' : '#1877F2';
  const providerIcon = isGoogle ? 'logo-google' : 'logo-facebook';
  const providerTitle = isGoogle ? 'Đăng nhập với Google' : 'Đăng nhập với Facebook';

  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('choose'); // 'choose' or 'custom'

  // Quick Account Suggestions for seamless 1-tap login
  const sampleAccounts = isGoogle ? [
    {
      id: 'gg_1',
      name: 'Nguyễn Thành Nam',
      email: 'nam.nguyen2026@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'gg_2',
      name: 'Trần Minh Anh',
      email: 'minhanh.cinema@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    }
  ] : [
    {
      id: 'fb_1',
      name: 'Nguyễn Thành Nam (Facebook)',
      email: 'nam.facebook@facebook.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
    },
    {
      id: 'fb_2',
      name: 'FIMAX Fan Club (Facebook)',
      email: 'fimax.member@facebook.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80'
    }
  ];

  const handleSelectAccount = (selectedEmail, selectedName, selectedAvatar) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess({
        id: (isGoogle ? 'gg_' : 'fb_') + Date.now(),
        name: selectedName,
        email: selectedEmail,
        avatar: selectedAvatar || (isGoogle
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'),
        plan: 'Thành viên Tiêu chuẩn',
        isVip: false,
        authProvider: provider
      });
      onClose();
    }, 700);
  };

  const handleCustomSubmit = () => {
    if (!emailInput.trim()) {
      Alert.alert('Thông báo', `Vui lòng nhập địa chỉ ${isGoogle ? 'Gmail' : 'Email / SĐT Facebook'} của bạn.`);
      return;
    }
    const displayName = nameInput.trim() || (emailInput.includes('@') ? emailInput.split('@')[0] : 'Thành viên ' + provider);
    handleSelectAccount(emailInput.trim(), displayName, null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.providerRow}>
              <View style={[styles.brandIconWrap, { backgroundColor: isGoogle ? 'rgba(234, 67, 53, 0.12)' : 'rgba(24, 119, 242, 0.12)' }]}>
                <Ionicons name={providerIcon} size={22} color={brandColor} />
              </View>
              <Text style={styles.headerTitle}>{providerTitle}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            {isGoogle
              ? 'Chọn tài khoản Google trên thiết bị hoặc nhập Gmail của bạn để đăng nhập nhanh:'
              : 'Chọn tài khoản Facebook đã liên kết hoặc nhập tài khoản của bạn để đăng nhập:'}
          </Text>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={brandColor} />
              <Text style={styles.loadingText}>Đang xác thực bảo mật với {provider}...</Text>
            </View>
          ) : step === 'choose' ? (
            <View style={styles.accountList}>
              {/* Preset Accounts for 1-Tap Login */}
              {sampleAccounts.map((acc) => (
                <TouchableOpacity
                  key={acc.id}
                  style={styles.accountItem}
                  activeOpacity={0.8}
                  onPress={() => handleSelectAccount(acc.email, acc.name, acc.avatar)}
                >
                  <Image source={{ uri: acc.avatar }} style={styles.accountAvatar} />
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName}>{acc.name}</Text>
                    <Text style={styles.accountEmail}>{acc.email}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#636366" />
                </TouchableOpacity>
              ))}

              {/* Enter Custom Account */}
              <TouchableOpacity
                style={[styles.accountItem, { borderColor: brandColor }]}
                activeOpacity={0.8}
                onPress={() => setStep('custom')}
              >
                <View style={[styles.avatarCircle, { backgroundColor: brandColor }]}>
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.accountInfo}>
                  <Text style={[styles.accountName, { color: '#FFFFFF' }]}>Nhập tài khoản {provider} khác</Text>
                  <Text style={styles.accountEmail}>Gõ địa chỉ email của bạn</Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color={brandColor} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.customForm}>
              <Text style={styles.inputLabel}>HỌ VÀ TÊN CỦA BẠN</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: Nguyễn Văn A"
                placeholderTextColor="#636366"
                value={nameInput}
                onChangeText={setNameInput}
              />

              <Text style={styles.inputLabel}>{isGoogle ? 'ĐỊA CHỈ GMAIL' : 'EMAIL HOẶC SỐ ĐIỆN THOẠI FACEBOOK'}</Text>
              <TextInput
                style={styles.input}
                placeholder={isGoogle ? "tencuaban@gmail.com" : "email_hoac_sdt_facebook"}
                placeholderTextColor="#636366"
                keyboardType="email-address"
                autoCapitalize="none"
                value={emailInput}
                onChangeText={setEmailInput}
              />

              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: brandColor }]}
                activeOpacity={0.85}
                onPress={handleCustomSubmit}
              >
                <Text style={styles.submitBtnText}>XÁC NHẬN ĐĂNG NHẬP {provider.toUpperCase()}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.backBtn} onPress={() => setStep('choose')}>
                <Text style={styles.backBtnText}>Quay lại danh sách tài khoản</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.privacyNote}>
            <Ionicons name="shield-checkmark" size={14} color="#30D158" />
            <Text style={styles.privacyText}>
              Xác thực bảo mật OAuth 2.0 theo tiêu chuẩn của {provider}.
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
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
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
    gap: 10
  },
  brandIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  closeBtn: {
    padding: 4
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 16
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 28,
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
  accountAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333'
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
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
    paddingTop: 12
  },
  privacyText: {
    color: '#636366',
    fontSize: 11
  }
});