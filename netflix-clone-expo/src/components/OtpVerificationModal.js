import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const OtpVerificationModal = ({ visible, destination, onVerifySuccess, onCancel }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [demoCode, setDemoCode] = useState('888888');
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!visible) {
      setOtp(['', '', '', '', '', '']);
      setTimer(60);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [visible]);

  const handleChangeText = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFillDemoCode = () => {
    const digits = demoCode.split('');
    setOtp(digits);
    Keyboard.dismiss();
  };

  const handleConfirm = () => {
    const enteredCode = otp.join('');
    if (enteredCode.length < 6) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ 6 chữ số mã xác minh.');
      return;
    }

    Keyboard.dismiss();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      Alert.alert('Thành công', 'Xác thực tài khoản thành công!');
      onVerifySuccess();
    }, 800);
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(60);
    Alert.alert('Thông báo', `Mã xác minh mới đã được gửi lại đến: ${destination}`);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} statusBarTranslucent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            style={styles.keyboardAvoidWrap}
          >
            <View style={styles.card}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconCircle}>
                  <Ionicons name="shield-checkmark" size={26} color="#E50914" />
                </View>
                <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
                  <Ionicons name="close" size={22} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              <Text style={styles.title}>Xác Minh Tài Khoản</Text>
              <Text style={styles.subtitle}>
                Mã xác nhận 6 số đã được gửi đến:{'\n'}
                <Text style={styles.destinationText}>{destination || 'email/SĐT của bạn'}</Text>
              </Text>

              {/* Demo Helper Pill */}
              <TouchableOpacity
                style={styles.demoBanner}
                activeOpacity={0.8}
                onPress={handleFillDemoCode}
              >
                <Ionicons name="flash" size={14} color="#D4AF37" />
                <Text style={styles.demoBannerText}>
                  Mã nhanh: <Text style={{ fontWeight: '900', letterSpacing: 1 }}>888888</Text> (Nhấn để điền ngay)
                </Text>
              </TouchableOpacity>

              {/* 6 OTP Input Boxes */}
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[styles.otpBox, digit !== '' && styles.otpBoxFilled]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(t) => handleChangeText(t, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    autoFocus={index === 0}
                    selectTextOnFocus
                  />
                ))}
              </View>

              {/* Resend Code Countdown */}
              <View style={styles.resendRow}>
                {timer > 0 ? (
                  <Text style={styles.timerText}>
                    Gửi lại mã sau <Text style={{ color: '#E50914', fontWeight: 'bold' }}>{timer}s</Text>
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleResend}>
                    <Text style={styles.resendBtnText}>Gửi lại mã xác nhận</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitBtn}
                activeOpacity={0.85}
                onPress={handleConfirm}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitBtnText}>XÁC NHẬN & HOÀN TẤT</Text>
                )}
              </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  keyboardAvoidWrap: {
    width: '100%',
    alignItems: 'center'
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#16161A',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(229, 9, 20, 0.15)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeBtn: {
    padding: 6
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.3
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14
  },
  destinationText: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)'
  },
  demoBannerText: {
    color: '#D4AF37',
    fontSize: 12
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 6
  },
  otpBox: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#202024',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center'
  },
  otpBoxFilled: {
    borderColor: '#E50914',
    backgroundColor: 'rgba(229, 9, 20, 0.1)'
  },
  resendRow: {
    alignItems: 'center',
    marginBottom: 16
  },
  timerText: {
    color: '#8E8E93',
    fontSize: 12
  },
  resendBtnText: {
    color: '#E50914',
    fontSize: 12,
    fontWeight: '700'
  },
  submitBtn: {
    backgroundColor: '#E50914',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center'
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5
  }
});
