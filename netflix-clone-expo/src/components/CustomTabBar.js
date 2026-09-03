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
  const stretchAnim = useRef(new Animated.Value(1)).current;

  // Icon bounce scales for all 5 tabs
  const tabScales = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1)
  ]).current;

  useEffect(() => {
    // 1. Fluid liquid stretch effect during slide
    Animated.sequence([
      Animated.timing(stretchAnim, {
        toValue: 1.12,
        duration: 80,
        useNativeDriver: true
      }),
      Animated.spring(stretchAnim, {
        toValue: 1,
        friction: 6,
        tension: 85,
        useNativeDriver: true
      })
    ]).start();

    // 2. Slide active liquid capsule smoothly across tabs
    Animated.spring(slideAnim, {
      toValue: state.index * TAB_WIDTH,
      friction: 7,
      tension: 70,
      useNativeDriver: true
    }).start();

    // 3. Bounce the active icon
    tabScales.forEach((anim, idx) => {
      if (idx === state.index) {
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.2,
            duration: 120,
            useNativeDriver: true
          }),
          Animated.spring(anim, {
            toValue: 1.06,
            friction: 4,
            tension: 65,
            useNativeDriver: true
          })
        ]).start();
      } else {
        Animated.timing(anim, {
          toValue: 1,
          duration: 130,
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
      case 'RankingsTab':
        return { label: 'Xếp Hạng', icon: 'trophy', iconOutline: 'trophy-outline' };
      case 'LibraryTab':
        return { label: 'Thư Viện', icon: 'file-tray-full', iconOutline: 'file-tray-full-outline' };
      case 'DownloadTab':
      case 'ComingSoonTab':
        return { label: 'Sắp Chiếu', icon: 'calendar', iconOutline: 'calendar-outline' };
      case 'AccountTab':
        return { label: 'Tài Khoản', icon: 'person', iconOutline: 'person-outline' };
      default:
        return { label: 'Menu', icon: 'apps', iconOutline: 'apps-outline' };
    }
  };

  return (
    <View style={[styles.tabBarContainer, { backgroundColor: theme.tabBarBg, borderTopColor: theme.tabBarBorder }]}>
      {/* Floating Liquid Glass Capsule (Seamlessly highlights active tab) */}
      <Animated.View
        style={[
          styles.liquidGlassPill,
          {
            width: TAB_WIDTH - 14,
            left: 7,
            backgroundColor: `${accentColor}18`,
            borderColor: `${accentColor}4D`,
            shadowColor: accentColor,
            transform: [
              { translateX: slideAnim },
              { scaleX: stretchAnim }
            ]
          }
        ]}
      >
        {/* Subtle Top Glass Reflection */}
        <View style={styles.glassReflection} />
      </Animated.View>

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
              activeOpacity={0.85}
              onPress={onPress}
            >
              <Animated.View style={{ transform: [{ scale: tabScales[index] }] }}>
                <Ionicons
                  name={isFocused ? icon : iconOutline}
                  size={21}
                  color={isFocused ? accentColor : theme.textSecondary}
                />
              </Animated.View>

              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused ? accentColor : theme.textSecondary,
                    fontWeight: isFocused ? '800' : '500'
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
    height: 64,
    borderTopWidth: 1,
    paddingBottom: 4,
    position: 'relative',
    justifyContent: 'center'
  },
  liquidGlassPill: {
    position: 'absolute',
    top: 5,
    bottom: 5,
    borderRadius: 18,
    borderWidth: 1.2,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5
  },
  glassReflection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '42%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%'
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    zIndex: 10
  },
  tabLabel: {
    fontSize: 10.5,
    textAlign: 'center',
    letterSpacing: 0.2
  }
});
