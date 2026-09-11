import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';

export const ChangePasswordModal = ({ visible, onClose }) => {
  const { themeMode, accentColor, changePassword, user, t } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleClose = () => {
    handleResetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    if (!currentPassword) {
      setErrorMessage('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp với mật khẩu mới.');
      return;
    }
    if (currentPassword === newPassword) {
      setErrorMessage('Mật khẩu mới phải khác mật khẩu hiện tại.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = changePassword(currentPassword, newPassword);
      setLoading(false);
      if (res.success) {
        Alert.alert(
          'Đổi Mật Khẩu Thành Công 🎉',
          'Mật khẩu của bạn đã được cập nhật an toàn trên hệ thống FIMAX Cinema.',
          [{ text: 'Đồng Ý', onPress: handleClose }]
        );
      } else {
        setErrorMessage(res.error || 'Đổi mật khẩu không thành công.');
      }
    }, 600);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalCardWrapper}>
              <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                {/* Header */}
                <View style={styles.header}>
                  <View style={styles.titleRow}>
                    <View style={[styles.iconCircle, { backgroundColor: `${accentColor}1A` }]}>
                      <Ionicons name="key" size={20} color={accentColor} />
                    </View>
                    <View>
                      <Text style={[styles.title, { color: theme.textPrimary }]}>Đổi Mật Khẩu</Text>
                      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Tài khoản: {user?.email}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                    <Ionicons name="close" size={22} color={theme.textMuted} />
                  </TouchableOpacity>
                </View>

                {/* Error Banner */}
                {errorMessage ? (
                  <View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={16} color="#FF453A" />
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                ) : null}

                {/* Current Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>Mật khẩu hiện tại</Text>
                  <View style={[styles.inputBox, { backgroundColor: theme.inputBg, borderColor: theme.borderLight }]}>
                    <Ionicons name="lock-closed-outline" size={17} color={theme.textMuted} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.textPrimary }]}
                      placeholder="Nhập mật khẩu hiện tại"
                      placeholderTextColor={theme.textMuted}
                      secureTextEntry={!showCurrent}
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                    />
                    <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} style={styles.eyeBtn}>
                      <Ionicons name={showCurrent ? "eye-off-outline" : "eye-outline"} size={18} color={theme.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* New Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>Mật khẩu mới (tối thiểu 6 ký tự)</Text>
                  <View style={[styles.inputBox, { backgroundColor: theme.inputBg, borderColor: theme.borderLight }]}>
                    <Ionicons name="shield-checkmark-outline" size={17} color={theme.textMuted} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.textPrimary }]}
                      placeholder="Nhập mật khẩu mới"
                      placeholderTextColor={theme.textMuted}
                      secureTextEntry={!showNew}
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />
                    <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeBtn}>
                      <Ionicons name={showNew ? "eye-off-outline" : "eye-outline"} size={18} color={theme.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm New Password Field */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>Xác nhận mật khẩu mới</Text>
                  <View style={[styles.inputBox, { backgroundColor: theme.inputBg, borderColor: theme.borderLight }]}>
                    <Ionicons name="checkmark-done-outline" size={17} color={theme.textMuted} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.textPrimary }]}
                      placeholder="Nhập lại mật khẩu mới"
                      placeholderTextColor={theme.textMuted}
                      secureTextEntry={!showConfirm}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                      <Ionicons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={18} color={theme.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.btnRow}>
                  <TouchableOpacity style={[styles.cancelBtn, { borderColor: theme.borderLight }]} onPress={handleClose}>
                    <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.submitBtn, { backgroundColor: accentColor }]}
                    onPress={handleSubmit}
                    disabled={loading}
                    activeOpacity={0.85}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.submitBtnText}>Cập Nhật Mật Khẩu</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
  modalCardWrapper: {
    width: '100%',
    maxWidth: 420
  },
  modalCard: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 17,
    fontWeight: '800'
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2
  },
  closeBtn: {
    padding: 6
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 69, 58, 0.12)',
    borderColor: 'rgba(255, 69, 58, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    marginBottom: 14
  },
  errorText: {
    color: '#FF453A',
    fontSize: 12,
    fontWeight: '600',
    flex: 1
  },
  inputGroup: {
    marginBottom: 14
  },
  label: {
    fontSize: 11.5,
    fontWeight: '600',
    marginBottom: 6
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 11,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 46
  },
  inputIcon: {
    marginRight: 8
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500'
  },
  eyeBtn: {
    padding: 6
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700'
  },
  submitBtn: {
    flex: 1.8,
    paddingVertical: 12,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  }
});
