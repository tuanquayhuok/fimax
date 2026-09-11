import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';

export const Footer = ({ navigation, onSelectCategory }) => {
  const { themeMode, accentColor, t } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.warn('Cannot open url:', err));
  };

  return (
    <View style={[styles.container, { backgroundColor: themeMode === 'light' ? '#F0F2F5' : '#0B0C0E', borderTopColor: themeMode === 'light' ? '#E4E6EB' : 'rgba(255,255,255,0.08)' }]}>
      {/* Brand & Slogan Header */}
      <View style={styles.brandSection}>
        <View style={styles.logoRow}>
          <View style={[styles.logoBadge, { backgroundColor: accentColor }]}>
            <Ionicons name="film" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.logoText}>
            FI<Text style={{ color: accentColor }}>MAX</Text>
          </Text>
          <View style={styles.vipTag}>
            <Text style={styles.vipTagText}>CINEMA 4K</Text>
          </View>
        </View>
        <Text style={[styles.slogan, { color: theme.textSecondary }]}>
          Nền tảng xem phim trực tuyến chất lượng cao hàng đầu Việt Nam. Chuẩn điện ảnh 4K Ultra HD, âm thanh vòm Dolby Atmos sống động và phụ đề đa ngôn ngữ.
        </Text>
      </View>

      {/* Feature Highlights Badges */}
      <View style={styles.badgesRow}>
        <View style={[styles.featureBadge, { backgroundColor: themeMode === 'light' ? '#FFFFFF' : 'rgba(255,255,255,0.05)', borderColor: themeMode === 'light' ? '#DDD' : 'rgba(255,255,255,0.1)' }]}>
          <Ionicons name="sparkles" size={13} color="#D4AF37" />
          <Text style={[styles.badgeText, { color: theme.textPrimary }]}>4K Ultra HD</Text>
        </View>
        <View style={[styles.featureBadge, { backgroundColor: themeMode === 'light' ? '#FFFFFF' : 'rgba(255,255,255,0.05)', borderColor: themeMode === 'light' ? '#DDD' : 'rgba(255,255,255,0.1)' }]}>
          <Ionicons name="volume-high" size={13} color="#00D26A" />
          <Text style={[styles.badgeText, { color: theme.textPrimary }]}>Dolby Atmos</Text>
        </View>
        <View style={[styles.featureBadge, { backgroundColor: themeMode === 'light' ? '#FFFFFF' : 'rgba(255,255,255,0.05)', borderColor: themeMode === 'light' ? '#DDD' : 'rgba(255,255,255,0.1)' }]}>
          <Ionicons name="globe-outline" size={13} color="#3B82F6" />
          <Text style={[styles.badgeText, { color: theme.textPrimary }]}>Đa Ngôn Ngữ</Text>
        </View>
        <View style={[styles.featureBadge, { backgroundColor: themeMode === 'light' ? '#FFFFFF' : 'rgba(255,255,255,0.05)', borderColor: themeMode === 'light' ? '#DDD' : 'rgba(255,255,255,0.1)' }]}>
          <Ionicons name="shield-checkmark" size={13} color={accentColor} />
          <Text style={[styles.badgeText, { color: theme.textPrimary }]}>Bản Quyền 100%</Text>
        </View>
      </View>

      {/* Navigation Columns */}
      <View style={styles.linksGrid}>
        {/* Col 1: Danh mục */}
        <View style={styles.linkCol}>
          <Text style={[styles.colHeading, { color: theme.textPrimary }]}>DANH MỤC</Text>
          <TouchableOpacity style={styles.linkItem} onPress={() => onSelectCategory && onSelectCategory('Phim Chiếu Rạp Mới Nhất')}>
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>Phim Chiếu Rạp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem} onPress={() => onSelectCategory && onSelectCategory('Phim Hoạt Hình Mới Nhất')}>
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>Phim Hoạt Hình & Anime</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem} onPress={() => onSelectCategory && onSelectCategory('Phim Hàn Quốc')}>
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>Phim Hàn Quốc</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem} onPress={() => onSelectCategory && onSelectCategory('Phim Sắp Chiếu')}>
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>Phim Sắp Chiếu 2025-2026</Text>
          </TouchableOpacity>
        </View>

        {/* Col 2: Hỗ trợ & Khách hàng */}
        <View style={styles.linkCol}>
          <Text style={[styles.colHeading, { color: theme.textPrimary }]}>HỖ TRỢ</Text>
          <TouchableOpacity style={styles.linkItem} onPress={() => navigation && navigation.navigate('ExploreTab')}>
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>Khám Phá & Thịnh Hành</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem} onPress={() => navigation && navigation.navigate('RankingsTab')}>
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>Bảng Xếp Hạng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem} onPress={() => navigation && navigation.navigate('AccountTab')}>
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>Gói VIP & Tài Khoản</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem} onPress={() => navigation && navigation.navigate('DownloadsTab')}>
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>Tải Phim Offline</Text>
          </TouchableOpacity>
        </View>

        {/* Col 3: Điều khoản & Pháp lý */}
        <View style={styles.linkCol}>
          <Text style={[styles.colHeading, { color: theme.textPrimary }]}>CHÍNH SÁCH</Text>
          <TouchableOpacity style={styles.linkItem} onPress={() => openLink('https://fimax.aecongnghe.online/')}>
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>Điều Khoản Dịch Vụ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem} onPress={() => openLink('https://fimax.aecongnghe.online/')}>
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>Chính Sách Bảo Mật</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem} onPress={() => openLink('https://fimax.aecongnghe.online/')}>
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>Khiếu Nại Bản Quyền</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem} onPress={() => openLink('https://fimax.aecongnghe.online/')}>
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>Hợp Tác Quảng Cáo</Text>
          </TouchableOpacity>
        </View>

        {/* Col 4: Liên hệ & Mạng xã hội */}
        <View style={styles.linkCol}>
          <Text style={[styles.colHeading, { color: theme.textPrimary }]}>KẾT NỐI</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity style={[styles.socialIconBtn, { backgroundColor: '#1877F2' }]} onPress={() => openLink('https://facebook.com')}>
              <Ionicons name="logo-facebook" size={17} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialIconBtn, { backgroundColor: '#FF0000' }]} onPress={() => openLink('https://youtube.com')}>
              <Ionicons name="logo-youtube" size={17} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialIconBtn, { backgroundColor: '#0088CC' }]} onPress={() => openLink('https://telegram.org')}>
              <Ionicons name="paper-plane" size={15} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialIconBtn, { backgroundColor: '#000000', borderWidth: 1, borderColor: '#333' }]} onPress={() => openLink('https://tiktok.com')}>
              <Ionicons name="logo-tiktok" size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.contactInfo, { color: theme.textMuted }]}>
            Hotline: 1900 8888 (24/7)
Email: contact@fimax.vn
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: themeMode === 'light' ? '#E4E6EB' : 'rgba(255,255,255,0.07)' }]} />

      {/* Copyright & Disclaimer Footer Bottom */}
      <View style={styles.bottomBar}>
        <Text style={[styles.copyrightText, { color: theme.textMuted }]}>
          © 2026 FIMAX Cinema Corporation. Bản quyền thuộc về FIMAX Entertainment. All rights reserved.
        </Text>
        <Text style={[styles.disclaimerText, { color: theme.textMuted }]}>
          Trang web và ứng dụng xem phim trực tuyến phục vụ mục đích giải trí và trải nghiệm điện ảnh chuẩn 4K.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    marginTop: 20
  },
  brandSection: {
    marginBottom: 20
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2
  },
  vipTag: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D4AF37'
  },
  vipTagText: {
    color: '#D4AF37',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  slogan: {
    fontSize: 12.5,
    lineHeight: 19,
    maxWidth: 620
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 26
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700'
  },
  linksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
    marginBottom: 24
  },
  linkCol: {
    minWidth: 140,
    flex: 1,
    gap: 8
  },
  colHeading: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4
  },
  linkItem: {
    paddingVertical: 3
  },
  linkText: {
    fontSize: 12,
    fontWeight: '500'
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 8
  },
  socialIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contactInfo: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 16
  },
  bottomBar: {
    alignItems: 'center',
    gap: 4
  },
  copyrightText: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600'
  },
  disclaimerText: {
    fontSize: 10,
    textAlign: 'center'
  }
});
