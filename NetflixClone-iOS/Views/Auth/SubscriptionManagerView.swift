import SwiftUI

public struct SubscriptionManagerView: View {
    @Environment(\.presentationMode) private var presentationMode
    @EnvironmentObject private var authVM: AuthViewModel
    @State private var autoRenew = true
    
    public var body: some View {
        ZStack {
            AppColors.backgroundDark.ignoresSafeArea()
            
            VStack(alignment: .leading, spacing: 18) {
                // Header
                HStack {
                    Text("Quản Lý Gói Đang Dùng")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(.white)
                    Spacer()
                    Button(action: { presentationMode.wrappedValue.dismiss() }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 22))
                            .foregroundColor(.gray)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 20)
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        // Plan Summary Card (Responsive, No Overflow)
                        VStack(alignment: .leading, spacing: 10) {
                            HStack(alignment: .top) {
                                Text(authVM.currentUser?.planTier ?? "Thành viên Tiêu chuẩn")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.white)
                                    .fixedSize(horizontal: false, vertical: true)
                                Spacer()
                                Text("Còn 182 ngày")
                                    .font(.system(size: 11, weight: .bold))
                                    .foregroundColor(AppColors.gold)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(AppColors.gold.opacity(0.15))
                                    .cornerRadius(6)
                            }
                            
                            Text("🟢 Đang hoạt động • Hết hạn 28/02/2027")
                                .font(.system(size: 12))
                                .foregroundColor(AppColors.textSecondary)
                            
                            Divider().background(AppColors.borderDark)
                            
                            HStack {
                                Text("Chu kỳ thanh toán:").font(.system(size: 13)).foregroundColor(.gray)
                                Spacer()
                                Text("249.000đ / 6 Tháng").font(.system(size: 13, weight: .semibold)).foregroundColor(.white)
                            }
                            
                            HStack {
                                Text("Phương thức:").font(.system(size: 13)).foregroundColor(.gray)
                                Spacer()
                                Text("Apple Pay (•••• 8821)").font(.system(size: 13, weight: .semibold)).foregroundColor(.white)
                            }
                        }
                        .padding(16)
                        .background(AppColors.surface)
                        .cornerRadius(14)
                        
                        // Active Benefits
                        Text("ĐẶC QUYỀN ĐANG ĐƯỢC HƯỞNG")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(AppColors.textSecondary)
                        
                        VStack(alignment: .leading, spacing: 10) {
                            BenefitRow(text: "Chất lượng: 4K Ultra HD & HDR10")
                            BenefitRow(text: "Âm thanh: Dolby Atmos 5.1 Surround")
                            BenefitRow(text: "100% Không có quảng cáo")
                            BenefitRow(text: "2 Thiết bị cùng lúc (Đang dùng 1/2)")
                        }
                        .padding(16)
                        .background(AppColors.surface)
                        .cornerRadius(14)
                        
                        // Auto-Renew Toggle
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Tự động gia hạn").font(.system(size: 14, weight: .semibold)).foregroundColor(.white)
                                Text("Tự động trừ tiền khi hết hạn").font(.system(size: 11)).foregroundColor(.gray)
                            }
                            Spacer()
                            Toggle("", isOn: $autoRenew).labelsHidden()
                        }
                        .padding(16)
                        .background(AppColors.surface)
                        .cornerRadius(14)
                        
                        // Cancel Plan
                        Button(action: {
                            authVM.currentUser?.planTier = "Thành viên Tiêu chuẩn"
                            authVM.currentUser?.isVip = false
                            presentationMode.wrappedValue.dismiss()
                        }) {
                            Text("Hủy Gói VIP Hiện Tại")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(AppColors.primaryRed)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(AppColors.surface)
                                .cornerRadius(12)
                        }
                    }
                    .padding(.horizontal, 20)
                }
            }
        }
    }
}