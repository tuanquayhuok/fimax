import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

export const RatingModal = ({ visible, movie, onClose }) => {
  const [rating, setRating] = useState(9);
  const [review, setReview] = useState('');
  if (!movie) return null;

  const handleSubmit = () => {
    Alert.alert('Cảm ơn bạn!', `Bạn đã đánh giá ${rating}/10 cho phim ${movie.title}`);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Đánh Giá Phim</Text>
          <Text style={styles.movieName}>{movie.title}</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons name={star <= rating ? "star" : "star-outline"} size={24} color={star <= rating ? Colors.gold : '#555'} />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.scoreText}>{rating} / 10 Điểm</Text>
          <TextInput
            style={styles.input}
            placeholder="Viết cảm nhận của bạn về phim..."
            placeholderTextColor="#777"
            multiline
            numberOfLines={3}
            value={review}
            onChangeText={setReview}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Đóng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Gửi Đánh Giá</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  dialog: { backgroundColor: Colors.card, borderRadius: 16, padding: 20, width: '100%', maxWidth: 380, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.white },
  movieName: { fontSize: 15, color: Colors.primary, marginTop: 4, marginBottom: 16, fontWeight: '600' },
  starRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 4, marginBottom: 8 },
  scoreText: { fontSize: 16, fontWeight: 'bold', color: Colors.gold, marginBottom: 16 },
  input: { width: '100%', backgroundColor: '#111', color: '#fff', borderRadius: 8, padding: 12, height: 80, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  buttonRow: { flexDirection: 'row', gap: 10, width: '100%' },
  cancelBtn: { flex: 1, backgroundColor: '#333', paddingVertical: 11, borderRadius: 8, alignItems: 'center' },
  cancelBtnText: { color: Colors.white, fontWeight: '600' },
  submitBtn: { flex: 1.5, backgroundColor: Colors.primary, paddingVertical: 11, borderRadius: 8, alignItems: 'center' },
  submitBtnText: { color: Colors.white, fontWeight: 'bold' }
});