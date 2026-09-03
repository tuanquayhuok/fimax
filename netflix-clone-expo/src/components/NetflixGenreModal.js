import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const NETFLIX_GENRES = [
  { id: 'all', name: 'Tất cả thể loại' },
  { id: 'cinema', name: 'Phim Chiếu Rạp Bom Tấn' },
  { id: 'vietnam', name: 'Điện Ảnh Việt Nam' },
  { id: 'korean', name: 'Phim Hàn Quốc & K-Drama' },
  { id: 'hollywood', name: 'Bom Tấn Hollywood' },
  { id: 'action', name: 'Hành Động & Phiêu Lưu' },
  { id: 'drama', name: 'Tâm Lý & Tình Cảm' },
  { id: 'horror', name: 'Kinh Dị & Giật Gân' },
  { id: 'anime', name: 'Hoạt Hình & Anime' },
  { id: 'comedy', name: 'Hài Hước Đặc Sắc' },
  { id: 'sci-fi', name: 'Khoa Học Viễn Tưởng' }
];

export const NetflixGenreModal = ({ visible, selectedGenre, onSelectGenre, onClose }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Genre List */}
          <FlatList
            data={NETFLIX_GENRES}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isSelected = selectedGenre === item.name || (item.id === 'all' && selectedGenre === 'Tất Cả');
              return (
                <TouchableOpacity
                  style={styles.genreItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    onSelectGenre(item.id === 'all' ? 'Tất Cả' : item.name);
                    onClose();
                  }}
                >
                  <Text style={[styles.genreText, isSelected && styles.genreTextActive]}>
                    {item.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.activeDot} />
                  )}
                </TouchableOpacity>
              );
            }}
          />

          {/* Iconic Netflix Big Round Close Button */}
          <TouchableOpacity style={styles.closeCircleBtn} activeOpacity={0.8} onPress={onClose}>
            <Ionicons name="close" size={28} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    width: '100%',
    height: '100%',
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  listContent: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 22
  },
  genreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8
  },
  genreText: {
    color: '#8E8E93',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3
  },
  genreTextActive: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800'
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E50914'
  },
  closeCircleBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20
  }
});