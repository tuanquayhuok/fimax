import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const NetworkStatusBanner = () => {
  const [isOffline, setIsOffline] = useState(false);
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleOnline = () => {
        setIsOffline(false);
        Animated.timing(slideAnim, { toValue: -50, duration: 300, useNativeDriver: true }).start();
      };
      const handleOffline = () => {
        setIsOffline(true);
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      if (navigator && navigator.onLine === false) {
        handleOffline();
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [slideAnim]);

  if (!isOffline) return null;

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY: slideAnim }] }]}>
      <Ionicons name="cloud-offline" size={16} color="#FFFFFF" />
      <Text style={styles.text}>
        Đang ở chế độ Ngoại tuyến / Mạng yếu. Dữ liệu bộ nhớ đệm sẵn sàng xem mượt mà.
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#E50914',
    paddingVertical: 6,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 9999
  },
  text: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  }
});
