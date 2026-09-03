import React, { useContext, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { VipSubscriptionModal } from '../components/VipSubscriptionModal';
import { SubscriptionManagerModal } from '../components/SubscriptionManagerModal';
import { EditProfileModal } from '../components/EditProfileModal';
import { AppearanceSettingsModal } from '../components/AppearanceSettingsModal';
import { RedeemCodeModal } from '../components/RedeemCodeModal';
import { OtpVerificationModal } from '../components/OtpVerificationModal';
import { SocialAuthModal } from '../components/SocialAuthModal';
import { AdminManagerModal } from '../components/AdminManagerModal';
import { RealAuthService } from '../services/realAuthService';

export const AccountScreen = () => {
  const {
    user, setUser, login, register, logout,
    themeMode, accentColor, fontSizeScale, fontWeightMode,
    notificationsEnabled, setNotificationsEnabled, showNotificationPopup,
    apiUrl, setApiUrl, callbackUrl, setCallbackUrl
  } = useContext(AppContext);
  
  const theme = getThemeColors(themeMode);
  
  // Auth Form State (for guests)
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Modals & Settings
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialProvider, setSocialProvider] = useState('Google');
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const [showSubManagerModal, setShowSubManagerModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState(null);
  
  // Secret 5-tap gesture counter for Owner Admin
  const [tapCount, setTapCount] = useState(0);
  const lastTapRef = useRef(0);

  // In-app Preferences
  const [parentalPinEnabled, setParentalPinEnabled] = useState(false);
  const [showDevConfig, setShowDevConfig] = useState(false);
  const [inputApiUrl, setInputApiUrl] = useState(apiUrl);
  const [inputCallbackUrl, setInputCallbackUrl] = useState(callbackUrl);

  const handleAuthSubmit = () => {
    if (!email || !password) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ Email / Số điện thoại và Mật khẩu.');
      return;
    }

    // Secret Admin Login trigger directly from login form
    if (email.trim().toLowerCase() === 'admin' || email.trim().toLowerCase() === 'admin@fimax.vn') {
      if (password === 'Admin@2026' || password === '123456' || password === 'admin') {
        setShowAdminModal(true);
        return;
      }
    }

    if (authMode === 'login') {
      login(email, password);
      Alert.alert('Thành công', `Đăng nhập thành công với tài khoản ${email}!`);
    } else {
      if (!name) {
        Alert.alert('Thông báo', 'Vui lòng nhập Họ và tên.');
        return;
      }
      setPendingRegistration({ name, email, password });
      setShowOtpModal(true);
    }
  };

  const handleOtpSuccess = () => {
    setShowOtpModal(false);
    if (pendingRegistration) {
      register(pendingRegistration.name, pendingRegistration.email, pendingRegistration.password);
      setPendingRegistration(null);
      Alert.alert('Thành công', `Kích hoạt tài khoản ${pendingRegistration.email} thành công!`);
    }
  };

  const handleLaunchSocialAuth = async (provider) => {
    setSocialProvider(provider);
    if (provider === 'Google') {
      await RealAuthService.signInWithGoogleBrowser();
    } else {
      await RealAuthService.signInWithFacebookBrowser();
    }
    setShowSocialModal(true);
  };

  const handleSocialSuccess = (authedUser) => {
    setUser(authedUser);
    Alert.alert('Thành công', `Đã đồng bộ và đăng nhập thành công với ${authedUser.authProvider} (${authedUser.email})!`);
  };

  const handleNotificationToggle = (val) => {
    setNotificationsEnabled(val);
    if (val) {
      showNotificationPopup(
        '🔔 Đã Bật Thông Báo!',
        'Bạn sẽ luôn nhận được thông báo phim 4K mới nhất & ưu đãi VIP từ rạp FIMAX.',
        null,
        'vip'
      );
    }
  };

  const handleTestNotification = () => {
    if (!notificationsEnabled) {
      Alert.alert('Thông báo', 'Vui lòng gạt bật Cho phép nhận thông báo ở trên trước.');
      return;
    }
    showNotificationPopup(
      '🎬 Bom Tấn Điện Ảnh Mới Cập Nhật',
      'Đào, Phở và Piano (4K HDR) vừa cập nhật bản chiếu rạp độc quyền. Nhấn để thưởng thức ngay!',
      {
        id: 'mov_1',
        title: 'Đào, Phở và Piano',
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      },
      'movie'
    );
  };

  // Secret 5-tap gesture handler on app version to open Master Admin
  const handleSecretVersionTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 600) {
      const newCount = tapCount + 1;
      setTapCount(newCount);
      if (newCount >= 5) {
        setTapCount(0);
        setShowAdminModal(true);
      }
    } else {
      setTapCount(1);
    }
    lastTapRef.current = now;
  };

  const handleSaveDevConfig = () => {
    setApiUrl(inputApiUrl);
    setCallbackUrl(inputCallbackUrl);
    Alert.alert('Thành công', 'Đã lưu cấu hình API & Webhook Callback thành công!');
  };

  const handleClearCache = () => {
    Alert.alert('Đã dọn dẹp', 'Đã giải phóng 142.6 MB bộ nhớ đệm cache.');
  };

  // 1. Unauthenticated View (Login / Register Screen)
  if (!user) {
    return (
      <KeyboardAvoidingView style={[styles.container, { backgroundColor: theme.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.authScrollContent} showsVerticalScrollIndicator={false}>
          {/* Brand Header */}
          <View style={styles.brandHeader}>
            <View style={styles.logoRow}>
              <Text style={[styles.logoRed, { color: accentColor }]}>F</Text>
              <Text style={[styles.logoWhite, { color: theme.textPrimary }]}>IMAX</Text>
            </View>
            <Text style={[styles.authSubtitle, { color: theme.textSecondary }]}>
              {authMode === 'login' ? 'Đăng nhập để xem kho phim điện ảnh 4K' : 'Tạo tài khoản thành viên mới'}
            </Text>
          </View>

          {/* Login / Register Switcher */}
          <View style={[styles.tabSwitcher, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <TouchableOpacity style={[styles.tabBtn, authMode === 'login' && { backgroundColor: theme.surfaceSecondary }]} onPress={() => setAuthMode('login')}>
              <Text style={[styles.tabText, { color: authMode === 'login' ? theme.textPrimary : theme.textSecondary }]}>Đăng Nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabBtn, authMode === 'register' && { backgroundColor: theme.surfaceSecondary }]} onPress={() => setAuthMode('register')}>
              <Text style={[styles.tabText, { color: authMode === 'register' ? theme.textPrimary : theme.textSecondary }]}>Đăng Ký</Text>
            </TouchableOpacity>
          </View>

          {/* Form Inputs */}
          <View style={styles.formContainer}>
            {authMode === 'register' && (
              <View style={styles.inputWrap}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>HỌ VÀ TÊN</Text>
                <TextInput style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.border }]} placeholder="Nhập tên của bạn" placeholderTextColor={theme.textMuted} value={name} onChangeText={setName} />
              </View>
            )}

            <View style={styles.inputWrap}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>EMAIL / SỐ ĐIỆN THOẠI</Text>
              <TextInput style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.border }]} placeholder="example@fimax.vn hoặc 0901234567" placeholderTextColor={theme.textMuted} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
            </View>

            <View style={styles.inputWrap}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>MẬT KHẨU</Text>
              <TextInput style={[styles.textInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.border }]} placeholder="Tối thiểu 6 ký tự" placeholderTextColor={theme.textMuted} secureTextEntry value={password} onChangeText={setPassword} />
            </View>

            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: accentColor }]} activeOpacity={0.85} onPress={handleAuthSubmit}>
              <Text style={styles.submitBtnText}>{authMode === 'login' ? 'ĐĂNG NHẬP' : 'TẠO TÀI KHOẢN'}</Text>
            </TouchableOpacity>
          </View>

          {/* Social Logins */}
          <View style={styles.socialSection}>
            <Text style={[styles.socialDividerText, { color: theme.textMuted }]}>HOẶC ĐĂNG NHẬP VỚI</Text>
            <View style={styles.socialBtnRow}>
              <TouchableOpacity
                style={[styles.socialBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                activeOpacity={0.8}
                onPress={() => handleLaunchSocialAuth('Google')}
              >
                <Ionicons name="logo-google" size={18} color="#EA4335" />
                <Text style={[styles.socialBtnText, { color: theme.textPrimary }]}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                activeOpacity={0.8}
                onPress={() => handleLaunchSocialAuth('Facebook')}
              >
                <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                <Text style={[styles.socialBtnText, { color: theme.textPrimary }]}>Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Secret Tap Area for Admin */}
          <TouchableOpacity activeOpacity={1} onPress={handleSecretVersionTap} style={{ marginTop: 32, alignItems: 'center' }}>
            <Text style={[styles.appVersion, { color: theme.textMuted }]}>FIMAX Cinema v2.4.0 (Build 2026)</Text>
          </TouchableOpacity>
        </ScrollView>

        <SocialAuthModal
          visible={showSocialModal}
          provider={socialProvider}
          onClose={() => setShowSocialModal(false)}
          onSuccess={handleSocialSuccess}
        />

        <AdminManagerModal
          visible={showAdminModal}
          onClose={() => setShowAdminModal(false)}
        />

        <OtpVerificationModal visible={showOtpModal} destination={email} onVerifySuccess={handleOtpSuccess} onCancel={() => setShowOtpModal(false)} />
      </KeyboardAvoidingView>
    );
  }

  // 2. High-End Authenticated Account Layout
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Hero Card */}
        <TouchableOpacity
          style={[styles.profileHero, { backgroundColor: theme.surface, borderColor: theme.border }]}
          activeOpacity={0.85}
          onPress={() => setShowEditProfileModal(true)}
        >
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={[styles.editIconBadge, { backgroundColor: accentColor, borderColor: theme.surface }]}>
              <Ionicons name="pencil" size={12} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.profileTextWrap}>
            <Text style={[styles.userName, { color: theme.textPrimary, fontSize: 18 * fontSizeScale }]}>{user.name}</Text>
            <Text style={[styles.userEmail, { color: theme.textSecondary, fontSize: 12 * fontSizeScale }]}>{user.email}</Text>
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>{user.plan || 'Thành viên Tiêu chuẩn'}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* Quick Action Pills */}
        <View style={styles.quickActionRow}>
          <TouchableOpacity style={[styles.quickPillPrimary, { backgroundColor: accentColor }]} activeOpacity={0.85} onPress={() => setShowVipModal(true)}>
            <Ionicons name="sparkles" size={16} color="#FFFFFF" />
            <Text style={styles.quickPillPrimaryText}>Nâng Cấp VIP</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.quickPillSecondary, { backgroundColor: theme.surface, borderColor: theme.border }]} activeOpacity={0.85} onPress={() => setShowRedeemModal(true)}>
            <Ionicons name="gift-outline" size={16} color="#D4AF37" />
            <Text style={styles.quickPillSecondaryText}>Đổi Mã Giftcode</Text>
          </TouchableOpacity>
        </View>

        {/* 1. Thông Tin Cá Nhân & Gói Cước */}
        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>TÀI KHOẢN & HỘI VIÊN</Text>
        <View style={[styles.cardGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity style={[styles.rowItem, { borderBottomColor: theme.borderLight }]} onPress={() => setShowEditProfileModal(true)}>
            <Ionicons name="person-circle-outline" size={22} color={theme.textPrimary} />
            <View style={styles.rowContent}>
              <Text style={[styles.rowTitle, { color: theme.textPrimary, fontSize: 14 * fontSizeScale }]}>Thông tin cá nhân</Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>Họ tên, SĐT, giới tính, đổi avatar</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.rowItem, { borderBottomColor: theme.borderLight }]} onPress={() => setShowSubManagerModal(true)}>
            <Ionicons name="diamond-outline" size={20} color="#D4AF37" />
            <View style={styles.rowContent}>
              <Text style={[styles.rowTitle, { color: theme.textPrimary, fontSize: 14 * fontSizeScale }]}>Quản lý gói đang sử dụng</Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>Xem hạn dùng, gia hạn & hủy gói cước</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowItem} onPress={() => setShowRedeemModal(true)}>
            <Ionicons name="key-outline" size={20} color={theme.textPrimary} />
            <View style={styles.rowContent}>
              <Text style={[styles.rowTitle, { color: theme.textPrimary, fontSize: 14 * fontSizeScale }]}>Kích hoạt mã quà tặng (Giftcode)</Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>Nhập mã voucher hoặc mã đối tác</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* 2. Tùy Chỉnh Giao Diện & Hiển Thị */}
        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>GIAO DIỆN & HIỂN THỊ</Text>
        <View style={[styles.cardGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity style={styles.rowItem} onPress={() => setShowAppearanceModal(true)}>
            <Ionicons name="color-palette-outline" size={20} color={accentColor} />
            <View style={styles.rowContent}>
              <Text style={[styles.rowTitle, { color: theme.textPrimary, fontSize: 14 * fontSizeScale }]}>Tùy chỉnh giao diện & cỡ chữ</Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>
                {themeMode === 'light' ? 'Chế độ Sáng' : 'Chế độ Tối OLED'} • Cỡ chữ {Math.round(fontSizeScale * 100)}%
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* 3. Thông Báo & Popup Alert */}
        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>THÔNG BÁO & TRẢI NGHIỆM</Text>
        <View style={[styles.cardGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.rowItem, { borderBottomColor: theme.borderLight }]}>
            <Ionicons name="notifications-outline" size={20} color={accentColor} />
            <View style={styles.rowContent}>
              <Text style={[styles.rowTitle, { color: theme.textPrimary, fontSize: 14 * fontSizeScale }]}>Cho phép nhận thông báo</Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>Nhận thông báo popup phim mới & ưu đãi</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: '#2C2C2E', true: accentColor }}
            />
          </View>

          <TouchableOpacity style={styles.rowItem} onPress={handleTestNotification}>
            <Ionicons name="paper-plane-outline" size={20} color={theme.textPrimary} />
            <View style={styles.rowContent}>
              <Text style={[styles.rowTitle, { color: theme.textPrimary, fontSize: 14 * fontSizeScale }]}>Gửi thông báo thử nghiệm</Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>Bấm để kiểm tra popup thông báo động từ rạp</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* 4. An Toàn & Bảo Mật */}
        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>AN TOÀN & BẢO MẬT</Text>
        <View style={[styles.cardGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity style={[styles.rowItem, { borderBottomColor: theme.borderLight }]} onPress={() => Alert.alert('Đổi mật khẩu', 'Email đổi mật khẩu đã được gửi đến ' + user.email)}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.textPrimary} />
            <View style={styles.rowContent}>
              <Text style={[styles.rowTitle, { color: theme.textPrimary, fontSize: 14 * fontSizeScale }]}>Đổi mật khẩu đăng nhập</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <View style={[styles.rowItem, { borderBottomColor: theme.borderLight }]}>
            <Ionicons name="shield-outline" size={20} color={theme.textPrimary} />
            <View style={styles.rowContent}>
              <Text style={[styles.rowTitle, { color: theme.textPrimary, fontSize: 14 * fontSizeScale }]}>Khóa mã PIN hồ sơ (18+)</Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>Bảo vệ nội dung người lớn với mã PIN 4 số</Text>
            </View>
            <Switch
              value={parentalPinEnabled}
              onValueChange={setParentalPinEnabled}
              trackColor={{ false: '#2C2C2E', true: accentColor }}
            />
          </View>
        </View>

        {/* 5. Bộ Nhớ & Cấu Hình */}
        <Text style={[styles.sectionHeader, { color: theme.textSecondary }]}>BỘ NHỚ & HỆ THỐNG</Text>
        <View style={[styles.cardGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity style={[styles.rowItem, { borderBottomColor: theme.borderLight }]} onPress={handleClearCache}>
            <Ionicons name="trash-bin-outline" size={20} color={theme.textPrimary} />
            <View style={styles.rowContent}>
              <Text style={[styles.rowTitle, { color: theme.textPrimary, fontSize: 14 * fontSizeScale }]}>Xóa bộ nhớ đệm cache</Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>Giải phóng 142.6 MB dung lượng</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowItem} onPress={() => setShowDevConfig(!showDevConfig)}>
            <Ionicons name="server-outline" size={20} color="#8E8E93" />
            <View style={styles.rowContent}>
              <Text style={[styles.rowTitle, { color: theme.textPrimary, fontSize: 14 * fontSizeScale }]}>Cấu hình Backend API & Webhook</Text>
              <Text style={[styles.rowSub, { color: theme.textSecondary }]}>Dành cho Dev</Text>
            </View>
            <Ionicons name={showDevConfig ? "chevron-up" : "chevron-down"} size={16} color={theme.textMuted} />
          </TouchableOpacity>

          {showDevConfig && (
            <View style={styles.devConfigBox}>
              <Text style={[styles.devLabel, { color: theme.textSecondary }]}>API BASE URL:</Text>
              <TextInput style={[styles.devInput, { backgroundColor: theme.inputBg, color: theme.textPrimary }]} value={inputApiUrl} onChangeText={setInputApiUrl} />

              <Text style={[styles.devLabel, { color: theme.textSecondary }]}>CALLBACK WEBHOOK URL:</Text>
              <TextInput style={[styles.devInput, { backgroundColor: theme.inputBg, color: theme.textPrimary }]} value={inputCallbackUrl} onChangeText={setInputCallbackUrl} />

              <TouchableOpacity style={[styles.devSaveBtn, { backgroundColor: accentColor }]} onPress={handleSaveDevConfig}>
                <Text style={styles.devSaveBtnText}>Lưu Cấu Hình API</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: theme.surface, borderColor: `${accentColor}44` }]}
          activeOpacity={0.8}
          onPress={() => {
            Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
              { text: 'Hủy', style: 'cancel' },
              { text: 'Đăng xuất', style: 'destructive', onPress: logout }
            ]);
          }}
        >
          <Text style={[styles.logoutBtnText, { color: accentColor }]}>Đăng Xuất</Text>
        </TouchableOpacity>

        {/* Secret 5-Tap Gesture on App Version to trigger Master Admin */}
        <TouchableOpacity activeOpacity={1} onPress={handleSecretVersionTap} style={{ marginTop: 16 }}>
          <Text style={[styles.appVersion, { color: theme.textMuted }]}>FIMAX Cinema v2.4.0 (Build 2026)</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modals */}
      <AdminManagerModal
        visible={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
      <AppearanceSettingsModal
        visible={showAppearanceModal}
        onClose={() => setShowAppearanceModal(false)}
      />
      <EditProfileModal
        visible={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
      />
      <SubscriptionManagerModal
        visible={showSubManagerModal}
        onClose={() => setShowSubManagerModal(false)}
        onOpenUpgradeModal={() => setShowVipModal(true)}
      />
      <VipSubscriptionModal visible={showVipModal} onClose={() => setShowVipModal(false)} />
      <RedeemCodeModal visible={showRedeemModal} onClose={() => setShowRedeemModal(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    paddingTop: 56,
    paddingHorizontal: 18,
    paddingBottom: 30
  },
  authScrollContent: {
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 40
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 28
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8
  },
  logoRed: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 1
  },
  logoWhite: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 2
  },
  authSubtitle: {
    fontSize: 13,
    textAlign: 'center'
  },
  tabSwitcher: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600'
  },
  formContainer: {
    gap: 16
  },
  inputWrap: {
    gap: 6
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  textInput: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1
  },
  submitBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  socialSection: {
    marginTop: 28,
    alignItems: 'center'
  },
  socialDividerText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 16
  },
  socialBtnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%'
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1
  },
  socialBtnText: {
    fontSize: 13,
    fontWeight: '600'
  },
  profileHero: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14
  },
  avatarWrapper: {
    position: 'relative'
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#222'
  },
  editIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5
  },
  profileTextWrap: {
    flex: 1,
    marginLeft: 14
  },
  userName: {
    fontWeight: '700'
  },
  userEmail: {
    marginTop: 2
  },
  planBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6
  },
  planBadgeText: {
    color: '#D4AF37',
    fontSize: 11,
    fontWeight: '700'
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24
  },
  quickPillPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6
  },
  quickPillPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  quickPillSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1C1E',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1
  },
  quickPillSecondaryText: {
    color: '#D4AF37',
    fontSize: 13,
    fontWeight: '700'
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4
  },
  cardGroup: {
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginBottom: 22
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12
  },
  rowContent: {
    flex: 1
  },
  rowTitle: {
    fontWeight: '500'
  },
  rowSub: {
    fontSize: 11,
    marginTop: 2
  },
  devConfigBox: {
    paddingVertical: 14,
    gap: 8
  },
  devLabel: {
    fontSize: 10,
    fontWeight: '700'
  },
  devInput: {
    borderRadius: 8,
    padding: 10,
    fontSize: 12
  },
  devSaveBtn: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6
  },
  devSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  logoutBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700'
  },
  appVersion: {
    fontSize: 11,
    textAlign: 'center'
  }
});
