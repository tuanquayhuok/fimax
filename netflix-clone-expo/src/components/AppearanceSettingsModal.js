import React, { useState, useContext } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/colors';

const ACCENT_COLORS = [
  { id: '#E50914', name: 'Đỏ Crimson (Mặc định)', color: '#E50914' },
  { id: '#D4AF37', name: 'Vàng Champagne VIP', color: '#D4AF37' },
  { id: '#0A84FF', name: 'Xanh Cyberpunk', color: '#0A84FF' },
  { id: '#AF52DE', name: 'Tím Velvet Cinema', color: '#AF52DE' },
  { id: '#30D158', name: 'Xanh Emerald', color: '#30D158' }
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

export const AppearanceSettingsModal = ({ visible, onClose }) => {
  const {
    themeMode, setThemeMode,
    accentColor, setAccentColor,
    fontSizeScale, setFontSizeScale,
    fontWeightMode, setFontWeightMode,
    layoutDensity, setLayoutDensity
  } = useContext(AppContext);

  // Local state for interactive editing before save
  const [tempTheme, setTempTheme] = useState(themeMode);
  const [tempColor, setTempColor] = useState(accentColor);
  const [tempSize, setTempSize] = useState(fontSizeScale);
  const [tempWeight, setTempWeight] = useState(fontWeightMode);
  const [tempDensity, setTempDensity] = useState(layoutDensity);

  const handleSave = () => {
    setThemeMode(tempTheme);
    setAccentColor(tempColor);
    setFontSizeScale(tempSize);
    setFontWeightMode(tempWeight);
    setLayoutDensity(tempDensity);
    Alert.alert('Thành công', 'Đã lưu cấu hình giao diện & cỡ chữ mới!');
    onClose();
  };

  const handleReset = () => {
    setTempTheme('dark');
    setTempColor('#E50914');
    setTempSize(1.0);
    setTempWeight('regular');
    setTempDensity('comfortable');
  };

  const selectedWeightValue = FONT_WEIGHTS.find(w => w.id === tempWeight)?.weight || '500';

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Tùy Chỉnh Giao Diện & Cỡ Chữ</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* 1. Live Interactive Preview Box */}
            <Text style={styles.sectionHeading}>XEM TRƯỚC THỜI GIAN THỰC (LIVE PREVIEW)</Text>
            <View style={[
              styles.previewBox,
              { backgroundColor: tempTheme === 'light' ? '#FFFFFF' : '#141416' }
            ]}>
              <View style={[styles.previewBadge, { backgroundColor: tempColor }]}>
                <Text style={styles.previewBadgeText}>4K ULTRA HD</Text>
              </View>

              <Text style={[
                styles.previewTitle,
                {
                  color: tempTheme === 'light' ? '#000000' : '#FFFFFF',
                  fontSize: 20 * tempSize,
                  fontWeight: selectedWeightValue
                }
              ]}>
                FIMAX Cinema Original
              </Text>

              <Text style={[
                styles.previewSubtitle,
                {
                  color: tempTheme === 'light' ? '#636366' : '#8E8E93',
                  fontSize: 12 * tempSize
                }
              ]}>
                Trải nghiệm phim điện ảnh với màu sắc và cỡ chữ tùy chỉnh theo sở thích của bạn.
              </Text>

              <TouchableOpacity
                style={[styles.previewBtn, { backgroundColor: tempColor }]}
                activeOpacity={0.85}
              >
                <Ionicons name="play" size={16} color="#FFFFFF" />
                <Text style={[styles.previewBtnText, { fontSize: 13 * tempSize, fontWeight: selectedWeightValue }]}>
                  Xem Phim Ngay
                </Text>
              </TouchableOpacity>
            </View>

            {/* 2. Theme Mode (Sáng / Tối) */}
            <Text style={styles.sectionHeading}>CHẾ ĐỘ NỀN GIAO DIỆN</Text>
            <View style={styles.segmentRow}>
              {[
                { id: 'dark', name: 'Tối OLED', icon: 'moon' },
                { id: 'light', name: 'Sáng', icon: 'sunny' },
                { id: 'system', name: 'Hệ Thống', icon: 'phone-portrait-outline' }
              ].map((t) => {
                const active = tempTheme === t.id;
                return (
                  <TouchableOpacity
                    key={t.id}
                    style={[styles.segmentBtn, active && styles.segmentBtnActive]}
                    onPress={() => setTempTheme(t.id)}
                  >
                    <Ionicons name={t.icon} size={18} color={active ? '#FFFFFF' : '#8E8E93'} />
                    <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{t.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 3. Accent Color (Màu Chủ Đạo) */}
            <Text style={styles.sectionHeading}>MÀU SẮC CHỦ ĐẠO HỆ THỐNG</Text>
            <View style={styles.colorWrap}>
              {ACCENT_COLORS.map((c) => {
                const isSelected = tempColor === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.colorItem, isSelected && { borderColor: c.color, borderWidth: 2 }]}
                    onPress={() => setTempColor(c.id)}
                  >
                    <View style={[styles.colorCircle, { backgroundColor: c.color }]}>
                      {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                    </View>
                    <Text style={[styles.colorName, isSelected && { color: '#FFFFFF', fontWeight: '700' }]}>
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 4. Font Size Scale (Kích Thước Cỡ Chữ) */}
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

            {/* 5. Font Weight (Độ Đậm Nhạt) */}
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

            {/* 6. Layout Density (Mật Độ Hiển Thị) */}
            <Text style={styles.sectionHeading}>MẬT ĐỘ BỐ CỤC (LAYOUT DENSITY)</Text>
            <View style={styles.segmentRow}>
              {[
                { id: 'compact', name: 'Gọn Gàng (Nhiều phim hơn)' },
                { id: 'comfortable', name: 'Rộng Rãi (Tiêu chuẩn rạp)' }
              ].map((d) => {
                const active = tempDensity === d.id;
                return (
                  <TouchableOpacity
                    key={d.id}
                    style={[styles.segmentBtn, active && styles.segmentBtnActive]}
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
                <Text style={styles.saveBtnText}>LƯU CÀI ĐẶT</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end'
  },
  sheet: {
    backgroundColor: '#101012',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
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
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700'
  },
  closeBtn: {
    padding: 4
  },
  body: {
    padding: 20
  },
  sectionHeading: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 8,
    marginLeft: 2
  },
  previewBox: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8
  },
  previewBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start'
  },
  previewBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
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
    borderRadius: 8,
    marginTop: 4,
    gap: 6
  },
  previewBtnText: {
    color: '#FFFFFF'
  },
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
    gap: 4
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6
  },
  segmentBtnActive: {
    backgroundColor: '#2C2C2E'
  },
  segmentText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500'
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  colorWrap: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 12,
    gap: 10,
    marginBottom: 18
  },
  colorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#121214',
    gap: 12
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  colorName: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '500'
  },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18
  },
  pillBtn: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1C1C1E',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  pillText: {
    color: '#8E8E93',
    fontSize: 12
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10
  },
  resetBtn: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  resetBtnText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600'
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5
  }
});