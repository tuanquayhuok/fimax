import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

const NOTIFICATIONS = [
  { id: '1', title: 'Cyberpunk 2049 vừa phát hành bản 4K', time: '10 phút trước', unread: true },
  { id: '2', title: 'Lật Mặt 7 đạt Top 1 thịnh hành hôm nay', time: '2 giờ trước', unread: true },
  { id: '3', title: 'Tài khoản của bạn đã được bảo vệ với 2FA', time: '1 ngày trước', unread: false }
];

export const NotificationModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.popover}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Thông Báo</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>2 mới</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* List */}
          <View style={styles.list}>
            {NOTIFICATIONS.map((item) => (
              <TouchableOpacity key={item.id} style={styles.item} activeOpacity={0.7} onPress={onClose}>
                <View style={[styles.dot, item.unread && styles.dotUnread]} />
                <View style={styles.itemContent}>
                  <Text style={[styles.itemTitle, item.unread && styles.itemTitleUnread]} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemTime}>{item.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <TouchableOpacity style={styles.footerBtn} onPress={onClose}>
            <Text style={styles.footerText}>Đánh dấu đã đọc tất cả</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingTop: 64,
    paddingHorizontal: 16,
    alignItems: 'flex-end'
  },
  popover: {
    width: 320,
    backgroundColor: '#18181A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  countBadge: {
    backgroundColor: '#E50914',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 10
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  closeBtn: {
    padding: 2
  },
  list: {
    paddingVertical: 4
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    gap: 10
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'transparent',
    marginTop: 6
  },
  dotUnread: {
    backgroundColor: '#E50914'
  },
  itemContent: {
    flex: 1
  },
  itemTitle: {
    color: '#8E8E93',
    fontSize: 13,
    lineHeight: 18
  },
  itemTitleUnread: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  itemTime: {
    color: '#636366',
    fontSize: 11,
    marginTop: 3
  },
  footerBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)'
  },
  footerText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500'
  }
});