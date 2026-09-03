import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
  Image,
  Clipboard,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors } from '../theme/colors';
import { AppContext } from '../context/AppContext';

const PLANS = [
  {
    id: 'm1',
    name: 'Gói VIP 1 Tháng',
    price: 49000,
    priceFormatted: '49.000đ',
    period: '/ tháng',
    badge: null,
    features: ['Chất lượng Full HD 1080p', 'Không quảng cáo khi xem', '1 thiết bị xem đồng thời']
  },
  {
    id: 'm6',
    name: 'Gói VIP 6 Tháng',
    price: 249000,
    priceFormatted: '249.000đ',
    period: '/ 6 tháng',
    badge: 'Phổ biến nhất 🔥',
    saveText: 'Tiết kiệm 20%',
    features: ['Chất lượng 4K Ultra HD & HDR', 'Âm thanh vòm Dolby Atmos', '2 thiết bị xem đồng thời', 'Tải phim xem ngoại tuyến']
  },
  {
    id: 'm12',
    name: 'Gói VIP 12 Tháng',
    price: 449000,
    priceFormatted: '449.000đ',
    period: '/ năm',
    badge: 'Tiết kiệm nhất 💎',
    saveText: 'Tiết kiệm 35%',
    features: ['Toàn bộ đặc quyền 4K HDR', 'Xem sớm phim chiếu rạp mới', 'Không giới hạn thiết bị', 'Hỗ trợ ưu tiên VIP 24/7']
  }
];

const PAYMENT_METHODS = [
  {
    id: 'vietqr',
    name: 'Chuyển Khoản Ngân Hàng (VietQR)',
    subtitle: 'Quét mã QR 24/7 - Tự động duyệt ngay tức thì',
    icon: 'qr-code-outline',
    color: '#005BAA',
    bankInfo: {
      bankName: 'MBBank (Quân Đội)',
      accountNumber: '0908889999',
      accountName: 'FIMAX CINEMA ENTERTAINMENT',
      branch: 'Hà Nội'
    }
  },
  {
    id: 'momo',
    name: 'Ví Điện Tử MoMo',
    subtitle: 'Thanh toán siêu tốc qua ứng dụng MoMo',
    icon: 'wallet-outline',
    color: '#A50064'
  },
  {
    id: 'zalopay',
    name: 'Ví ZaloPay',
    subtitle: 'Thanh toán bảo mật liên kết Zalo',
    icon: 'card-outline',
    color: '#0088FF'
  },
  {
    id: 'apple_pay',
    name: 'Apple Pay / Thẻ Quốc Tế',
    subtitle: 'Visa, MasterCard, JCB hoặc Apple Pay',
    icon: 'logo-apple',
    color: '#FFFFFF'
  }
];

export const VipSubscriptionModal = ({ visible, onClose }) => {
  const { user, setUser, themeMode, accentColor, showNotificationPopup } = useContext(AppContext);
  const theme = getThemeColors(themeMode);

  const [step, setStep] = useState('select_plan'); // 'select_plan' | 'checkout' | 'success'
  const [selectedPlanId, setSelectedPlanId] = useState('m6');
  const [selectedPaymentId, setSelectedPaymentId] = useState('vietqr');
  const [voucherCode, setVoucherCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionCode, setTransactionCode] = useState('');

  const selectedPlan = PLANS.find(p => p.id === selectedPlanId) || PLANS[1];
  const selectedPayment = PAYMENT_METHODS.find(m => m.id === selectedPaymentId) || PAYMENT_METHODS[0];

  const rawPrice = selectedPlan.price;
  const finalPrice = Math.round(rawPrice * (1 - discountPercent / 100));
  const finalPriceFormatted = new Intl.NumberFormat('vi-VN').format(finalPrice) + 'đ';

  const handleApplyVoucher = () => {
    const code = voucherCode.trim().toUpperCase();
    if (code === 'FIMAX2026' || code === 'VIP50' || code === 'CINEMA') {
      setDiscountPercent(30);
      Alert.alert('Thành công', 'Đã áp dụng mã giảm giá 30% cho đơn hàng!');
    } else if (code) {
      Alert.alert('Không hợp lệ', 'Mã giảm giá không tồn tại hoặc đã hết hạn.');
    }
  };

  const handleGoToCheckout = () => {
    if (!user) {
      Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập tài khoản trước khi đăng ký gói VIP.');
      return;
    }
    const txn = 'FIMAX' + Math.floor(100000 + Math.random() * 900000);
    setTransactionCode(txn);
    setStep('checkout');
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const expiryDate = new Date();
      if (selectedPlan.id === 'm1') expiryDate.setMonth(expiryDate.getMonth() + 1);
      else if (selectedPlan.id === 'm6') expiryDate.setMonth(expiryDate.getMonth() + 6);
      else expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      const expiryStr = expiryDate.toLocaleDateString('vi-VN');

      setUser({
        ...user,
        plan: `Gói VIP (${selectedPlan.name})`,
        isVip: true,
        vipExpiry: expiryStr,
        vipTxn: transactionCode
      });

      setStep('success');

      showNotificationPopup(
        '💎 KÍCH HOẠT VIP THÀNH CÔNG!',
        `Bạn đã nâng cấp thành công ${selectedPlan.name}. Tận hưởng trọn vẹn kho phim 4K HDR không giới hạn!`,
        null,
        'vip'
      );
    }, 1500);
  };

  const handleClose = () => {
    setStep('select_plan');
    setDiscountPercent(0);
    setVoucherCode('');
    onClose();
  };

  const copyToClipboard = (text, label) => {
    try {
      if (Clipboard && Clipboard.setString) {
        Clipboard.setString(text);
      }
    } catch (e) {}
    Alert.alert('Đã sao chép', `Đã sao chép ${label}: ${text}`);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: theme.isLight ? '#FFFFFF' : '#141418', borderColor: theme.border }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerLeft}>
              {step === 'checkout' && (
                <TouchableOpacity onPress={() => setStep('select_plan')} style={styles.backBtn}>
                  <Ionicons name="arrow-back" size={20} color={theme.textPrimary} />
                </TouchableOpacity>
              )}
              <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
                {step === 'select_plan' && 'Chọn Gói Hội Viên VIP'}
                {step === 'checkout' && 'Xác Nhận & Thanh Toán'}
                {step === 'success' && 'Kích Hoạt Thành Công'}
              </Text>
            </View>

            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* STEP 1: SELECT PLAN */}
          {step === 'select_plan' && (
            <>
              <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                <Text style={[styles.subHeading, { color: theme.textSecondary }]}>
                  Mở khóa trải nghiệm điện ảnh 4K HDR & Âm thanh Dolby Atmos
                </Text>

                {PLANS.map((plan) => {
                  const active = selectedPlanId === plan.id;
                  return (
                    <TouchableOpacity
                      key={plan.id}
                      style={[
                        styles.card,
                        {
                          backgroundColor: theme.surface,
                          borderColor: active ? accentColor : theme.border
                        },
                        active && { backgroundColor: `${accentColor}0D` }
                      ]}
                      activeOpacity={0.85}
                      onPress={() => setSelectedPlanId(plan.id)}
                    >
                      {plan.badge && (
                        <View style={[styles.popularBadge, { backgroundColor: accentColor }]}>
                          <Text style={styles.popularBadgeText}>{plan.badge}</Text>
                        </View>
                      )}

                      <View style={styles.cardTop}>
                        <View>
                          <Text style={[styles.planName, { color: theme.textPrimary }]}>{plan.name}</Text>
                          {plan.saveText && (
                            <Text style={[styles.saveText, { color: '#4CD964' }]}>{plan.saveText}</Text>
                          )}
                          <View style={styles.priceRow}>
                            <Text style={[styles.price, { color: accentColor }]}>{plan.priceFormatted}</Text>
                            <Text style={[styles.period, { color: theme.textMuted }]}>{plan.period}</Text>
                          </View>
                        </View>
                        <Ionicons
                          name={active ? "checkmark-circle" : "ellipse-outline"}
                          size={24}
                          color={active ? accentColor : theme.textMuted}
                        />
                      </View>

                      <View style={[styles.featureList, { borderTopColor: theme.border }]}>
                        {plan.features.map((feat, idx) => (
                          <View key={idx} style={styles.featureRow}>
                            <Ionicons name="checkmark-circle-outline" size={15} color={accentColor} />
                            <Text style={[styles.featureText, { color: theme.textSecondary }]}>{feat}</Text>
                          </View>
                        ))}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.footer}>
                <TouchableOpacity
                  style={[styles.payBtn, { backgroundColor: accentColor }]}
                  activeOpacity={0.85}
                  onPress={handleGoToCheckout}
                >
                  <Text style={styles.payBtnText}>
                    TIẾP TỤC THANH TOÁN • {selectedPlan.priceFormatted}
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.disclaimer, { color: theme.textMuted }]}>
                  Thanh toán bảo mật. Kích hoạt tự động ngay sau khi thanh toán.
                </Text>
              </View>
            </>
          )}

          {/* STEP 2: CHECKOUT & PAYMENT SELECTION */}
          {step === 'checkout' && (
            <>
              <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                {/* Order Summary Card */}
                <View style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Gói đăng ký</Text>
                    <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>{selectedPlan.name}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Mã giao dịch</Text>
                    <Text style={[styles.summaryValueCode, { color: accentColor }]}>#{transactionCode}</Text>
                  </View>
                  {discountPercent > 0 && (
                    <View style={styles.summaryRow}>
                      <Text style={[styles.summaryLabel, { color: '#4CD964' }]}>Ưu đãi Voucher</Text>
                      <Text style={[styles.summaryValue, { color: '#4CD964' }]}>-{discountPercent}%</Text>
                    </View>
                  )}
                  <View style={[styles.divider, { backgroundColor: theme.border }]} />
                  <View style={styles.summaryRow}>
                    <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>Tổng thanh toán</Text>
                    <Text style={[styles.totalValue, { color: accentColor }]}>{finalPriceFormatted}</Text>
                  </View>
                </View>

                {/* Voucher Input */}
                <View style={styles.voucherBox}>
                  <TextInput
                    style={[styles.voucherInput, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.border }]}
                    placeholder="Nhập mã giảm giá (VD: FIMAX2026)"
                    placeholderTextColor={theme.textMuted}
                    autoCapitalize="characters"
                    value={voucherCode}
                    onChangeText={setVoucherCode}
                  />
                  <TouchableOpacity style={[styles.voucherBtn, { backgroundColor: accentColor }]} onPress={handleApplyVoucher}>
                    <Text style={styles.voucherBtnText}>Áp Dụng</Text>
                  </TouchableOpacity>
                </View>

                {/* Payment Methods */}
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Phương thức thanh toán</Text>

                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selectedPaymentId === method.id;
                  return (
                    <TouchableOpacity
                      key={method.id}
                      style={[
                        styles.paymentCard,
                        { backgroundColor: theme.surface, borderColor: isSelected ? accentColor : theme.border },
                        isSelected && { backgroundColor: `${accentColor}0A` }
                      ]}
                      activeOpacity={0.85}
                      onPress={() => setSelectedPaymentId(method.id)}
                    >
                      <View style={[styles.paymentIconWrap, { backgroundColor: `${method.color}22` }]}>
                        <Ionicons name={method.icon} size={20} color={method.id === 'apple_pay' && theme.isLight ? '#000' : method.color} />
                      </View>

                      <View style={styles.paymentInfo}>
                        <Text style={[styles.paymentName, { color: theme.textPrimary }]}>{method.name}</Text>
                        <Text style={[styles.paymentSubtitle, { color: theme.textSecondary }]}>{method.subtitle}</Text>
                      </View>

                      <Ionicons
                        name={isSelected ? "radio-button-on" : "radio-button-off"}
                        size={20}
                        color={isSelected ? accentColor : theme.textMuted}
                      />
                    </TouchableOpacity>
                  );
                })}

                {/* Bank Transfer Details (when VietQR is selected) */}
                {selectedPaymentId === 'vietqr' && (
                  <View style={[styles.bankBox, { backgroundColor: `${accentColor}08`, borderColor: `${accentColor}33` }]}>
                    <Text style={[styles.bankBoxTitle, { color: accentColor }]}>THÔNG TIN CHUYỂN KHOẢN VIETQR</Text>
                    
                    <View style={styles.bankDetailRow}>
                      <Text style={[styles.bankDetailLabel, { color: theme.textSecondary }]}>Ngân hàng:</Text>
                      <Text style={[styles.bankDetailVal, { color: theme.textPrimary }]}>MBBank (Quân Đội)</Text>
                    </View>

                    <View style={styles.bankDetailRow}>
                      <Text style={[styles.bankDetailLabel, { color: theme.textSecondary }]}>Số tài khoản:</Text>
                      <TouchableOpacity onPress={() => copyToClipboard('0908889999', 'Số tài khoản')} style={styles.copyRow}>
                        <Text style={[styles.bankDetailValHighlight, { color: accentColor }]}>0908889999</Text>
                        <Ionicons name="copy-outline" size={14} color={accentColor} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.bankDetailRow}>
                      <Text style={[styles.bankDetailLabel, { color: theme.textSecondary }]}>Chủ tài khoản:</Text>
                      <Text style={[styles.bankDetailVal, { color: theme.textPrimary }]}>FIMAX CINEMA</Text>
                    </View>

                    <View style={styles.bankDetailRow}>
                      <Text style={[styles.bankDetailLabel, { color: theme.textSecondary }]}>Nội dung:</Text>
                      <TouchableOpacity onPress={() => copyToClipboard(transactionCode, 'Nội dung')} style={styles.copyRow}>
                        <Text style={[styles.bankDetailValHighlight, { color: accentColor }]}>{transactionCode}</Text>
                        <Ionicons name="copy-outline" size={14} color={accentColor} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </ScrollView>

              <View style={styles.footer}>
                <TouchableOpacity
                  style={[styles.payBtn, { backgroundColor: accentColor }]}
                  activeOpacity={0.85}
                  onPress={handleConfirmPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <View style={styles.processingRow}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                      <Text style={styles.payBtnText}>Đang xác nhận giao dịch...</Text>
                    </View>
                  ) : (
                    <Text style={styles.payBtnText}>
                      XÁC NHẬN THANH TOÁN • {finalPriceFormatted}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 'success' && (
            <View style={styles.successContainer}>
              <Ionicons name="checkmark-circle" size={72} color="#4CD964" style={styles.successIcon} />
              <Text style={[styles.successTitle, { color: theme.textPrimary }]}>Kích Hoạt VIP Thành Công!</Text>
              <Text style={[styles.successSubtitle, { color: theme.textSecondary }]}>
                Chào mừng bạn đến với đặc quyền Hội Viên VIP của FIMAX Cinema.
              </Text>

              <View style={[styles.receiptBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Gói kích hoạt</Text>
                  <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>{selectedPlan.name}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Mã giao dịch</Text>
                  <Text style={[styles.summaryValueCode, { color: accentColor }]}>#{transactionCode}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Phương thức</Text>
                  <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>{selectedPayment.name}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Trạng thái</Text>
                  <Text style={[styles.summaryValue, { color: '#4CD964', fontWeight: '800' }]}>ĐÃ HOÀN TẤT</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.payBtn, { backgroundColor: accentColor, width: '100%', marginTop: 24 }]}
                onPress={handleClose}
              >
                <Text style={styles.payBtnText}>BẮT ĐẦU XEM PHIM 4K</Text>
              </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'flex-end'
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 24,
    borderWidth: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  backBtn: {
    padding: 2
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800'
  },
  closeBtn: {
    padding: 4
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16
  },
  subHeading: {
    fontSize: 13,
    marginBottom: 16
  },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    position: 'relative'
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 14,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  planName: {
    fontSize: 16,
    fontWeight: '700'
  },
  saveText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4
  },
  price: {
    fontSize: 20,
    fontWeight: '900'
  },
  period: {
    fontSize: 12,
    marginLeft: 4
  },
  featureList: {
    gap: 6,
    borderTopWidth: 1,
    paddingTop: 10
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500'
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12
  },
  payBtn: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  disclaimer: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8
  },
  summaryCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    gap: 10
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '500'
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700'
  },
  summaryValueCode: {
    fontSize: 13,
    fontWeight: '800'
  },
  divider: {
    height: 1,
    marginVertical: 4
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800'
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900'
  },
  voucherBox: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18
  },
  voucherInput: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    fontSize: 13,
    fontWeight: '600'
  },
  voucherBtn: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  voucherBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.2,
    marginBottom: 10,
    gap: 12
  },
  paymentIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  paymentInfo: {
    flex: 1
  },
  paymentName: {
    fontSize: 13.5,
    fontWeight: '700'
  },
  paymentSubtitle: {
    fontSize: 11,
    marginTop: 2
  },
  bankBox: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    marginTop: 6,
    marginBottom: 16,
    gap: 8
  },
  bankBoxTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  bankDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bankDetailLabel: {
    fontSize: 12,
    fontWeight: '500'
  },
  bankDetailVal: {
    fontSize: 12.5,
    fontWeight: '700'
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  bankDetailValHighlight: {
    fontSize: 13,
    fontWeight: '800'
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  successContainer: {
    padding: 24,
    alignItems: 'center'
  },
  successIcon: {
    marginBottom: 12
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 6
  },
  successSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20
  },
  receiptBox: {
    width: '100%',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    gap: 10
  }
});
