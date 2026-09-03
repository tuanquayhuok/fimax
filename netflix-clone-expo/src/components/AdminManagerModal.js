import React, { useState, useContext } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, FlatList, Alert, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { getThemeColors } from '../theme/colors';
import { ApiService } from '../services/apiService';

export const AdminManagerModal = ({ visible, onClose }) => {
  const { themeMode, accentColor, fontSizeScale, user, setUser } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  // Security Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'movies' | 'giftcodes' | 'broadcast'

  // Mock Persistent User List for Master Admin
  const [usersList, setUsersList] = useState([
    {
      id: 'usr_001',
      name: 'Nguyễn Thành Nam',
      email: 'nam.nguyen2026@gmail.com',
      phone: '0901234567',
      registeredAt: '03/09/2026',
      plan: 'Gói VIP 6 Tháng',
      isVip: true,
      vipExpire: '02/03/2027',
      isBanned: false
    },
    {
      id: 'usr_002',
      name: 'Trần Minh Anh',
      email: 'minhanh.cinema@gmail.com',
      phone: '0988776655',
      registeredAt: '02/09/2026',
      plan: 'Thành viên Tiêu chuẩn',
      isVip: false,
      vipExpire: 'Hết hạn',
      isBanned: false
    },
    {
      id: 'usr_003',
      name: 'Lê Hoàng Long',
      email: 'long.le@fimax.vn',
      phone: '0912348899',
      registeredAt: '01/09/2026',
      plan: 'Gói VIP 1 Năm',
      isVip: true,
      vipExpire: '01/09/2027',
      isBanned: false
    }
  ]);

  // Giftcodes List
  const [giftcodes, setGiftcodes] = useState([
    { code: 'FIMAXVIP', days: 30, usesLeft: 99, status: 'Hoạt động' },
    { code: 'CINEMA2026', days: 180, usesLeft: 45, status: 'Hoạt động' },
    { code: 'VIP4K', days: 365, usesLeft: 12, status: 'Hoạt động' }
  ]);
  const [newCodeName, setNewCodeName] = useState('');
  const [newCodeDays, setNewCodeDays] = useState('30');

  // Broadcast Message
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);

  const handleAdminLogin = () => {
    // Master PIN: 8888 or 123456
    if (adminPinInput === '8888' || adminPinInput === '123456' || adminPinInput.toLowerCase() === 'admin') {
      setIsAdminAuthenticated(true);
      setAdminPinInput('');
    } else {
      Alert.alert('Sai Mã PIN', 'Mã PIN Quản Trị Viên không đúng. Vui lòng nhập mã PIN bảo mật.');
    }
  };

  const handleToggleVip = (userId) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextVip = !u.isVip;
        return {
          ...u,
          isVip: nextVip,
          plan: nextVip ? 'Gói VIP (Cấp bởi Admin)' : 'Thành viên Tiêu chuẩn',
          vipExpire: nextVip ? 'Vĩnh viễn' : 'Hết hạn'
        };
      }
      return u;
    }));
    Alert.alert('Thành công', 'Đã cập nhật trạng thái VIP của người dùng!');
  };

  const handleToggleBan = (userId, currentName) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextBan = !u.isBanned;
        Alert.alert('Thông báo', nextBan ? `Đã KHÓA tài khoản ${currentName}!` : `Đã MỞ KHÓA tài khoản ${currentName}!`);
        return { ...u, isBanned: nextBan };
      }
      return u;
    }));
  };

  const handleDeleteUser = (userId, currentName) => {
    Alert.alert(
      'Xóa người dùng',
      `Bạn có chắc chắn muốn xóa hoàn toàn tài khoản "${currentName}" khỏi hệ thống?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setUsersList(prev => prev.filter(u => u.id !== userId));
            Alert.alert('Đã xóa', 'Đã xóa tài khoản người dùng thành công.');
          }
        }
      ]
    );
  };

  const handleCreateGiftcode = () => {
    if (!newCodeName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên mã Giftcode.');
      return;
    }
    const days = parseInt(newCodeDays) || 30;
    setGiftcodes(prev => [
      { code: newCodeName.trim().toUpperCase(), days, usesLeft: 100, status: 'Hoạt động' },
      ...prev
    ]);
    setNewCodeName('');
    Alert.alert('Thành công', `Đã tạo mã Giftcode "${newCodeName.trim().toUpperCase()}" (+${days} ngày VIP) thành công!`);
  };

  const handleSendBroadcast = () => {
    if (!broadcastTitle || !broadcastContent) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tiêu đề và nội dung thông báo.');
      return;
    }
    Alert.alert('Đã gửi thông báo', `Đã gửi thông báo "${broadcastTitle}" đến toàn bộ ${usersList.length} người dùng ứng dụng!`);
    setBroadcastTitle('');
    setBroadcastContent('');
  };

  const handleSyncWebSource = async () => {
    setIsSyncing(true);
    try {
      await ApiService.getAllMovies(undefined, true);
      Alert.alert('Thành công', 'Đã đồng bộ thành công toàn bộ phim chiếu rạp mới nhất từ fimax.aecongnghe.online!');
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể đồng bộ web lúc này.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: '#141416', borderColor: 'rgba(255, 255, 255, 0.12)' }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.adminShieldCircle}>
                <Ionicons name="shield-checkmark" size={20} color="#D4AF37" />
              </View>
              <View>
                <Text style={styles.headerTitle}>FIMAX ADMIN MASTER</Text>
                <Text style={styles.headerSub}>Trung tâm quản trị người dùng & nội dung</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {!isAdminAuthenticated ? (
            /* PIN Protection Screen */
            <View style={styles.pinLockContainer}>
              <Ionicons name="lock-closed" size={48} color="#D4AF37" />
              <Text style={styles.pinTitle}>Xác Thực Quyền Quản Trị Viên</Text>
              <Text style={styles.pinSub}>Vui lòng nhập Mã PIN Quản Trị Master (Mặc định: 8888):</Text>
              
              <TextInput
                style={styles.pinInput}
                placeholder="Nhập mã PIN"
                placeholderTextColor="#636366"
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
                value={adminPinInput}
                onChangeText={setAdminPinInput}
              />

              <TouchableOpacity style={styles.pinSubmitBtn} onPress={handleAdminLogin}>
                <Text style={styles.pinSubmitText}>MỞ KHÓA ADMIN</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Admin Master Dashboard */
            <View style={styles.dashboardContainer}>
              {/* Tab Switcher */}
              <View style={styles.navRow}>
                <TouchableOpacity
                  style={[styles.navBtn, activeTab === 'users' && styles.navBtnActive]}
                  onPress={() => setActiveTab('users')}
                >
                  <Ionicons name="people" size={16} color={activeTab === 'users' ? '#FFFFFF' : '#8E8E93'} />
                  <Text style={[styles.navBtnText, activeTab === 'users' && styles.navBtnTextActive]}>
                    Users ({usersList.length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.navBtn, activeTab === 'movies' && styles.navBtnActive]}
                  onPress={() => setActiveTab('movies')}
                >
                  <Ionicons name="film" size={16} color={activeTab === 'movies' ? '#FFFFFF' : '#8E8E93'} />
                  <Text style={[styles.navBtnText, activeTab === 'movies' && styles.navBtnTextActive]}>Kho Phim</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.navBtn, activeTab === 'giftcodes' && styles.navBtnActive]}
                  onPress={() => setActiveTab('giftcodes')}
                >
                  <Ionicons name="gift" size={16} color={activeTab === 'giftcodes' ? '#FFFFFF' : '#8E8E93'} />
                  <Text style={[styles.navBtnText, activeTab === 'giftcodes' && styles.navBtnTextActive]}>Giftcode</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.navBtn, activeTab === 'broadcast' && styles.navBtnActive]}
                  onPress={() => setActiveTab('broadcast')}
                >
                  <Ionicons name="megaphone" size={16} color={activeTab === 'broadcast' ? '#FFFFFF' : '#8E8E93'} />
                  <Text style={[styles.navBtnText, activeTab === 'broadcast' && styles.navBtnTextActive]}>Thông Báo</Text>
                </TouchableOpacity>
              </View>

              {/* Tab 1: User Management */}
              {activeTab === 'users' && (
                <View style={styles.tabContent}>
                  <Text style={styles.sectionHeader}>DANH SÁCH TÀI KHOẢN NGƯỜI DÙNG</Text>
                  <FlatList
                    data={usersList}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
                    renderItem={({ item }) => (
                      <View style={[styles.userCard, item.isBanned && styles.userCardBanned]}>
                        <View style={styles.userTop}>
                          <View style={styles.userAvatarCircle}>
                            <Text style={styles.userAvatarLetter}>{item.name.charAt(0)}</Text>
                          </View>
                          <View style={styles.userInfo}>
                            <Text style={styles.userName}>{item.name}</Text>
                            <Text style={styles.userEmail}>{item.email} • {item.phone}</Text>
                            <View style={styles.userBadgeRow}>
                              <View style={[styles.planBadge, { backgroundColor: item.isVip ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.1)' }]}>
                                <Text style={[styles.planBadgeText, { color: item.isVip ? '#D4AF37' : '#8E8E93' }]}>
                                  {item.plan} ({item.vipExpire})
                                </Text>
                              </View>
                              {item.isBanned && (
                                <View style={styles.bannedBadge}>
                                  <Text style={styles.bannedText}>ĐANG BỊ KHÓA</Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>

                        {/* Admin Action Buttons */}
                        <View style={styles.userActionRow}>
                          <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: item.isVip ? '#333' : '#D4AF37' }]}
                            onPress={() => handleToggleVip(item.id)}
                          >
                            <Ionicons name="sparkles" size={12} color={item.isVip ? '#FFF' : '#000'} />
                            <Text style={[styles.actionBtnText, { color: item.isVip ? '#FFF' : '#000' }]}>
                              {item.isVip ? 'Hạ VIP' : 'Cấp VIP'}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: item.isBanned ? '#30D158' : '#FF453A' }]}
                            onPress={() => handleToggleBan(item.id, item.name)}
                          >
                            <Ionicons name={item.isBanned ? "lock-open" : "ban"} size={12} color="#FFF" />
                            <Text style={styles.actionBtnText}>
                              {item.isBanned ? 'Mở Khóa' : 'Khóa'}
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.actionBtn, { backgroundColor: '#2C2C2E' }]}
                            onPress={() => handleDeleteUser(item.id, item.name)}
                          >
                            <Ionicons name="trash-outline" size={12} color="#FF453A" />
                            <Text style={[styles.actionBtnText, { color: '#FF453A' }]}>Xóa</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  />
                </View>
              )}

              {/* Tab 2: Movie Management & Web Sync */}
              {activeTab === 'movies' && (
                <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
                  <Text style={styles.sectionHeader}>ĐỒNG BỘ NGUỒN PHIM TỪ WEB</Text>
                  
                  <View style={styles.syncCard}>
                    <Text style={styles.syncTitle}>Nguồn Web Hiện Tại:</Text>
                    <Text style={styles.syncUrl}>http://fimax.aecongnghe.online/ (40+ Phim)</Text>
                    <Text style={styles.syncDesc}>
                      Hệ thống tự động đồng bộ video M3U8, poster và phân loại danh mục (Việt Nam, Chiếu Rạp, Hàn Quốc, Mới nhất).
                    </Text>

                    <TouchableOpacity
                      style={[styles.syncBtn, isSyncing && { opacity: 0.6 }]}
                      disabled={isSyncing}
                      onPress={handleSyncWebSource}
                    >
                      <Ionicons name="cloud-download-outline" size={18} color="#FFFFFF" />
                      <Text style={styles.syncBtnText}>
                        {isSyncing ? 'Đang Đồng Bộ Dữ Liệu...' : 'ĐỒNG BỘ LẠI TOÀN BỘ PHIM NGAY'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}

              {/* Tab 3: Giftcodes Generator */}
              {activeTab === 'giftcodes' && (
                <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
                  <Text style={styles.sectionHeader}>TẠO MÃ GIFTCODE VIP MỚI</Text>
                  <View style={styles.createGiftcodeBox}>
                    <TextInput
                      style={styles.adminInput}
                      placeholder="Tên mã (VD: TET2026, VIP1THANG)"
                      placeholderTextColor="#636366"
                      autoCapitalize="characters"
                      value={newCodeName}
                      onChangeText={setNewCodeName}
                    />
                    <TextInput
                      style={styles.adminInput}
                      placeholder="Số ngày VIP (VD: 30, 180, 365)"
                      placeholderTextColor="#636366"
                      keyboardType="numeric"
                      value={newCodeDays}
                      onChangeText={setNewCodeDays}
                    />
                    <TouchableOpacity style={styles.createCodeBtn} onPress={handleCreateGiftcode}>
                      <Ionicons name="add" size={18} color="#FFFFFF" />
                      <Text style={styles.createCodeText}>TẠO MÃ GIFTCODE</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.sectionHeader, { marginTop: 16 }]}>DANH SÁCH MÃ QUÀ TẶNG ĐANG HOẠT ĐỘNG</Text>
                  {giftcodes.map((g, idx) => (
                    <View key={idx} style={styles.giftcodeItem}>
                      <View>
                        <Text style={styles.codeText}>{g.code}</Text>
                        <Text style={styles.codeSub}>+{g.days} Ngày VIP • Còn {g.usesLeft} lượt</Text>
                      </View>
                      <View style={styles.codeStatusBadge}>
                        <Text style={styles.codeStatusText}>{g.status}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}

              {/* Tab 4: Broadcast Push Notifications */}
              {activeTab === 'broadcast' && (
                <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
                  <Text style={styles.sectionHeader}>GỬI THÔNG BÁO ĐẾN TOÀN BỘ NGƯỜI DÙNG</Text>
                  <View style={styles.broadcastBox}>
                    <Text style={styles.inputLabel}>TIÊU ĐỀ THÔNG BÁO</Text>
                    <TextInput
                      style={styles.adminInput}
                      placeholder="VD: Cập nhật bom tấn Lật Mặt 7 bản 4K!"
                      placeholderTextColor="#636366"
                      value={broadcastTitle}
                      onChangeText={setBroadcastTitle}
                    />

                    <Text style={[styles.inputLabel, { marginTop: 10 }]}>NỘI DUNG THÔNG BÁO</Text>
                    <TextInput
                      style={[styles.adminInput, { height: 90, textAlignVertical: 'top' }]}
                      placeholder="Nhập nội dung chi tiết gửi đến toàn bộ app..."
                      placeholderTextColor="#636366"
                      multiline
                      value={broadcastContent}
                      onChangeText={setBroadcastContent}
                    />

                    <TouchableOpacity style={styles.sendBroadcastBtn} onPress={handleSendBroadcast}>
                      <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
                      <Text style={styles.sendBroadcastText}>PHÁT THÔNG BÁO TOÀN HỆ THỐNG</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  card: {
    width: '100%',
    maxWidth: 390,
    height: '84%',
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 14,
    marginBottom: 12
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  adminShieldCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    color: '#D4AF37',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  headerSub: {
    color: '#8E8E93',
    fontSize: 10
  },
  closeBtn: {
    padding: 4
  },
  pinLockContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 12
  },
  pinTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8
  },
  pinSub: {
    color: '#8E8E93',
    fontSize: 12,
    textAlign: 'center'
  },
  pinInput: {
    width: 200,
    backgroundColor: '#1E1E22',
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    letterSpacing: 8,
    borderWidth: 1,
    borderColor: '#D4AF37',
    marginTop: 8
  },
  pinSubmitBtn: {
    backgroundColor: '#E50914',
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 10
  },
  pinSubmitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  dashboardContainer: {
    flex: 1
  },
  navRow: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 3,
    marginBottom: 12,
    gap: 4
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4
  },
  navBtnActive: {
    backgroundColor: '#E50914'
  },
  navBtnText: {
    color: '#8E8E93',
    fontSize: 11,
    fontWeight: '600'
  },
  navBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  tabContent: {
    flex: 1
  },
  sectionHeader: {
    color: '#8E8E93',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10
  },
  userCard: {
    backgroundColor: '#1E1E22',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  userCardBanned: {
    borderColor: '#FF453A',
    backgroundColor: 'rgba(255, 69, 58, 0.08)'
  },
  userTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  userAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center'
  },
  userAvatarLetter: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16
  },
  userInfo: {
    flex: 1
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  userEmail: {
    color: '#8E8E93',
    fontSize: 11,
    marginTop: 1
  },
  userBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4
  },
  planBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  planBadgeText: {
    fontSize: 9,
    fontWeight: '700'
  },
  bannedBadge: {
    backgroundColor: '#FF453A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  bannedText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900'
  },
  userActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)'
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  syncCard: {
    backgroundColor: '#1E1E22',
    borderRadius: 14,
    padding: 14,
    gap: 8
  },
  syncTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  syncUrl: {
    color: '#30D158',
    fontSize: 11,
    fontWeight: '600'
  },
  syncDesc: {
    color: '#8E8E93',
    fontSize: 11,
    lineHeight: 16
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E50914',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    marginTop: 6
  },
  syncBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  createGiftcodeBox: {
    backgroundColor: '#1E1E22',
    borderRadius: 12,
    padding: 12,
    gap: 8
  },
  adminInput: {
    backgroundColor: '#121214',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  createCodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D4AF37',
    paddingVertical: 11,
    borderRadius: 8,
    gap: 4
  },
  createCodeText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800'
  },
  giftcodeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E22',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8
  },
  codeText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1
  },
  codeSub: {
    color: '#8E8E93',
    fontSize: 11,
    marginTop: 2
  },
  codeStatusBadge: {
    backgroundColor: 'rgba(48, 209, 88, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  codeStatusText: {
    color: '#30D158',
    fontSize: 10,
    fontWeight: '700'
  },
  broadcastBox: {
    backgroundColor: '#1E1E22',
    borderRadius: 12,
    padding: 14,
    gap: 6
  },
  inputLabel: {
    color: '#8E8E93',
    fontSize: 10,
    fontWeight: '700'
  },
  sendBroadcastBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E50914',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    marginTop: 8
  },
  sendBroadcastText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  }
});