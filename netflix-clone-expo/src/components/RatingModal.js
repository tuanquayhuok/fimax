import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';

export const RatingModal = ({
  visible,
  movie,
  movieTitle,
  onClose,
  onRateSubmit
}) => {
  const { themeMode, accentColor, showNotificationPopup } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const targetTitle = movie?.title || movieTitle || 'Bộ phim';

  if (!visible) return null;

  const getScoreText = (val) => {
    switch (val) {
      case 5:
        return 'Tuyệt vời';
      case 4:
        return 'Rất hay';
      case 3:
        return 'Bình thường';
      case 2:
        return 'Chưa hay';
      case 1:
        return 'Rất tệ';
      default:
        return '';
    }
  };

  const handleSubmit = () => {
    if (onRateSubmit) {
      onRateSubmit(rating);
    }

    Alert.alert(
      'Đánh giá thành công',
      `Bạn đã đánh giá ${rating}/5 sao cho phim "${targetTitle}".`,
      [{ text: 'Xong', onPress: onClose }]
    );

    showNotificationPopup(
      'Đã gửi đánh giá',
      `Bạn đã đánh giá ${rating}/5 sao cho "${targetTitle}".`,
      movie,
      'movie'
    );
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: theme.isLight ? '#FFFFFF' : '#1A1A1E', borderColor: theme.border }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Đánh giá phim</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.movieName, { color: theme.textSecondary }]} numberOfLines={1}>
            {targetTitle}
          </Text>

          {/* 5 Clean Vector Stars */}
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => {
              const isActive = star <= rating;
              return (
                <TouchableOpacity
                  key={star}
                  style={styles.starTouch}
                  activeOpacity={0.8}
                  onPress={() => setRating(star)}
                >
                  <Ionicons
                    name={isActive ? 'star' : 'star-outline'}
                    size={32}
                    color={isActive ? '#FFB800' : (theme.isLight ? '#D1D1D6' : '#3A3A3C')}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.scoreText, { color: '#FFB800' }]}>
            {rating}/5 • {getScoreText(rating)}
          </Text>

          {/* Review Input */}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.isLight ? '#F2F2F7' : '#24242A',
                color: theme.textPrimary,
                borderColor: theme.border
              }
            ]}
            placeholder="Viết nhận xét của bạn về phim (tùy chọn)..."
            placeholderTextColor={theme.textMuted}
            multiline
            numberOfLines={3}
            value={review}
            onChangeText={setReview}
          />

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.cancelBtn, { backgroundColor: theme.surfaceSecondary }]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: accentColor }]}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.submitBtnText}>Gửi đánh giá</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  dialog: {
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  title: {
    fontSize: 17,
    fontWeight: '700'
  },
  closeBtn: {
    padding: 2
  },
  movieName: {
    fontSize: 13,
    marginBottom: 18
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8
  },
  starTouch: {
    padding: 2
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16
  },
  input: {
    width: '100%',
    borderRadius: 10,
    padding: 12,
    height: 72,
    marginBottom: 18,
    borderWidth: 1,
    fontSize: 13,
    textAlignVertical: 'top'
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%'
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600'
  },
  submitBtn: {
    flex: 1.5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  }
});
