import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { GENRES, COUNTRIES } from '../data/mockMovies';

const YEARS = ['Tất cả', '2026', '2025', '2024', '2023', '2022', '2020'];
const RATINGS = [
  { label: 'Tất cả điểm', value: '' },
  { label: '⭐ 9.0+ Xuất sắc', value: '9.0' },
  { label: '⭐ 8.0+ Rất hay', value: '8.0' },
  { label: '⭐ 7.0+ Khá hay', value: '7.0' }
];
const SORTS = [
  { label: 'Mới nhất', value: 'latest' },
  { label: 'Xem nhiều nhất', value: 'views' },
  { label: 'Đánh giá cao nhất', value: 'rating' }
];

export const FilterModal = ({ visible, onClose, filters, onApply }) => {
  const [selectedGenre, setSelectedGenre] = useState(filters.genre || 'Tất cả');
  const [selectedCountry, setSelectedCountry] = useState(filters.country || 'Tất cả');
  const [selectedYear, setSelectedYear] = useState(filters.year || 'Tất cả');
  const [selectedRating, setSelectedRating] = useState(filters.minRating || '');
  const [selectedSort, setSelectedSort] = useState(filters.sort || 'latest');

  const handleApply = () => {
    onApply({
      genre: selectedGenre === 'Tất cả' ? '' : selectedGenre,
      country: selectedCountry === 'Tất cả' ? '' : selectedCountry,
      year: selectedYear === 'Tất cả' ? '' : selectedYear,
      minRating: selectedRating,
      sort: selectedSort
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Bộ Lọc Phim Đa Tiêu Chí</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Sắp xếp theo</Text>
            <View style={styles.chipRow}>
              {SORTS.map(s => (
                <TouchableOpacity key={s.value} style={[styles.chip, selectedSort === s.value && styles.chipActive]} onPress={() => setSelectedSort(s.value)}>
                  <Text style={[styles.chipText, selectedSort === s.value && styles.chipTextActive]}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.sectionTitle}>Thể loại</Text>
            <View style={styles.chipRow}>
              {GENRES.map(g => (
                <TouchableOpacity key={g} style={[styles.chip, selectedGenre === g && styles.chipActive]} onPress={() => setSelectedGenre(g)}>
                  <Text style={[styles.chipText, selectedGenre === g && styles.chipTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.sectionTitle}>Quốc gia</Text>
            <View style={styles.chipRow}>
              {COUNTRIES.map(c => (
                <TouchableOpacity key={c} style={[styles.chip, selectedCountry === c && styles.chipActive]} onPress={() => setSelectedCountry(c)}>
                  <Text style={[styles.chipText, selectedCountry === c && styles.chipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.sectionTitle}>Năm phát hành</Text>
            <View style={styles.chipRow}>
              {YEARS.map(y => (
                <TouchableOpacity key={y} style={[styles.chip, selectedYear === y && styles.chipActive]} onPress={() => setSelectedYear(y)}>
                  <Text style={[styles.chipText, selectedYear === y && styles.chipTextActive]}>{y}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.sectionTitle}>Điểm đánh giá</Text>
            <View style={styles.chipRow}>
              {RATINGS.map(r => (
                <TouchableOpacity key={r.value} style={[styles.chip, selectedRating === r.value && styles.chipActive]} onPress={() => setSelectedRating(r.value)}>
                  <Text style={[styles.chipText, selectedRating === r.value && styles.chipTextActive]}>{r.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={() => { setSelectedGenre('Tất cả'); setSelectedCountry('Tất cả'); setSelectedYear('Tất cả'); setSelectedRating(''); setSelectedSort('latest'); }}>
              <Text style={styles.resetButtonText}>Đặt lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Áp dụng bộ lọc</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%', paddingBottom: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: Colors.white },
  body: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.textSecondary, marginTop: 12, marginBottom: 8, textTransform: 'uppercase' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: '#2b2b2b', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: '#3a3a3a' },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { color: Colors.textSecondary, fontSize: 13 },
  chipTextActive: { color: Colors.white, fontWeight: 'bold' },
  footer: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 12, gap: 12 },
  resetButton: { flex: 1, backgroundColor: '#333', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  resetButtonText: { color: Colors.white, fontWeight: '600' },
  applyButton: { flex: 2, backgroundColor: Colors.primary, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  applyButtonText: { color: Colors.white, fontWeight: 'bold' }
});