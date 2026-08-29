import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

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
  };

  const handleConfirm = () => {
    const enteredCode = otp.join('');
    if (enteredCode.length < 6) {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ 6 chữ số mã xác minh.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      Alert.alert('Thành công', 'Xác thực tài khoản thành công!');
      onVerifySuccess();
    }, 1000);
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(60);
    Alert.alert('Thông báo', `Mã xác minh mới đã được gửi lại đến: ${destination}`);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark" size={28} color="#E50914" />
            </View>
            <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Xác Minh Tài Khoản</Text>
          <Text style={styles.subtitle}>
            Chúng tôi đã gửi mã xác nhận 6 số đến:{'\n'}
            <Text style={styles.destinationText}>{destination || 'email của bạn'}</Text>
          </Text>

          {/* Demo helper banner */}
          <TouchableOpacity style={styles.demoBanner} activeOpacity={0.8} onPress={handleFillDemoCode}>
            <Ionicons name="key-outline" size={16} color="#D4AF37" />
            <Text style={styles.demoBannerText}>Mã thử nghiệm nhanh: <Text style={{ fontWeight: 'bold' }}>888888</Text> (Nhấn để tự điền)</Text>
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
              />
            ))}
          </View>

          {/* Resend code */}
          <View style={styles.resendRow}>
            {timer > 0 ? (
              <Text style={styles.timerText}>Gửi lại mã sau <Text style={{ color: '#E50914', fontWeight: 'bold' }}>{timer}s</Text></Text>
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
  sheet: {
    backgroundColor: '#121214',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(229, 9, 20, 0.12)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeBtn: {
    padding: 6
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.3
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16
  },
  destinationText: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)'
  },
  demoBannerText: {
    color: '#D4AF37',
    fontSize: 12
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  otpBox: {
    width: 46,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#1C1C1E',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center'
  },
  otpBoxFilled: {
    borderColor: '#E50914',
    backgroundColor: 'rgba(229, 9, 20, 0.06)'
  },
  resendRow: {
    alignItems: 'center',
    marginBottom: 20
  },
  timerText: {
    color: '#8E8E93',
    fontSize: 13
  },
  resendBtnText: {
    color: '#E50914',
    fontSize: 13,
    fontWeight: '700'
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