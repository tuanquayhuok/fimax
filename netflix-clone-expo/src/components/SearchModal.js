import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, FlatList, Image, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { ApiService } from '../services/apiService';

const GENRES = ['Tất cả', 'Chiếu Rạp', 'Việt Nam', 'Hàn Quốc', 'Hành Động', 'Tâm Lý', 'Kinh Dị', 'Hoạt Hình'];

export const SearchModal = ({ visible, onClose, navigation, onSelectMovie }) => {
  const { themeMode, accentColor, fontSizeScale } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Tất cả');
  const [allMovies, setAllMovies] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load all live synced movies when search modal opens
  useEffect(() => {
    if (visible) {
      setLoading(true);
      ApiService.getAllMovies().then(movies => {
        setAllMovies(movies || []);
        setSuggestions(movies || []);
        setLoading(false);
      });
    } else {
      setQuery('');
      setSelectedGenre('Tất cả');
    }
  }, [visible]);

  // Live filter on search query and genre
  useEffect(() => {
    if (!allMovies || allMovies.length === 0) return;

    let list = [...allMovies];

    if (query.trim().length > 0) {
      const q = query.toLowerCase().trim();
      list = list.filter((m) =>
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.originalTitle && m.originalTitle.toLowerCase().includes(q)) ||
        (m.country && m.country.toLowerCase().includes(q)) ||
        (m.director && m.director.toLowerCase().includes(q)) ||
        (Array.isArray(m.genres) && m.genres.some(g => g.toLowerCase().includes(q))) ||
        (Array.isArray(m.cast) && m.cast.some(c => c.name && c.name.toLowerCase().includes(q)))
      );
    }

    if (selectedGenre !== 'Tất cả') {
      const gKeyword = selectedGenre.toLowerCase();
      list = list.filter(m =>
        (m.country && m.country.toLowerCase().includes(gKeyword)) ||
        (m.categoryTag && m.categoryTag.toLowerCase().includes(gKeyword)) ||
        (Array.isArray(m.genres) && m.genres.some(g => g.toLowerCase().includes(gKeyword)))
      );
    }

    setSuggestions(list);
  }, [query, selectedGenre, allMovies]);

  const handleMovieClick = (movie) => {
    onClose();
    if (onSelectMovie) {
      onSelectMovie(movie);
    } else if (navigation) {
      navigation.navigate('Detail', { movie });
    }
  };

  // Extract popular movie search tags from live dataset
  const popularTags = allMovies.slice(0, 6).map(m => m.title);

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <StatusBar barStyle="light-content" />
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Top Search Input */}
          <View style={styles.header}>
            <View style={[styles.searchBox, { backgroundColor: '#1C1C1E', borderColor: 'rgba(255, 255, 255, 0.1)' }]}>
              <Ionicons name="search" size={18} color="#8E8E93" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                placeholder="Tìm phim, đạo diễn, diễn viên, quốc gia..."
                placeholderTextColor="#636366"
                value={query}
                onChangeText={setQuery}
                autoFocus={true}
                returnKeyType="search"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#8E8E93" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Categories Filter */}
          <View style={styles.genreContainer}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={GENRES}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.genreList}
              renderItem={({ item }) => {
                const isSelected = selectedGenre === item;
                return (
                  <TouchableOpacity
                    style={[styles.genrePill, isSelected && { backgroundColor: accentColor }]}
                    onPress={() => setSelectedGenre(item)}
                  >
                    <Text style={[styles.genreText, isSelected && styles.genreTextActive]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {/* Popular searches suggestions from Live Web Source */}
          {query.trim().length === 0 && popularTags.length > 0 && (
            <View style={styles.popularSection}>
              <Text style={styles.sectionTitle}>Tìm kiếm thịnh hành (Live Web)</Text>
              <View style={styles.popularWrap}>
                {popularTags.map((kw, i) => (
                  <TouchableOpacity key={i} style={styles.popularTag} onPress={() => setQuery(kw)}>
                    <Text style={styles.popularTagText} numberOfLines={1}>{kw}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Results List */}
          <Text style={styles.listHeading}>
            {query.trim().length > 0 ? `Kết quả tìm kiếm (${suggestions.length})` : `Tất cả phim (${suggestions.length})`}
          </Text>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={accentColor} />
              <Text style={styles.loadingText}>Đang đồng bộ kho phim...</Text>
            </View>
          ) : (
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const posterUri = item.posterUrl || item.poster || item.backdropUrl;
                return (
                  <TouchableOpacity
                    style={styles.itemRow}
                    activeOpacity={0.8}
                    onPress={() => handleMovieClick(item)}
                  >
                    <Image source={{ uri: posterUri }} style={styles.thumb} resizeMode="cover" />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                      <Text style={styles.itemMeta}>
                        ⭐ {item.rating || '8.5'} • {item.releaseYear || item.year || '2025'} • {item.duration || '115 phút'}
                      </Text>
                      <Text style={styles.itemGenres} numberOfLines={1}>
                        {item.country || 'Điện ảnh'} • {Array.isArray(item.genres) ? item.genres.join(', ') : 'Chiếu Rạp'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#636366" />
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>Không tìm thấy phim phù hợp</Text>
                  <Text style={styles.emptySub}>Thử tìm kiếm với từ khóa khác như "Mai", "Lật Mặt", "Hàn Quốc"...</Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    paddingTop: 48
  },
  container: {
    flex: 1,
    paddingHorizontal: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500'
  },
  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4
  },
  cancelText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600'
  },
  genreContainer: {
    marginBottom: 14
  },
  genreList: {
    gap: 8
  },
  genrePill: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  genreText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600'
  },
  genreTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  popularSection: {
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)'
  },
  sectionTitle: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10
  },
  popularWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  popularTag: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    maxWidth: '48%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  popularTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500'
  },
  listHeading: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10
  },
  listContent: {
    paddingBottom: 40
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)'
  },
  thumb: {
    width: 48,
    height: 70,
    borderRadius: 6,
    backgroundColor: '#1C1C1E'
  },
  itemInfo: {
    flex: 1,
    marginLeft: 14
  },
  itemTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  itemMeta: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 3
  },
  itemGenres: {
    color: '#636366',
    fontSize: 11,
    marginTop: 2
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12
  },
  loadingText: {
    color: '#8E8E93',
    fontSize: 13
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 80,
    gap: 6
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600'
  },
  emptySub: {
    color: '#8E8E93',
    fontSize: 12
  }
});