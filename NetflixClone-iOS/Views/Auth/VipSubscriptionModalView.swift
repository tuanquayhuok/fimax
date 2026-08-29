import SwiftUI

public struct VipSubscriptionModalView: View {
    @Environment(\.presentationMode) private var presentationMode
    @EnvironmentObject private var authVM: AuthViewModel
    @State private var selectedPlan = 1 // 0: 1 tháng, 1: 6 tháng, 2: 12 tháng
    
    public var body: some View {
        ZStack {
            AppColors.backgroundDark.ignoresSafeArea()
            
            VStack(alignment: .leading, spacing: 16) {
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("👑 GÓI HỘI VIÊN CAO CẤP")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(AppColors.gold)
                        Text("Nâng Cấp FIMAX VIP")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                    }
                    Spacer()
                    Button(action: { presentationMode.wrappedValue.dismiss() }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(.gray)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 16)
                
                ScrollView {
                    VStack(spacing: 12) {
                        // Plan 1: 1 Tháng
                        VipPlanCard(title: "VIP 1 Tháng", price: "49.000đ", origPrice: "79.000đ", isSelected: selectedPlan == 0, isPopular: false, features: ["Xem Full HD 1080p", "100% Không quảng cáo", "1 Thiết bị"])
                            .onTapGesture { selectedPlan = 0 }
                        
                        // Plan 2: 6 Tháng (Bán chạy)
                        VipPlanCard(title: "VIP 6 Tháng (Khuyên dùng)", price: "249.000đ", origPrice: "399.000đ", isSelected: selectedPlan == 1, isPopular: true, features: ["Chất lượng 4K Ultra HD", "Âm thanh Dolby Atmos", "2 Thiết bị cùng lúc"])
                            .onTapGesture { selectedPlan = 1 }
                        
                        // Plan 3: 12 Tháng
                        VipPlanCard(title: "VIP 1 Năm (Ultimate)", price: "449.000đ", origPrice: "899.000đ", isSelected: selectedPlan == 2, isPopular: false, features: ["Toàn bộ đặc quyền 4K HDR", "Xem sớm phim mới trước 48h", "Không giới hạn thiết bị"])
                            .onTapGesture { selectedPlan = 2 }
                    }
                    .padding(.horizontal, 16)
                }
                
                // Purchase Button
                Button(action: {
                    authVM.currentUser.isVip = true
                    authVM.currentUser.planTier = "VIP Cinema 4K (Kích hoạt)"
                    presentationMode.wrappedValue.dismiss()
                }) {
                    Text("TIẾN HÀNH KÍCH HOẠT VIP")
                        .font(.system(size: 15, weight: .bold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(AppColors.primaryRed)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 20)
            }
        }
    }
}

struct VipPlanCard: View {
    let title: String
    let price: String
    let origPrice: String
    let isSelected: Bool
    let isPopular: Bool
    let features: [String]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(title)
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(.white)
                Spacer()
                Text(price)
                    .font(.system(size: 17, weight: .black))
                    .foregroundColor(AppColors.primaryRed)
            }
            
            ForEach(features, id: \.self) { feat in
                HStack(spacing: 6) {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(isSelected ? AppColors.primaryRed : AppColors.gold)
                        .font(.system(size: 12))
                    Text(feat).font(.system(size: 12)).foregroundColor(.gray)
                }
            }
        }
        .padding(14)
        .background(AppColors.cardDark)
        .cornerRadius(12)
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(isSelected ? AppColors.primaryRed : (isPopular ? AppColors.gold : AppColors.borderDark), lineWidth: isSelected ? 2 : 1))
    }
}