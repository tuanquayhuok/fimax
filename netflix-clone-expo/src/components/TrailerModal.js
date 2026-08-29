import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

export const TrailerModal = ({ visible, movie, onClose }) => {
  if (!movie) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.playerCard}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>Trailer: {movie.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.videoBox}>
            <Video
              source={{ uri: movie.trailerUrl || movie.videoSources?.['720p'] }}
              rate={1.0}
              volume={1.0}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={visible}
              useNativeControls
              style={styles.video}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  playerCard: { width: '100%', backgroundColor: Colors.card, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#111' },
  title: { color: Colors.white, fontSize: 15, fontWeight: 'bold', flex: 1 },
  videoBox: { width: '100%', height: 240, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' }
});