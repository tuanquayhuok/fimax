import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, FlatList, Image, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { MOCK_MOVIES, GENRES } from '../data/mockMovies';

const POPULAR_SEARCHES = ['Mai', 'Lật Mặt 7', 'Cyberpunk', 'Ký Sinh Trùng', 'Suzume', 'Christopher Nolan'];

export const SearchModal = ({ visible, onClose, onSelectMovie }) => {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Tất cả');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!visible) {
      setQuery('');
      setSuggestions([]);
      return;
    }
  }, [visible]);

  useEffect(() => {
    let list = [...MOCK_MOVIES];

    if (query.trim().length > 0) {
      const q = query.toLowerCase().trim();
      list = list.filter((m) =>
        m.title.toLowerCase().includes(q) ||
        (m.originalTitle && m.originalTitle.toLowerCase().includes(q)) ||
        (m.director && m.director.toLowerCase().includes(q)) ||
        (m.cast && m.cast.some(c => c.name.toLowerCase().includes(q)))
      );
    }

    if (selectedGenre !== 'Tất cả') {
      list = list.filter(m => m.genres && m.genres.includes(selectedGenre));
    }

    setSuggestions(list);
  }, [query, selectedGenre]);

  const handleMovieClick = (movie) => {
    onClose();
    onSelectMovie(movie);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <StatusBar barStyle="light-content" />
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Top Search Input */}
          <View style={styles.header}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color="#8E8E93" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                placeholder="Tìm phim, đạo diễn, diễn viên..."
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

          {/* Quick Categories */}
          <View style={styles.genreContainer}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={GENRES}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.genreList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.genrePill, selectedGenre === item && styles.genrePillActive]}
                  onPress={() => setSelectedGenre(item)}
                >
                  <Text style={[styles.genreText, selectedGenre === item && styles.genreTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Popular searches suggestions */}
          {query.trim().length === 0 && (
            <View style={styles.popularSection}>
              <Text style={styles.sectionTitle}>Tìm kiếm thịnh hành</Text>
              <View style={styles.popularWrap}>
                {POPULAR_SEARCHES.map((kw, i) => (
                  <TouchableOpacity key={i} style={styles.popularTag} onPress={() => setQuery(kw)}>
                    <Text style={styles.popularTagText}>{kw}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Results List */}
          <Text style={styles.listHeading}>
            {query.trim().length > 0 ? `Kết quả tìm kiếm (${suggestions.length})` : 'Gợi ý cho bạn'}
          </Text>

          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.itemRow}
                activeOpacity={0.8}
                onPress={() => handleMovieClick(item)}
              >
                <Image source={{ uri: item.posterUrl }} style={styles.thumb} resizeMode="cover" />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.itemMeta}>{item.releaseYear} • {item.duration} • {item.country}</Text>
                  <Text style={styles.itemGenres} numberOfLines={1}>
                    {item.genres?.join(', ') || 'Điện ảnh'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#636366" />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Không tìm thấy kết quả</Text>
                <Text style={styles.emptySub}>Thử tìm kiếm với từ khóa khác như "Mai", "Nolan"...</Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.96)',
    paddingTop: 48
  },
  container: {
    flex: 1,
    paddingHorizontal: 18
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
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400'
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
    borderRadius: 18
  },
  genrePillActive: {
    backgroundColor: '#E50914'
  },
  genreText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500'
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
    fontSize: 12,
    fontWeight: '600',
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
    borderRadius: 8
  },
  popularTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500'
  },
  listHeading: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600',
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
    height: 68,
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
    fontWeight: '600'
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