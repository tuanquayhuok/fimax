import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

export const SocialAuthModal = ({ visible, provider, onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleAppleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConfirm({
        name: 'Apple User',
        email: 'user_apple@icloud.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
      });
    }, 1200);
  };

  const handleGoogleSignIn = (selectedEmail, name, avatar) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConfirm({
        name: name || 'Google User',
        email: selectedEmail,
        avatar: avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
      });
    }, 1000);
  };

  if (!provider) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        {provider === 'Apple' ? (
          // Apple ID Native Style Sheet
          <View style={styles.appleSheet}>
            <View style={styles.appleHeader}>
              <Ionicons name="logo-apple" size={28} color="#000000" />
              <Text style={styles.appleTitle}>Sign in with Apple</Text>
            </View>

            <View style={styles.appleBody}>
              <Text style={styles.applePrompt}>
                Do you want to sign in to <Text style={{ fontWeight: 'bold' }}>FIMAX Cinema</Text> with your Apple ID?
              </Text>

              <View style={styles.appleCard}>
                <View style={styles.appleRow}>
                  <Text style={styles.appleLabel}>Name</Text>
                  <Text style={styles.appleVal}>Apple User</Text>
                </View>
                <View style={styles.appleDivider} />
                <View style={styles.appleRow}>
                  <Text style={styles.appleLabel}>Email</Text>
                  <Text style={styles.appleVal}>Hide My Email (icloud.com)</Text>
                </View>
              </View>

              <View style={styles.faceIdRow}>
                <Ionicons name="scan-outline" size={24} color="#007AFF" />
                <Text style={styles.faceIdText}>Confirm with Face ID / Touch ID</Text>
              </View>

              <TouchableOpacity
                style={styles.appleConfirmBtn}
                activeOpacity={0.85}
                onPress={handleAppleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.appleConfirmText}>Continue with Apple ID</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Google OAuth Style Sheet
          <View style={styles.googleSheet}>
            <View style={styles.googleHeader}>
              <View style={styles.googleGLogo}>
                <Text style={styles.googleGText}>G</Text>
              </View>
              <Text style={styles.googleTitle}>Đăng nhập bằng Google</Text>
              <Text style={styles.googleSub}>Chọn tài khoản để tiếp tục tới FIMAX Cinema</Text>
            </View>

            <View style={styles.googleAccounts}>
              {/* Account 1 */}
              <TouchableOpacity
                style={styles.googleAccItem}
                activeOpacity={0.7}
                onPress={() => handleGoogleSignIn('nguyen.an@gmail.com', 'Nguyễn An', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80')}
              >
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80' }}
                  style={styles.accAvatar}
                />
                <View style={styles.accInfo}>
                  <Text style={styles.accName}>Nguyễn An</Text>
                  <Text style={styles.accEmail}>nguyen.an@gmail.com</Text>
                </View>
              </TouchableOpacity>

              {/* Account 2 */}
              <TouchableOpacity
                style={styles.googleAccItem}
                activeOpacity={0.7}
                onPress={() => handleGoogleSignIn('fimax.cinema.fan@gmail.com', 'FIMAX Fan', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80')}
              >
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' }}
                  style={styles.accAvatar}
                />
                <View style={styles.accInfo}>
                  <Text style={styles.accName}>FIMAX Cinema Fan</Text>
                  <Text style={styles.accEmail}>fimax.cinema.fan@gmail.com</Text>
                </View>
              </TouchableOpacity>
            </View>

            {loading && <ActivityIndicator color="#E50914" style={{ marginVertical: 12 }} />}

            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Hủy Bỏ</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end'
  },
  // Apple ID Sheet
  appleSheet: {
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 36
  },
  appleHeader: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 16
  },
  appleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000'
  },
  appleBody: {
    gap: 16
  },
  applePrompt: {
    color: '#3C3C43',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18
  },
  appleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  appleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  appleLabel: {
    color: '#8E8E93',
    fontSize: 13
  },
  appleVal: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '600'
  },
  appleDivider: {
    height: 1,
    backgroundColor: '#E5E5EA'
  },
  faceIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 6
  },
  faceIdText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '600'
  },
  appleConfirmBtn: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  appleConfirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600'
  },
  // Google Sheet
  googleSheet: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  googleHeader: {
    alignItems: 'center',
    marginBottom: 20
  },
  googleGLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  googleGText: {
    color: '#4285F4',
    fontSize: 22,
    fontWeight: '900'
  },
  googleTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700'
  },
  googleSub: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 4
  },
  googleAccounts: {
    gap: 10,
    marginBottom: 16
  },
  googleAccItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 12,
    borderRadius: 12,
    gap: 12
  },
  accAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  accInfo: {
    flex: 1
  },
  accName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  accEmail: {
    color: '#8E8E93',
    fontSize: 12
  },
  cancelBtn: {
    paddingVertical: 10,
    alignItems: 'center'
  },
  cancelText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500'
  }
});