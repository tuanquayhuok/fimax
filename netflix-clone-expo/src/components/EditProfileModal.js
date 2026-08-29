import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, ScrollView, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { Colors } from '../theme/colors';

// App's Preset Avatar Library (Cinema & Character Avatars)
const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=200&auto=format&fit=crop&q=80'
];

export const EditProfileModal = ({ visible, onClose }) => {
  const { user, setUser } = useContext(AppContext);

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '0908 123 456');
  const [email, setEmail] = useState(user?.email || '');
  const [gender, setGender] = useState(user?.gender || 'Nam'); // 'Nam' | 'Nữ' | 'Khác'
  const [birthdate, setBirthdate] = useState(user?.birthdate || '15/08/2000');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || AVATAR_PRESETS[0]);
  const [createdAt] = useState(user?.createdAt || '29/08/2026 - 15:30');
  const [memberId] = useState(user?.memberId || '#FIMAX-88921');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Họ và tên không được để trống.');
      return;
    }

    setUser(prev => ({
      ...prev,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      gender,
      birthdate,
      avatar: selectedAvatar,
      createdAt,
      memberId
    }));

    Alert.alert('Thành công', 'Đã cập nhật thông tin hồ sơ của bạn!');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Thông Tin Tài Khoản</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* 1. Avatar Picker Section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarMainWrap}>
                <Image source={{ uri: selectedAvatar }} style={styles.avatarMain} />
                <View style={styles.cameraBadge}>
                  <Ionicons name="camera" size={14} color="#FFFFFF" />
                </View>
              </View>
              <Text style={styles.avatarHint}>Chọn ảnh đại diện từ kho FIMAX:</Text>

              {/* Preset Avatars Scroll */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatarList}>
                {AVATAR_PRESETS.map((avt, idx) => {
                  const isSelected = selectedAvatar === avt;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.avatarThumbWrap, isSelected && styles.avatarThumbActive]}
                      onPress={() => setSelectedAvatar(avt)}
                    >
                      <Image source={{ uri: avt }} style={styles.avatarThumb} />
                      {isSelected && (
                        <View style={styles.selectedBadge}>
                          <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* 2. Account Registration Meta */}
            <View style={styles.metaCard}>
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Mã định danh:</Text>
                <Text style={styles.metaVal}>{memberId}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Thời gian đăng ký:</Text>
                <Text style={styles.metaVal}>{createdAt}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Xác thực OTP:</Text>
                <Text style={[styles.metaVal, { color: '#30D158' }]}>🟢 Đã xác minh</Text>
              </View>
            </View>

            {/* 3. Editable Fields */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>HỌ VÀ TÊN</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Nhập họ và tên"
                  placeholderTextColor="#636366"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>SỐ ĐIỆN THOẠI</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="0908 123 456"
                  placeholderTextColor="#636366"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMAIL ĐĂNG KÝ</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="example@fimax.vn"
                  placeholderTextColor="#636366"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Gender Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>GIỚI TÍNH</Text>
                <View style={styles.genderRow}>
                  {['Nam', 'Nữ', 'Khác'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
                      onPress={() => setGender(g)}
                    >
                      <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>NGÀY SINH</Text>
                <TextInput
                  style={styles.input}
                  value={birthdate}
                  onChangeText={setBirthdate}
                  placeholder="DD/MM/YYYY (VD: 15/08/2000)"
                  placeholderTextColor="#636366"
                />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={handleSave}>
              <Text style={styles.saveBtnText}>LƯU THAY ĐỔI</Text>
            </TouchableOpacity>

            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end'
  },
  sheet: {
    backgroundColor: '#121214',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)'
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700'
  },
  closeBtn: {
    padding: 4
  },
  body: {
    padding: 20
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20
  },
  avatarMainWrap: {
    position: 'relative',
    marginBottom: 12
  },
  avatarMain: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#E50914'
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#E50914',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#121214'
  },
  avatarHint: {
    color: '#8E8E93',
    fontSize: 12,
    marginBottom: 10
  },
  avatarList: {
    gap: 10,
    paddingHorizontal: 10
  },
  avatarThumbWrap: {
    position: 'relative',
    padding: 2,
    borderRadius: 24
  },
  avatarThumbActive: {
    borderColor: '#E50914',
    borderWidth: 2
  },
  avatarThumb: {
    width: 44,
    height: 44,
    borderRadius: 22
  },
  selectedBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#E50914',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  metaCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  metaKey: {
    color: '#8E8E93',
    fontSize: 12
  },
  metaVal: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600'
  },
  form: {
    gap: 16,
    marginBottom: 24
  },
  inputGroup: {
    gap: 6
  },
  inputLabel: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  input: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10
  },
  genderBtn: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  genderBtnActive: {
    backgroundColor: '#E50914',
    borderColor: '#E50914'
  },
  genderText: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '600'
  },
  genderTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  saveBtn: {
    backgroundColor: '#E50914',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5
  }
});