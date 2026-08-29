import SwiftUI

public struct RedeemCodeModalView: View {
    @Environment(\.presentationMode) private var presentationMode
    @EnvironmentObject private var authVM: AuthViewModel
    @State private var codeInput = ""
    @State private var isProcessing = false
    
    public var body: some View {
        ZStack {
            Color.black.opacity(0.9).ignoresSafeArea()
            
            VStack(alignment: .leading, spacing: 14) {
                HStack {
                    Image(systemName: "gift.fill")
                        .font(.system(size: 24))
                        .foregroundColor(AppColors.gold)
                    Spacer()
                    Button(action: { presentationMode.wrappedValue.dismiss() }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 22))
                            .foregroundColor(.gray)
                    }
                }
                
                Text("Đổi Mã Kích Hoạt VIP")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(.white)
                
                Text("Nhập mã quà tặng hoặc mã khuyến mãi của bạn để mở khóa đặc quyền xem phim 4K.")
                    .font(.system(size: 13))
                    .foregroundColor(AppColors.textSecondary)
                
                // Sample Chips
                HStack(spacing: 8) {
                    ForEach(["FIMAXVIP", "VIP4K", "CINEMA2026"], id: \.self) { sample in
                        Button(action: { codeInput = sample }) {
                            Text(sample)
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(AppColors.gold)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.white.opacity(0.08))
                                .cornerRadius(6)
                        }
                    }
                }
                .padding(.vertical, 4)
                
                TextField("NHẬP MÃ TẠI ĐÂY", text: $codeInput)
                    .padding(12)
                    .background(AppColors.cardDark)
                    .cornerRadius(10)
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
                    .font(.system(size: 16, weight: .bold))
                
                Button(action: {
                    isProcessing = true
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                        isProcessing = false
                        authVM.currentUser?.planTier = "VIP Kích Hoạt (\(codeInput.isEmpty ? "FIMAXVIP" : codeInput))"
                        authVM.currentUser?.isVip = true
                        presentationMode.wrappedValue.dismiss()
                    }
                }) {
                    Text("XÁC NHẬN KÍCH HOẠT")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(AppColors.primaryRed)
                        .cornerRadius(10)
                }
            }
            .padding(22)
            .background(AppColors.surface)
            .cornerRadius(20)
            .padding(20)
        }
    }
}