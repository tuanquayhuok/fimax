import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { SearchModal } from './SearchModal';
import { NotificationModal } from './NotificationModal';

export const HeaderBar = ({ navigation }) => {
  const { user, themeMode, accentColor } = useContext(AppContext);
  const theme = getThemeColors(themeMode);
  
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  return (
    <View style={[styles.headerContainer, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
      {/* Brand Logo */}
      <TouchableOpacity
        style={styles.brandWrap}
        activeOpacity={0.8}
        onPress={() => navigation?.navigate('HomeMain')}
      >
        <Text style={[styles.brandRed, { color: accentColor }]}>F</Text>
        <Text style={[styles.brandWhite, { color: theme.textPrimary }]}>IMAX</Text>
      </TouchableOpacity>

      {/* Action Icons */}
      <View style={styles.actionsWrap}>
        {/* Instant Search Popup */}
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: theme.surfaceSecondary }]}
          activeOpacity={0.7}
          onPress={() => setShowSearchModal(true)}
        >
          <Ionicons name="search" size={18} color={theme.textPrimary} />
        </TouchableOpacity>

        {/* Floating Notification Popover */}
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: theme.surfaceSecondary }]}
          activeOpacity={0.7}
          onPress={() => setShowNotificationModal(true)}
        >
          <Ionicons name="notifications-outline" size={18} color={theme.textPrimary} />
          <View style={[styles.notifDot, { backgroundColor: accentColor }]} />
        </TouchableOpacity>

        {/* User Profile Avatar */}
        <TouchableOpacity
          style={styles.avatarBtn}
          activeOpacity={0.8}
          onPress={() => navigation?.navigate('AccountTab')}
        >
          <Image
            source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80' }}
            style={[styles.avatarImg, { borderColor: accentColor }]}
          />
        </TouchableOpacity>
      </View>

      {/* Global Search Modal */}
      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        navigation={navigation}
      />

      {/* Global Compact Notification Popover */}
      <NotificationModal
        visible={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    zIndex: 100
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  brandRed: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  brandWhite: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2
  },
  actionsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5
  },
  avatarBtn: {
    marginLeft: 2
  },
  avatarImg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5
  }
});