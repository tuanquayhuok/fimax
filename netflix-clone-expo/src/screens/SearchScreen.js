import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ApiService } from '../services/apiService';
import { FilterModal } from '../components/FilterModal';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/colors';

export const SearchScreen = ({ navigation, route }) => {
  const { apiUrl } = useContext(AppContext);
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    country: route?.params?.initialCountry || '',
    year: '',
    minRating: '',
    sort: 'latest'
  });

  const searchMovies = async () => {
    setLoading(true);
    const results = await ApiService.fetchMovies(apiUrl, { q: query, ...filters });
    setMovies(results);
    setLoading(false);
  };

  useEffect(() => {
    searchMovies();
  }, [query, filters, apiUrl]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên phim, diễn viên, đạo diễn..."
            placeholderTextColor="#777"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilterModal(true)}>
          <Ionicons name="options-outline" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {(filters.genre || filters.country || filters.year || filters.minRating) && (
        <View style={styles.activeFiltersRow}>
          <Text style={styles.filterLabel}>Đang lọc:</Text>
          {filters.genre ? <Text style={styles.activeBadge}>{filters.genre}</Text> : null}
          {filters.country ? <Text style={styles.activeBadge}>{filters.country}</Text> : null}
          {filters.year ? <Text style={styles.activeBadge}>Năm {filters.year}</Text> : null}
          {filters.minRating ? <Text style={styles.activeBadge}>⭐ {filters.minRating}+</Text> : null}
          <TouchableOpacity onPress={() => setFilters({ genre: '', country: '', year: '', minRating: '', sort: 'latest' })}>
            <Text style={styles.clearBadge}>Xóa lọc</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.gridCard} activeOpacity={0.7} onPress={() => navigation.navigate('Detail', { movie: item })}>
            <Image source={{ uri: item.posterUrl }} style={styles.poster} resizeMode="cover" />
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ {item.rating}</Text>
            </View>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      <FilterModal
        visible={showFilterModal}
        filters={filters}
        onClose={() => setShowFilterModal(false)}
        onApply={(newFilters) => setFilters(newFilters)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingTop: 48 },
  searchBarContainer: { flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center', gap: 10, marginBottom: 10 },
  inputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#222', borderRadius: 8, paddingHorizontal: 12, height: 44, borderWidth: 1, borderColor: '#333' },
  searchInput: { flex: 1, color: '#fff', fontSize: 14 },
  filterBtn: { backgroundColor: Colors.card, width: 44, height: 44, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  activeFiltersRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, alignItems: 'center', gap: 6, marginBottom: 10 },
  filterLabel: { color: Colors.textSecondary, fontSize: 12 },
  activeBadge: { backgroundColor: Colors.primary, color: '#fff', fontSize: 11, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, fontWeight: 'bold' },
  clearBadge: { color: '#ff5555', fontSize: 11, marginLeft: 4, textDecorationLine: 'underline' },
  gridContent: { paddingHorizontal: 10, paddingBottom: 80 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 12 },
  gridCard: { width: '31%', position: 'relative' },
  poster: { width: '100%', height: 160, borderRadius: 6, backgroundColor: Colors.card },
  ratingBadge: { position: 'absolute', top: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
  ratingText: { color: Colors.gold, fontSize: 10, fontWeight: 'bold' },
  title: { color: '#fff', fontSize: 12, marginTop: 4, fontWeight: '500' }
});