import React, { useContext, useState } from 'react';
import { View, Text, Switch, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/colors';
import { MOCK_MOVIES } from '../data/mockMovies';

export const SettingsScreen = () => {
  const {
    apiUrl, setApiUrl,
    callbackUrl, setCallbackUrl,
    isDarkMode, setIsDarkMode,
    defaultQuality, setDefaultQuality,
    defaultSubtitle, setDefaultSubtitle,
    autoPlayPreview, setAutoPlayPreview,
    notificationsEnabled, setNotificationsEnabled,
    showNotificationPopup,
    clearHistory
  } = useContext(AppContext);

  const [inputApi, setInputApi] = useState(apiUrl);
  const [inputCallback, setInputCallback] = useState(callbackUrl);
  const [testResult, setTestResult] = useState(null);

  const handleSaveUrls = () => {
    setApiUrl(inputApi);
    setCallbackUrl(inputCallback);
    Alert.alert('Đã lưu cấu hình', 'Server Base URL và Callback URL đã được cập nhật!');
  };

  const handleTestConnection = async () => {
    setTestResult('Đang kiểm tra kết nối...');
    try {
      const res = await fetch(`${inputApi}/movies`);
      if (res.ok) {
        const data = await res.json();
        setTestResult(`✅ Kết nối API thành công! Có ${data.count || data.data?.length || 0} phim.`);
      } else {
        setTestResult(`⚠️ Server phản hồi mã HTTP ${res.status}`);
      }
    } catch (e) {
      setTestResult(`❌ Lỗi kết nối: ${e.message}`);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Cài Đặt & Quản Trị</Text>

      {/* ADMIN & DEVELOPER DYNAMIC CONFIG */}
      <View style={styles.adminSection}>
        <View style={styles.adminHeader}>
          <Ionicons name="server-outline" size={20} color={Colors.primary} />
          <Text style={styles.adminTitle}>Cấu Hình Dynamic Backend URL & Callback</Text>
        </View>
        <Text style={styles.adminDesc}>
          Nhập URL API và Webhook Callback của bạn. App sẽ tự động tải phim từ link này và gửi dữ liệu tiến độ xem về server của bạn.
        </Text>

        <Text style={styles.inputLabel}>API Base URL:</Text>
        <TextInput
          style={styles.urlInput}
          value={inputApi}
          onChangeText={setInputApi}
          placeholder="http://192.168.1.x:4000/api"
          placeholderTextColor="#666"
          autoCapitalize="none"
        />

        <Text style={styles.inputLabel}>Playback Callback URL (Webhook):</Text>
        <TextInput
          style={styles.urlInput}
          value={inputCallback}
          onChangeText={setInputCallback}
          placeholder="http://192.168.1.x:4000/api/callback/progress"
          placeholderTextColor="#666"
          autoCapitalize="none"
        />

        <View style={styles.adminButtonsRow}>
          <TouchableOpacity style={styles.testBtn} onPress={handleTestConnection}>
            <Text style={styles.testBtnText}>Test Kết Nối</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveUrls}>
            <Text style={styles.saveBtnText}>Lưu Cấu Hình</Text>
          </TouchableOpacity>
        </View>

        {testResult && (
          <View style={styles.testResultBox}>
            <Text style={styles.testResultText}>{testResult}</Text>
          </View>
        )}
      </View>

      {/* USER APP SETTINGS */}
      <Text style={styles.sectionHeader}>Tùy Chọn Trải Nghiệm</Text>
      <View style={styles.settingsGroup}>
        <View style={styles.settingItem}>
          <View style={styles.settingLabelGroup}>
            <Text style={styles.settingLabel}>Giao diện Dark Mode</Text>
            <Text style={styles.settingSubLabel}>Phong cách rạp chiếu phim Netflix</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: '#444', true: Colors.primary }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLabelGroup}>
            <Text style={styles.settingLabel}>Chất lượng video mặc định</Text>
            <Text style={styles.settingSubLabel}>Độ phân giải ưu tiên khi bắt đầu phát</Text>
          </View>
          <TouchableOpacity
            style={styles.qualityBadge}
            onPress={() => setDefaultQuality(prev => prev === '1080p' ? '720p' : prev === '720p' ? '360p' : '1080p')}
          >
            <Text style={styles.qualityBadgeText}>{defaultQuality}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLabelGroup}>
            <Text style={styles.settingLabel}>Phụ đề mặc định</Text>
            <Text style={styles.settingSubLabel}>Tự động bật phụ đề khi xem phim</Text>
          </View>
          <TouchableOpacity
            style={styles.qualityBadge}
            onPress={() => setDefaultSubtitle(prev => prev === 'Tiếng Việt' ? 'English' : 'Tiếng Việt')}
          >
            <Text style={styles.qualityBadgeText}>{defaultSubtitle}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLabelGroup}>
            <Text style={styles.settingLabel}>Tự động phát preview</Text>
            <Text style={styles.settingSubLabel}>Phát đoạn trailer ngắn ở trang chủ</Text>
          </View>
          <Switch
            value={autoPlayPreview}
            onValueChange={setAutoPlayPreview}
            trackColor={{ false: '#444', true: Colors.primary }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLabelGroup}>
            <Text style={styles.settingLabel}>Thông báo phim mới</Text>
            <Text style={styles.settingSubLabel}>Nhận popup khi có phim bom tấn ra mắt</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={(val) => {
              setNotificationsEnabled(val);
              if (val) {
                showNotificationPopup(
                  '🔥 Bom Tấn Chiếu Rạp Mới Ra Mắt!',
                  'Lật Mặt 7: Một Điều Ước chính thức phát hành bản 4K Ultra HD độc quyền trên FIMAX.',
                  MOCK_MOVIES[1] || MOCK_MOVIES[0],
                  'movie'
                );
              }
            }}
            trackColor={{ false: '#444', true: Colors.primary }}
          />
        </View>

        <TouchableOpacity
          style={[styles.settingItem, { borderBottomWidth: 0 }]}
          activeOpacity={0.7}
          onPress={() => {
            showNotificationPopup(
              '🔥 Siêu Phẩm Chiếu Rạp Độc Quyền!',
              'Phim "Mai" của Trấn Thành đã sẵn sàng phát sóng với chất lượng 4K HDR và âm thanh Dolby Atmos.',
              MOCK_MOVIES[0],
              'movie'
            );
          }}
        >
          <View style={styles.settingLabelGroup}>
            <Text style={[styles.settingLabel, { color: Colors.primary, fontWeight: '700' }]}>Xem Thử Popup Thông Báo</Text>
            <Text style={styles.settingSubLabel}>Bấm để mở trải nghiệm popup rạp phim ngay trên app</Text>
          </View>
          <Ionicons name="play-circle-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>Dữ Liệu & Bộ Nhớ</Text>
      <View style={styles.settingsGroup}>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => { clearHistory(); Alert.alert('Đã xóa', 'Lịch sử xem đã được làm sạch!'); }}
        >
          <Text style={[styles.settingLabel, { color: '#ff5555' }]}>Xóa Toàn Bộ Lịch Sử Xem</Text>
          <Ionicons name="trash-outline" size={20} color="#ff5555" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>Thông Tin & Hỗ Trợ</Text>
      <View style={styles.settingsGroup}>
        <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Chính sách', 'Bảo mật thông tin người dùng 100%')}>
          <Text style={styles.settingLabel}>Chính sách bảo mật</Text>
          <Ionicons name="chevron-forward" size={18} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Điều khoản', 'Điều khoản dịch vụ xem phim trực tuyến')}>
          <Text style={styles.settingLabel}>Điều khoản dịch vụ</Text>
          <Ionicons name="chevron-forward" size={18} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Hỗ trợ', 'Hotline hỗ trợ kỹ thuật: 1900 xxxx (24/7)')}>
          <Text style={styles.settingLabel}>Liên hệ hỗ trợ kỹ thuật</Text>
          <Ionicons name="chevron-forward" size={18} color="#666" />
        </TouchableOpacity>
      </View>

      <Text style={styles.versionText}>Phiên bản 1.0.0 (Build 2026.08) • Cinema Pro</Text>
      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 48, paddingHorizontal: 16 },
  screenTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.white, marginBottom: 16 },
  adminSection: { backgroundColor: '#1C1C1E', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#3A3A3C', marginBottom: 20 },
  adminHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  adminTitle: { color: Colors.white, fontSize: 15, fontWeight: 'bold' },
  adminDesc: { color: '#8E8E93', fontSize: 12, lineHeight: 17, marginBottom: 12 },
  inputLabel: { color: '#ccc', fontSize: 12, fontWeight: '600', marginBottom: 4, marginTop: 6 },
  urlInput: { backgroundColor: '#111', color: '#fff', padding: 10, borderRadius: 8, fontSize: 13, borderWidth: 1, borderColor: '#333', marginBottom: 6 },
  adminButtonsRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  testBtn: { flex: 1, backgroundColor: '#333', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  testBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  saveBtn: { flex: 1.5, backgroundColor: Colors.primary, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  testResultBox: { backgroundColor: '#252528', padding: 10, borderRadius: 8, marginTop: 10 },
  testResultText: { color: '#fff', fontSize: 12 },
  sectionHeader: { color: '#aaa', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8, marginTop: 12 },
  settingsGroup: { backgroundColor: Colors.card, borderRadius: 10, paddingHorizontal: 14, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#2b2b2b' },
  settingLabelGroup: { flex: 1, marginRight: 12 },
  settingLabel: { color: '#fff', fontSize: 14, fontWeight: '500' },
  settingSubLabel: { color: '#777', fontSize: 11, marginTop: 2 },
  qualityBadge: { backgroundColor: '#333', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  qualityBadgeText: { color: Colors.primary, fontWeight: 'bold', fontSize: 12 },
  versionText: { textAlign: 'center', color: '#666', fontSize: 12, marginVertical: 16 }
});