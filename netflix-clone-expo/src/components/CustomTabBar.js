import React, { useEffect, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';

const { width } = Dimensions.get('window');
const TAB_COUNT = 5;
const TAB_WIDTH = width / TAB_COUNT;

export const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { themeMode, accentColor } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  // Animated sliding pill position
  const slideAnim = useRef(new Animated.Value(state.index * TAB_WIDTH)).current;

  // Icon bounce scales for all 5 tabs
  const tabScales = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1)
  ]).current;

  useEffect(() => {
    // 1. Slide active background indicator smoothly across the tab bar
    Animated.spring(slideAnim, {
      toValue: state.index * TAB_WIDTH,
      friction: 7,
      tension: 60,
      useNativeDriver: true
    }).start();

    // 2. Bounce the active icon
    tabScales.forEach((anim, idx) => {
      if (idx === state.index) {
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.22,
            duration: 140,
            useNativeDriver: true
          }),
          Animated.spring(anim, {
            toValue: 1.05,
            friction: 4,
            tension: 50,
            useNativeDriver: true
          })
        ]).start();
      } else {
        Animated.timing(anim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true
        }).start();
      }
    });
  }, [state.index]);

  const getTabMeta = (routeName) => {
    switch (routeName) {
      case 'HomeTab':
        return { label: 'Trang Chủ', icon: 'home', iconOutline: 'home-outline' };
      case 'ExploreTab':
        return { label: 'Khám Phá', icon: 'flame', iconOutline: 'flame-outline' };
      case 'LibraryTab':
        return { label: 'Thư Viện', icon: 'file-tray-full', iconOutline: 'file-tray-full-outline' };
      case 'DownloadTab':
        return { label: 'Tải Xuống', icon: 'download', iconOutline: 'download-outline' };
      case 'AccountTab':
        return { label: 'Tài Khoản', icon: 'person', iconOutline: 'person-outline' };
      default:
        return { label: 'Menu', icon: 'apps', iconOutline: 'apps-outline' };
    }
  };

  return (
    <View style={[styles.tabBarContainer, { backgroundColor: theme.tabBarBg, borderTopColor: theme.tabBarBorder }]}>
      {/* Sliding Active Top Bar Indicator */}
      <Animated.View
        style={[
          styles.activeIndicator,
          {
            width: TAB_WIDTH * 0.45,
            left: TAB_WIDTH * 0.275,
            backgroundColor: accentColor,
            transform: [{ translateX: slideAnim }]
          }
        ]}
      />

      {/* 5 Tab Items */}
      <View style={styles.tabsRow}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { label, icon, iconOutline } = getTabMeta(route.name);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabBtn}
              activeOpacity={0.8}
              onPress={onPress}
            >
              <Animated.View style={{ transform: [{ scale: tabScales[index] }] }}>
                <Ionicons
                  name={isFocused ? icon : iconOutline}
                  size={22}
                  color={isFocused ? accentColor : theme.textSecondary}
                />
              </Animated.View>

              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused ? accentColor : theme.textSecondary,
                    fontWeight: isFocused ? '700' : '500'
                  }
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    height: 68,
    borderTopWidth: 1,
    paddingBottom: 8,
    position: 'relative',
    justifyContent: 'center'
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    borderRadius: 2,
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    paddingTop: 4
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3
  },
  tabLabel: {
    fontSize: 10,
    textAlign: 'center'
  }
});