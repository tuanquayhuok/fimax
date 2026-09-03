import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { MOCK_MOVIES } from '../data/mockMovies';

export const DownloadScreen = ({ navigation }) => {
  const { themeMode, accentColor, fontSizeScale, setActiveMovieForPlayer } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  // Downloaded movies state
  const [downloadedList, setDownloadedList] = useState([
    {
      ...MOCK_MOVIES[0],
      fileSize: '1.8 GB',
      quality: '4K Ultra HD',
      downloadedAt: '02/09/2026'
    },
    {
      ...MOCK_MOVIES[1],
      fileSize: '1.4 GB',
      quality: '1080p Full HD',
      downloadedAt: '01/09/2026'
    }
  ]);

  const handleDeleteDownload = (movieId, title) => {
    Alert.alert(
      'Xóa bản tải xuống',
      `Bạn có chắc chắn muốn xóa "${title}" để giải phóng dung lượng bộ nhớ?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setDownloadedList(prev => prev.filter(m => m.id !== movieId));
          }
        }
      ]
    );
  };

  const handleClearAll = () => {
    if (downloadedList.length === 0) return;
    Alert.alert(
      'Xóa tất cả bản tải xuống',
      'Giải phóng toàn bộ 3.2 GB dung lượng bộ nhớ?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa tất cả', style: 'destructive', onPress: () => setDownloadedList([]) }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.textPrimary, fontSize: 26 * fontSizeScale }]}>
            Tải Xuống Ngoại Tuyến
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Xem phim chuẩn 4K mọi lúc mọi nơi không cần mạng
          </Text>
        </View>

        {downloadedList.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
            <Ionicons name="trash-outline" size={18} color="#E50914" />
          </TouchableOpacity>
        )}
      </View>

      {/* Storage Bar Card */}
      <View style={[styles.storageCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.storageHeader}>
          <View style={styles.storageTextGroup}>
            <Text style={[styles.storageTitle, { color: theme.textPrimary }]}>Dung lượng FIMAX</Text>
            <Text style={[styles.storageSub, { color: theme.textSecondary }]}>Đã dùng {downloadedList.length > 0 ? '3.2 GB' : '0 GB'} / 128 GB</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: 'rgba(48, 209, 88, 0.15)' }]}>
            <Text style={styles.statusText}>🟢 Sẵn sàng xem Offline</Text>
          </View>
        </View>

        {/* Storage Bar Visual */}
        <View style={styles.storageBarBg}>
          <View style={[styles.storageBarFill, { width: downloadedList.length > 0 ? '25%' : '0%', backgroundColor: accentColor }]} />
        </View>
      </View>

      {/* Downloaded List */}
      {downloadedList.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyIconCircle, { backgroundColor: theme.surface }]}>
            <Ionicons name="download-outline" size={42} color={theme.textMuted} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Chưa có phim nào được tải xuống</Text>
          <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
            Khi xem phim, bạn có thể nhấn nút "Tải xuống" để lưu phim về máy và thưởng thức khi không có kết nối Wifi/4G.
          </Text>
          <TouchableOpacity
            style={[styles.exploreBtn, { backgroundColor: accentColor }]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('HomeTab')}
          >
            <Text style={styles.exploreBtnText}>Khám phá kho phim</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={downloadedList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const posterImg = item.posterUrl || item.poster || item.backdropUrl;
            return (
              <View style={[styles.downloadItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                {/* Poster */}
                <Image source={{ uri: posterImg }} style={styles.posterThumb} />

                {/* Details */}
                <TouchableOpacity
                  style={styles.itemInfo}
                  activeOpacity={0.8}
                  onPress={() => setActiveMovieForPlayer(item)}
                >
                  <Text style={[styles.movieTitle, { color: theme.textPrimary, fontSize: 15 * fontSizeScale }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.movieMeta, { color: theme.textMuted }]}>
                    {item.quality} • {item.fileSize}
                  </Text>
                  <Text style={[styles.downloadDate, { color: theme.textSecondary }]}>
                    Đã tải ngày: {item.downloadedAt}
                  </Text>
                </TouchableOpacity>

                {/* Actions: Play and Delete */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.playSmallBtn, { backgroundColor: accentColor }]}
                    activeOpacity={0.85}
                    onPress={() => setActiveMovieForPlayer(item)}
                  >
                    <Ionicons name="play" size={16} color="#FFFFFF" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.deleteBtn, { backgroundColor: theme.surfaceSecondary }]}
                    activeOpacity={0.7}
                    onPress={() => handleDeleteDownload(item.id, item.title)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#E50914" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 14
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 12,
    marginTop: 3
  },
  clearBtn: {
    padding: 8
  },
  storageCard: {
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 18
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  storageTextGroup: {
    flex: 1
  },
  storageTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  storageSub: {
    fontSize: 11,
    marginTop: 2
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  statusText: {
    color: '#30D158',
    fontSize: 10,
    fontWeight: '700'
  },
  storageBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden'
  },
  storageBarFill: {
    height: '100%',
    borderRadius: 3
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 30
  },
  downloadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    gap: 12
  },
  posterThumb: {
    width: 60,
    height: 85,
    borderRadius: 8,
    backgroundColor: '#222'
  },
  itemInfo: {
    flex: 1
  },
  movieTitle: {
    fontWeight: '700',
    marginBottom: 3
  },
  movieMeta: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2
  },
  downloadDate: {
    fontSize: 10
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  playSmallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    gap: 12
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center'
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18
  },
  exploreBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  }
});