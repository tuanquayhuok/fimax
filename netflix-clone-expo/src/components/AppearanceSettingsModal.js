import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { NotificationService } from '../services/notificationService';

const APP_ICONS = [
  {
    id: 'classic_red',
    name: 'FIMAX Classic',
    subtitle: 'Đỏ Rạp Phim Gốc',
    bg: '#E50914',
    iconColor: '#FFFFFF',
    badge: 'Original',
    iconName: 'film'
  },
  {
    id: 'gold_vip',
    name: 'FIMAX Royal Gold',
    subtitle: 'Vàng Hoàng Gia 24K',
    bg: '#1A1810',
    borderColor: '#D4AF37',
    iconColor: '#D4AF37',
    badge: 'VIP',
    iconName: 'sparkles'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    subtitle: 'Xanh Điện Quang',
    bg: '#0A1A2F',
    borderColor: '#00D2FF',
    iconColor: '#00D2FF',
    badge: 'Sci-Fi',
    iconName: 'flash'
  },
  {
    id: 'velvet_purple',
    name: 'Velvet Midnight',
    subtitle: 'Tím Màn Nhung Rạp',
    bg: '#1F102B',
    borderColor: '#AF52DE',
    iconColor: '#AF52DE',
    badge: 'Cinema',
    iconName: 'moon'
  },
  {
    id: 'emerald_diamond',
    name: 'Emerald Diamond',
    subtitle: 'Xanh Ngọc Lục Bảo',
    bg: '#0D2418',
    borderColor: '#30D158',
    iconColor: '#30D158',
    badge: 'Luxury',
    iconName: 'diamond'
  },
  {
    id: 'sunset_flame',
    name: 'Sunset Flame',
    subtitle: 'Cam Lửa Rực Rỡ',
    bg: '#2B1405',
    borderColor: '#FF9500',
    iconColor: '#FF9500',
    badge: 'Hot',
    iconName: 'flame'
  },
  {
    id: 'stealth_black',
    name: 'Stealth Titanium',
    subtitle: 'Titanium Đen Mờ',
    bg: '#161618',
    borderColor: '#8E8E93',
    iconColor: '#E5E5EA',
    badge: 'Stealth',
    iconName: 'shield-checkmark'
  }
];

const ACCENT_COLORS = [
  { id: '#E50914', name: 'Đỏ Crimson (Mặc định)', color: '#E50914' },
  { id: '#D4AF37', name: 'Vàng Hoàng Gia VIP', color: '#D4AF37' },
  { id: '#00D2FF', name: 'Xanh Cyberpunk', color: '#00D2FF' },
  { id: '#AF52DE', name: 'Tím Velvet Cinema', color: '#AF52DE' },
  { id: '#30D158', name: 'Xanh Emerald', color: '#30D158' },
  { id: '#FF9500', name: 'Cam Hoàng Hôn', color: '#FF9500' },
  { id: '#FF2D55', name: 'Hồng Sakura Neon', color: '#FF2D55' },
  { id: '#5AC8FA', name: 'Xanh Băng Tuyết', color: '#5AC8FA' }
];

const FONT_SIZES = [
  { id: 0.9, name: 'Nhỏ (90%)' },
  { id: 1.0, name: 'Chuẩn (100%)' },
  { id: 1.15, name: 'Lớn (115%)' },
  { id: 1.3, name: 'Cực Đại (130%)' }
];

const FONT_WEIGHTS = [
  { id: 'light', name: 'Thanh Mảnh', weight: '300' },
  { id: 'regular', name: 'Tiêu Chuẩn', weight: '500' },
  { id: 'bold', name: 'Đậm Nét', weight: '700' },
  { id: 'heavy', name: 'Siêu Đậm', weight: '900' }
];

const FRAME_RATES = [
  { id: 30, name: '30 FPS', sub: 'Tiết kiệm pin' },
  { id: 45, name: '45 FPS', sub: 'Cân bằng' },
  { id: 60, name: '60 FPS', sub: 'Chuẩn điện ảnh' },
  { id: 90, name: '90 FPS', sub: 'ProMotion' },
];

export const AppearanceSettingsModal = ({ visible, onClose }) => {
  const {
    themeMode, setThemeMode,
    accentColor, setAccentColor,
    fontSizeScale, setFontSizeScale,
    fontWeightMode, setFontWeightMode,
    layoutDensity, setLayoutDensity,
    appIcon, setAppIcon,
    ambientLighting, setAmbientLighting,
    frameRate, setFrameRate,
    currentLanguage, setLanguage, LANGUAGES, t
  } = useContext(AppContext);

  // Local state for interactive editing before save
  const [tempTheme, setTempTheme] = useState(themeMode);
  const [tempColor, setTempColor] = useState(accentColor);
  const [tempSize, setTempSize] = useState(fontSizeScale);
  const [tempWeight, setTempWeight] = useState(fontWeightMode);
  const [tempDensity, setTempDensity] = useState(layoutDensity);
  const [tempAppIcon, setTempAppIcon] = useState(appIcon || 'classic_red');
  const [tempAmbient, setTempAmbient] = useState(ambientLighting !== false);
  const [tempFps, setTempFps] = useState(frameRate || 60);
  const [tempLang, setTempLang] = useState(currentLanguage || 'vi');

  const activeIconObj = APP_ICONS.find(i => i.id === tempAppIcon) || APP_ICONS[0];

  const handleSave = async () => {
    setThemeMode(tempTheme);
    setAccentColor(tempColor);
    setFontSizeScale(tempSize);
    setFontWeightMode(tempWeight);
    setLayoutDensity(tempDensity);
    setAppIcon(tempAppIcon);
    setAmbientLighting(tempAmbient);
    if (setFrameRate) setFrameRate(tempFps);
    if (setLanguage && tempLang) setLanguage(tempLang);

    try {
      await NotificationService.sendNativeNotification(
        'Đã Đổi Giao Diện & Icon 🎉',
        `Giao diện FIMAX đã được cập nhật theo phong cách "${activeIconObj.name}".`,
        { type: 'appearance' }
      );
    } catch (e) {}

    Alert.alert('Thành công', 'Đã lưu cấu hình Giao diện & Icon ứng dụng mới!');
    onClose();
  };

  const handleReset = () => {
    setTempTheme('dark');
    setTempColor('#E50914');
    setTempSize(1.0);
    setTempWeight('regular');
    setTempDensity('comfortable');
    setTempAppIcon('classic_red');
    setTempAmbient(true);
    setTempFps(60);
    setTempLang('vi');
  };

  const selectedWeightValue = FONT_WEIGHTS.find(w => w.id === tempWeight)?.weight || '500';

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="color-palette" size={22} color={tempColor} />
              <Text style={styles.headerTitle}>Studio Giao Diện & Icon App</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* 1. Live Interactive Preview Box */}
            <Text style={styles.sectionHeading}>XEM TRƯỚC THỜI GIAN THỰC (LIVE PREVIEW)</Text>
            <View style={[
              styles.previewBox,
              {
                backgroundColor: tempTheme === 'light' ? '#FFFFFF' : (tempTheme === 'midnight' ? '#0D1117' : '#121214'),
                borderColor: tempAmbient ? `${tempColor}50` : 'rgba(255, 255, 255, 0.1)'
              }
            ]}>
              <View style={styles.previewTopRow}>
                {/* Simulated App Icon Mini Card */}
                <View style={[
                  styles.previewMiniIcon,
                  {
                    backgroundColor: activeIconObj.bg,
                    borderColor: activeIconObj.borderColor || `${tempColor}80`,
                    borderWidth: 1.5
                  }
                ]}>
                  <Ionicons name={activeIconObj.iconName || 'film'} size={20} color={activeIconObj.iconColor} />
                  <Text style={[styles.previewIconMiniText, { color: activeIconObj.iconColor }]}>F</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <View style={[styles.previewBadge, { backgroundColor: tempColor }]}>
                    <Text style={styles.previewBadgeText}>4K ULTRA HD • HDR • {tempFps} FPS</Text>
                  </View>
                  <Text style={[
                    styles.previewTitle,
                    {
                      color: tempTheme === 'light' ? '#000000' : '#FFFFFF',
                      fontSize: 18 * tempSize,
                      fontWeight: selectedWeightValue,
                      marginTop: 4
                    }
                  ]}>
                    FIMAX Cinema Studio
                  </Text>
                </View>
              </View>

              <Text style={[
                styles.previewSubtitle,
                {
                  color: tempTheme === 'light' ? '#636366' : '#8E8E93',
                  fontSize: 11.5 * tempSize
                }
              ]}>
                Icon: <Text style={{ color: activeIconObj.iconColor, fontWeight: '700' }}>{activeIconObj.name}</Text> • Tần số quét: <Text style={{ color: tempColor, fontWeight: '700' }}>{tempFps} FPS</Text>
              </Text>

              <TouchableOpacity
                style={[styles.previewBtn, { backgroundColor: tempColor }]}
                activeOpacity={0.85}
              >
                <Ionicons name="play" size={16} color="#FFFFFF" />
                <Text style={[styles.previewBtnText, { fontSize: 13 * tempSize, fontWeight: selectedWeightValue }]}>
                  Trải Nghiệm Rạp Phim ({tempFps} FPS)
                </Text>
              </TouchableOpacity>
            </View>

            {/* 2. Custom App Icons Selection */}
            <Text style={styles.sectionHeading}>BIỂU TƯỢNG ỨNG DỤNG (CUSTOM APP ICONS)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.appIconsScroll}>
              {APP_ICONS.map((icon) => {
                const isSelected = tempAppIcon === icon.id;
                return (
                  <TouchableOpacity
                    key={icon.id}
                    style={[
                      styles.appIconCard,
                      isSelected && { borderColor: icon.iconColor, borderWidth: 2, transform: [{ scale: 1.04 }] }
                    ]}
                    activeOpacity={0.85}
                    onPress={() => {
                      setTempAppIcon(icon.id);
                      if (icon.borderColor) setTempColor(icon.borderColor);
                      else if (icon.bg && icon.bg.startsWith('#') && icon.bg !== '#1A1810') setTempColor(icon.bg);
                    }}
                  >
                    <View style={[
                      styles.appIconSquircle,
                      {
                        backgroundColor: icon.bg,
                        borderColor: icon.borderColor || 'rgba(255, 255, 255, 0.15)'
                      }
                    ]}>
                      <Ionicons name={icon.iconName || 'film'} size={26} color={icon.iconColor} />
                      <Text style={[styles.appIconLetter, { color: icon.iconColor }]}>F</Text>
                      {isSelected && (
                        <View style={[styles.appIconCheckBadge, { backgroundColor: icon.iconColor }]}>
                          <Ionicons name="checkmark" size={10} color="#000000" />
                        </View>
                      )}
                    </View>
                    <Text style={[styles.appIconName, isSelected && { color: '#FFFFFF', fontWeight: '700' }]} numberOfLines={1}>
                      {icon.name}
                    </Text>
                    <Text style={styles.appIconSub} numberOfLines={1}>
                      {icon.badge}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* 3. Tốc độ khung hình (Frame Rate / FPS) */}
            <Text style={styles.sectionHeading}>TỐC ĐỘ KHUNG HÌNH & TẦN SỐ QUÉT (FPS)</Text>
            <View style={styles.pillGrid}>
              {FRAME_RATES.map((fps) => {
                const active = tempFps === fps.id;
                return (
                  <TouchableOpacity
                    key={fps.id}
                    style={[styles.pillBtn, active && { backgroundColor: tempColor, borderColor: tempColor }]}
                    onPress={() => setTempFps(fps.id)}
                  >
                    <Text style={[styles.pillText, active && styles.pillTextActive, { fontWeight: '800' }]}>
                      {fps.name}
                    </Text>
                    <Text style={[{ fontSize: 9, marginTop: 1 }, active ? { color: 'rgba(255,255,255,0.85)' } : { color: '#8E8E93' }]}>
                      {fps.sub}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Ngôn ngữ hiển thị (Language) */}
            <Text style={styles.sectionHeading}>NGÔN NGỮ HIỂN THỊ (LANGUAGE)</Text>
            <View style={styles.pillGrid}>
              {LANGUAGES?.map((lang) => {
                const active = tempLang === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    style={[styles.pillBtn, active && { backgroundColor: tempColor, borderColor: tempColor }]}
                    onPress={() => setTempLang(lang.code)}
                  >
                    {lang.flagImg ? (
                      <Image
                        source={{ uri: lang.flagImg }}
                        style={{ width: 22, height: 15, borderRadius: 2, marginBottom: 2 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={{ fontSize: 16 }}>{lang.flag}</Text>
                    )}
                    <Text style={[styles.pillText, active && styles.pillTextActive, { fontWeight: '700', marginTop: 2 }]}>
                      {lang.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 4. Theme Mode (Sáng / Tối / Midnight) */}
            <Text style={styles.sectionHeading}>CHẾ ĐỘ NỀN RẠP PHIM</Text>
            <View style={styles.segmentRow}>
              {[
                { id: 'dark', name: 'Tối OLED', icon: 'moon' },
                { id: 'midnight', name: 'Midnight', icon: 'planet' },
                { id: 'light', name: 'Sáng', icon: 'sunny' }
              ].map((t) => {
                const active = tempTheme === t.id;
                return (
                  <TouchableOpacity
                    key={t.id}
                    style={[styles.segmentBtn, active && { backgroundColor: tempColor }]}
                    onPress={() => setTempTheme(t.id)}
                  >
                    <Ionicons name={t.icon} size={17} color={active ? '#FFFFFF' : '#8E8E93'} />
                    <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{t.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 4. Ambient Cinema Lighting Switch */}
            <View style={styles.switchRowCard}>
              <View style={styles.switchInfo}>
                <Ionicons name="bulb-outline" size={20} color={tempColor} />
                <View>
                  <Text style={styles.switchLabel}>Ánh Sáng Rạp Phim (Ambient Glow)</Text>
                  <Text style={styles.switchSubLabel}>Hiệu ứng hào quang mờ ảo theo màu chủ đạo</Text>
                </View>
              </View>
              <Switch
                value={tempAmbient}
                onValueChange={setTempAmbient}
                trackColor={{ false: '#3A3A3C', true: tempColor }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* 5. Accent Color (8 Luxury Colors) */}
            <Text style={styles.sectionHeading}>MÀU SẮC CHỦ ĐẠO HỆ THỐNG</Text>
            <View style={styles.colorGrid}>
              {ACCENT_COLORS.map((c) => {
                const isSelected = tempColor === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.colorGridItem, isSelected && { borderColor: c.color, borderWidth: 2 }]}
                    onPress={() => setTempColor(c.id)}
                  >
                    <View style={[styles.colorCircle, { backgroundColor: c.color }]}>
                      {isSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    </View>
                    <Text style={[styles.colorGridName, isSelected && { color: '#FFFFFF', fontWeight: '700' }]} numberOfLines={1}>
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 6. Font Size Scale */}
            <Text style={styles.sectionHeading}>KÍCH THƯỚC CỠ CHỮ HỆ THỐNG</Text>
            <View style={styles.pillGrid}>
              {FONT_SIZES.map((f) => {
                const active = tempSize === f.id;
                return (
                  <TouchableOpacity
                    key={f.id}
                    style={[styles.pillBtn, active && { backgroundColor: tempColor, borderColor: tempColor }]}
                    onPress={() => setTempSize(f.id)}
                  >
                    <Text style={[styles.pillText, active && styles.pillTextActive]}>{f.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 7. Font Weight */}
            <Text style={styles.sectionHeading}>ĐỘ ĐẬM NHẠT CHỮ (FONT WEIGHT)</Text>
            <View style={styles.pillGrid}>
              {FONT_WEIGHTS.map((w) => {
                const active = tempWeight === w.id;
                return (
                  <TouchableOpacity
                    key={w.id}
                    style={[styles.pillBtn, active && { backgroundColor: tempColor, borderColor: tempColor }]}
                    onPress={() => setTempWeight(w.id)}
                  >
                    <Text style={[styles.pillText, { fontWeight: w.weight }, active && styles.pillTextActive]}>
                      {w.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 8. Layout Density */}
            <Text style={styles.sectionHeading}>MẬT ĐỘ BỐ CỤC (LAYOUT DENSITY)</Text>
            <View style={styles.segmentRow}>
              {[
                { id: 'compact', name: 'Gọn Gàng (Hiển thị nhiều phim)' },
                { id: 'comfortable', name: 'Rộng Rãi (Tiêu chuẩn rạp)' }
              ].map((d) => {
                const active = tempDensity === d.id;
                return (
                  <TouchableOpacity
                    key={d.id}
                    style={[styles.segmentBtn, active && { backgroundColor: tempColor }]}
                    onPress={() => setTempDensity(d.id)}
                  >
                    <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{d.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Action Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                <Text style={styles.resetBtnText}>Mặc Định</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: tempColor }]} onPress={handleSave}>
                <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>LƯU CÀI ĐẶT</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
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
    backgroundColor: '#0F0F12',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '94%',
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)'
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800'
  },
  closeBtn: {
    padding: 4
  },
  body: {
    padding: 18
  },
  sectionHeading: {
    color: '#8E8E93',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 2
  },
  previewBox: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1.5,
    gap: 8
  },
  previewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  previewMiniIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  previewIconMiniText: {
    position: 'absolute',
    bottom: 2,
    right: 4,
    fontSize: 9,
    fontWeight: '900'
  },
  previewBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start'
  },
  previewBadgeText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800'
  },
  previewTitle: {
    letterSpacing: -0.3
  },
  previewSubtitle: {
    lineHeight: 16
  },
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
    gap: 6
  },
  previewBtnText: {
    color: '#FFFFFF'
  },

  // App Icons Scroll
  appIconsScroll: {
    gap: 10,
    paddingBottom: 12
  },
  appIconCard: {
    width: 96,
    backgroundColor: '#18181C',
    borderRadius: 14,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  appIconSquircle: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5
  },
  appIconLetter: {
    position: 'absolute',
    bottom: 2,
    right: 4,
    fontSize: 10,
    fontWeight: '900'
  },
  appIconCheckBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  appIconName: {
    color: '#8E8E93',
    fontSize: 10.5,
    fontWeight: '600',
    textAlign: 'center'
  },
  appIconSub: {
    color: '#636366',
    fontSize: 9,
    marginTop: 1
  },

  // Segment Row
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: '#18181C',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    gap: 4
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 9,
    gap: 6
  },
  segmentText: {
    color: '#8E8E93',
    fontSize: 11.5,
    fontWeight: '600'
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },

  // Switch card
  switchRowCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#18181C',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1
  },
  switchLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  switchSubLabel: {
    color: '#8E8E93',
    fontSize: 10.5,
    marginTop: 1
  },

  // Color Grid
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16
  },
  colorGridItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#18181C',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 10
  },
  colorCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center'
  },
  colorGridName: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '600',
    flex: 1
  },

  // Pill grid
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16
  },
  pillBtn: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#18181C',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  pillText: {
    color: '#8E8E93',
    fontSize: 11.5
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800'
  },

  // Bottom Buttons
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8
  },
  resetBtn: {
    flex: 1,
    backgroundColor: '#18181C',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  resetBtnText: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '700'
  },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5
  }
});