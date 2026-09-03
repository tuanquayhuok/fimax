import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors } from '../theme/colors';

const { width } = Dimensions.get('window');

export const ForgotPasswordModal = ({ visible, onClose, onSubmitReset, themeMode = 'dark', accentColor = '#E50914' }) => {
  const theme = getThemeColors(themeMode);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      Alert.alert('Thông báo', 'Vui lòng nhập địa chỉ email của bạn.');
      return;
    }

    if (!cleanEmail.endsWith('@gmail.com')) {
      Alert.alert('Email không hợp lệ', 'Hệ thống chỉ hỗ trợ tài khoản @gmail.com.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Thông báo', 'Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Thông báo', 'Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.');
      return;
    }

    onSubmitReset({
      email: cleanEmail,
      newPassword
    });
  };

  const handleClose = () => {
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardWrap}
          >
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.isLight ? '#FFFFFF' : '#18181C',
                  borderColor: theme.isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)'
                }
              ]}
            >
              {/* Header */}
              <View style={styles.headerRow}>
                <View style={styles.titleWrap}>
                  <Text style={[styles.title, { color: theme.textPrimary }]}>Quên Mật Khẩu</Text>
                  <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Nhập Gmail để nhận mã OTP và đặt mật khẩu mới
                  </Text>
                </View>
                <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={22} color={theme.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Inputs */}
              <View style={styles.body}>
                {/* Email Input */}
                <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                  <Ionicons name="mail-outline" size={18} color={theme.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: theme.textPrimary }]}
                    placeholder="Email @gmail.com"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                {/* New Password Input */}
                <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                  <Ionicons name="lock-closed-outline" size={18} color={theme.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: theme.textPrimary }]}
                    placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                    placeholderTextColor={theme.textMuted}
                    secureTextEntry={!showPassword}
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={18}
                      color={theme.textMuted}
                    />
                  </TouchableOpacity>
                </View>

                {/* Confirm Password Input */}
                <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                  <Ionicons name="shield-checkmark-outline" size={18} color={theme.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: theme.textPrimary }]}
                    placeholder="Xác nhận mật khẩu mới"
                    placeholderTextColor={theme.textMuted}
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={18}
                      color={theme.textMuted}
                    />
                  </TouchableOpacity>
                </View>

                {/* Action Buttons */}
                <TouchableOpacity
                  style={[styles.submitBtn, { backgroundColor: accentColor }]}
                  activeOpacity={0.85}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitBtnText}>GỬI MÃ OTP & ĐẶT LẠI</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
                  <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>Quay lại Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  keyboardWrap: {
    width: '100%',
    alignItems: 'center'
  },
  card: {
    width: Math.min(width - 32, 380),
    borderRadius: 20,
    borderWidth: 1.2,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 16
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18
  },
  titleWrap: {
    flex: 1,
    paddingRight: 12
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16
  },
  closeBtn: {
    padding: 2
  },
  body: {
    gap: 12
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48
  },
  inputIcon: {
    marginRight: 8
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: '100%'
  },
  eyeBtn: {
    padding: 4
  },
  submitBtn: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 8
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600'
  }
});
