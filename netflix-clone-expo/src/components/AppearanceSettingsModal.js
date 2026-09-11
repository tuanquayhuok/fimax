import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { APP_ICONS, getAppIconById, updateDynamicAppIcon } from '../services/appIconService';
import { NotificationService } from '../services/notificationService';

const CATEGORIES = ['Tất cả', 'Locket VIP', 'Điện Ảnh', 'Neon & 3D', 'Aesthetic'];

export const AppearanceSettingsModal = ({ visible, onClose }) => {
  const { appIcon, setAppIcon, themeMode, accentColor, t } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  const [selectedIconId, setSelectedIconId] = useState(appIcon || 'classic_red');
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  // Sync with current appIcon on open
  React.useEffect(() => {
    if (appIcon) {
      setSelectedIconId(appIcon);
    }
  }, [appIcon, visible]);

  const activeIconObj = getAppIconById(selectedIconId);

  const filteredIcons = activeCategory === 'Tất cả'
    ? APP_ICONS
    : APP_ICONS.filter(i => i.category === activeCategory);

  const handleApply = async () => {
    setAppIcon(selectedIconId);
    updateDynamicAppIcon(selectedIconId);

    try {
      await NotificationService.sendNativeNotification(
        'Đã Đổi Biểu Tượng App Ứng Dụng ✨',
        `Biểu tượng FIMAX ngoài màn hình đã chuyển sang "${activeIconObj.name}".`,
        { type: 'appearance' }
      );
    } catch (e) {}

    Alert.alert(
      'Đổi Biểu Tượng Thành Công 🎉',
      `Bạn đã chọn mẫu "${activeIconObj.name}". Biểu tượng trên màn hình ngoài, shortcut và trình duyệt đã được cập nhật đồng bộ!`,
      [{ text: 'Tuyệt Vời', onPress: onClose }]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.headerIconCircle, { backgroundColor: `${accentColor}1A` }]}>
                <Ionicons name="apps" size={20} color={accentColor} />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Biểu Tượng Ứng Dụng</Text>
                <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Đổi Avatar FIMAX ngoài màn hình chính (Locket Style)</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* 1. Interactive Phone Mockup (Locket Style Home Screen Preview) */}
            <View style={styles.previewContainer}>
              <Text style={[styles.previewHeading, { color: theme.textSecondary }]}>
                XEM TRƯỚC NGOÀI MÀN HÌNH CHÍNH
              </Text>

              <View style={styles.phoneFrame}>
                {/* Phone Notch & Status Bar */}
                <View style={styles.phoneStatusBar}>
                  <Text style={styles.phoneTime}>09:41</Text>
                  <View style={styles.phoneDynamicIsland} />
                  <View style={styles.phoneStatusIcons}>
                    <Ionicons name="cellular" size={11} color="#FFFFFF" />
                    <Ionicons name="wifi" size={11} color="#FFFFFF" />
                    <Ionicons name="battery-full" size={12} color="#FFFFFF" />
                  </View>
                </View>

                {/* Home Screen Content */}
                <View style={styles.homeScreenContent}>
                  <Text style={styles.homeDate}>Thứ Bảy, 12 tháng 9</Text>

                  {/* App Grid on Mockup */}
                  <View style={styles.appGridMockup}>
                    {/* Dummy App 1: Camera */}
                    <View style={styles.mockAppItem}>
                      <View style={[styles.mockIconSquircle, { backgroundColor: '#3A3A3C' }]}>
                        <Ionicons name="camera" size={20} color="#AEAEB2" />
                      </View>
                      <Text style={styles.mockAppName}>Camera</Text>
                    </View>

                    {/* Active FIMAX App Icon Center Stage */}
                    <View style={styles.mockAppItemHero}>
                      <View style={[
                        styles.heroIconSquircle,
                        {
                          backgroundColor: activeIconObj.bg,
                          borderColor: activeIconObj.borderColor || '#FFFFFF',
                          shadowColor: activeIconObj.borderColor || accentColor
                        }
                      ]}>
                        <Text style={[styles.heroIconLetter, { color: activeIconObj.iconColor }]}>
                          {activeIconObj.letter || 'F'}
                        </Text>
                        <View style={[styles.heroSparkle, { backgroundColor: activeIconObj.iconColor }]}>
                          <Ionicons name={activeIconObj.iconName || 'sparkles'} size={9} color={activeIconObj.bg} />
                        </View>
                      </View>
                      <Text style={styles.heroAppName}>FIMAX</Text>
                      <View style={[styles.heroBadge, { backgroundColor: accentColor }]}>
                        <Text style={styles.heroBadgeText}>Đang chọn</Text>
                      </View>
                    </View>

                    {/* Dummy App 2: Photos */}
                    <View style={styles.mockAppItem}>
                      <View style={[styles.mockIconSquircle, { backgroundColor: '#3A3A3C' }]}>
                        <Ionicons name="images" size={20} color="#AEAEB2" />
                      </View>
                      <Text style={styles.mockAppName}>Ảnh</Text>
                    </View>
                  </View>

                  {/* Active Icon Details Banner */}
                  <View style={styles.activeDetailsPill}>
                    <Ionicons name="sparkles" size={13} color={activeIconObj.iconColor || accentColor} />
                    <Text style={styles.activeDetailsText}>
                      Đang xem: <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>{activeIconObj.name}</Text> ({activeIconObj.subtitle})
                    </Text>
                  </View>
                </View>

                {/* Dock Bar */}
                <View style={styles.phoneDock}>
                  <View style={[styles.dockIcon, { backgroundColor: '#34C759' }]}>
                    <Ionicons name="call" size={15} color="#FFFFFF" />
                  </View>
                  <View style={[styles.dockIcon, { backgroundColor: '#007AFF' }]}>
                    <Ionicons name="chatbubble" size={15} color="#FFFFFF" />
                  </View>
                  <View style={[styles.dockIcon, { backgroundColor: '#5856D6' }]}>
                    <Ionicons name="compass" size={15} color="#FFFFFF" />
                  </View>
                  <View style={[styles.dockIcon, { backgroundColor: '#FF2D55' }]}>
                    <Ionicons name="musical-notes" size={15} color="#FFFFFF" />
                  </View>
                </View>
              </View>
            </View>

            {/* 2. Category Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryPill,
                      isActive
                        ? { backgroundColor: accentColor, borderColor: accentColor }
                        : { backgroundColor: theme.inputBg, borderColor: theme.borderLight }
                    ]}
                    onPress={() => setActiveCategory(cat)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.categoryPillText,
                        { color: isActive ? '#FFFFFF' : theme.textSecondary, fontWeight: isActive ? '800' : '600' }
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* 3. Preset Icons Grid */}
            <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
              DANH SÁCH MẪU ICON AVATAR ({filteredIcons.length})
            </Text>

            <View style={styles.iconsGrid}>
              {filteredIcons.map((icon) => {
                const isSelected = selectedIconId === icon.id;
                const isCurrentSaved = appIcon === icon.id;
                return (
                  <TouchableOpacity
                    key={icon.id}
                    style={[
                      styles.iconCard,
                      {
                        backgroundColor: theme.inputBg,
                        borderColor: isSelected ? (icon.borderColor || accentColor) : theme.borderLight
                      },
                      isSelected && styles.iconCardSelected
                    ]}
                    activeOpacity={0.85}
                    onPress={() => setSelectedIconId(icon.id)}
                  >
                    {/* Icon Squircle Box */}
                    <View style={[
                      styles.iconSquircle,
                      {
                        backgroundColor: icon.bg,
                        borderColor: icon.borderColor || 'rgba(255,255,255,0.2)'
                      }
                    ]}>
                      <Text style={[styles.iconLetter, { color: icon.iconColor }]}>
                        {icon.letter || 'F'}
                      </Text>
                      <View style={[styles.iconMiniTag, { backgroundColor: `${icon.iconColor}25` }]}>
                        <Ionicons name={icon.iconName || 'sparkles'} size={11} color={icon.iconColor} />
                      </View>

                      {isSelected && (
                        <View style={[styles.selectedCheckBadge, { backgroundColor: icon.iconColor || accentColor }]}>
                          <Ionicons name="checkmark" size={11} color="#000000" />
                        </View>
                      )}
                    </View>

                    {/* Icon Info */}
                    <Text style={[styles.iconTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                      {icon.name}
                    </Text>
                    <Text style={[styles.iconSub, { color: theme.textMuted }]} numberOfLines={1}>
                      {icon.subtitle}
                    </Text>

                    {/* Badges */}
                    <View style={styles.badgeRow}>
                      <View style={[styles.tagBadge, { backgroundColor: `${accentColor}1A` }]}>
                        <Text style={[styles.tagBadgeText, { color: accentColor }]}>{icon.badge}</Text>
                      </View>
                      {isCurrentSaved && (
                        <View style={[styles.tagBadge, { backgroundColor: 'rgba(48, 209, 88, 0.15)' }]}>
                          <Text style={[styles.tagBadgeText, { color: '#30D158' }]}>Đang dùng</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
              <TouchableOpacity
                style={[styles.applyBtn, { backgroundColor: accentColor }]}
                onPress={handleApply}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={styles.applyBtnText}>
                  ÁP DỤNG "{activeIconObj.name.toUpperCase()}"
                </Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'flex-end'
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '94%',
    paddingBottom: 20,
    borderWidth: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  headerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800'
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2
  },
  closeBtn: {
    padding: 6
  },
  body: {
    padding: 16
  },

  // Mockup Home Screen Preview
  previewContainer: {
    marginBottom: 18
  },
  previewHeading: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4
  },
  phoneFrame: {
    backgroundColor: '#0A0A0F',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16
  },
  phoneStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  phoneTime: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  phoneDynamicIsland: {
    width: 60,
    height: 12,
    backgroundColor: '#000000',
    borderRadius: 6
  },
  phoneStatusIcons: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center'
  },
  homeScreenContent: {
    alignItems: 'center',
    paddingVertical: 8
  },
  homeDate: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11.5,
    fontWeight: '600',
    marginBottom: 14
  },
  appGridMockup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 24,
    marginBottom: 14
  },
  mockAppItem: {
    alignItems: 'center',
    opacity: 0.65
  },
  mockIconSquircle: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mockAppName: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500'
  },
  mockAppItemHero: {
    alignItems: 'center',
    transform: [{ scale: 1.08 }]
  },
  heroIconSquircle: {
    width: 58,
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8
  },
  heroIconLetter: {
    fontSize: 28,
    fontWeight: '900'
  },
  heroSparkle: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  heroAppName: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
    marginTop: 5
  },
  heroBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 3
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '800'
  },
  activeDetailsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  activeDetailsText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11
  },
  phoneDock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: 6
  },
  dockIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },

  // Categories
  categoryScroll: {
    gap: 8,
    paddingBottom: 14
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1
  },
  categoryPillText: {
    fontSize: 12
  },

  // Grid
  sectionHeading: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 12,
    marginLeft: 4
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16
  },
  iconCard: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 12,
    alignItems: 'center'
  },
  iconCardSelected: {
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6
  },
  iconSquircle: {
    width: 54,
    height: 54,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    marginBottom: 8,
    position: 'relative'
  },
  iconLetter: {
    fontSize: 24,
    fontWeight: '900'
  },
  iconMiniTag: {
    position: 'absolute',
    bottom: 3,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectedCheckBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    textAlign: 'center'
  },
  iconSub: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center'
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 6
  },
  tagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  tagBadgeText: {
    fontSize: 9,
    fontWeight: '700'
  },

  // Bottom apply
  bottomBar: {
    marginTop: 10
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.5
  }
});
