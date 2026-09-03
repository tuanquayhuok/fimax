import SwiftUI

public struct SocialAuthSheetView: View {
    let provider: String // "Google" or "Facebook"
    let onAuthSuccess: (UserAccount) -> Void
    @Environment(\.presentationMode) private var presentationMode
    
    @State private var nameInput = ""
    @State private var emailInput = ""
    @State private var isProcessing = false
    
    var isGoogle: Bool { provider == "Google" }
    var brandColor: Color { isGoogle ? Color(red: 0.917, green: 0.262, blue: 0.207) : Color(red: 0.094, green: 0.466, blue: 0.949) }
    
    public var body: some View {
        ZStack {
            AppColors.backgroundDark.ignoresSafeArea()
            
            VStack(alignment: .leading, spacing: 16) {
                // Header
                HStack(spacing: 10) {
                    Image(systemName: isGoogle ? "g.circle.fill" : "f.circle.fill")
                        .font(.system(size: 26))
                        .foregroundColor(brandColor)
                    
                    Text(isGoogle ? "Đăng nhập với Google" : "Đăng nhập với Facebook")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.white)
                    
                    Spacer()
                    
                    Button(action: { presentationMode.wrappedValue.dismiss() }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 22))
                            .foregroundColor(.gray)
                    }
                }
                .padding(.top, 16)
                
                Text(isGoogle ? "Nhập địa chỉ Gmail của bạn để xác thực đăng nhập:" : "Nhập Email/SĐT Facebook của bạn để tiếp tục:")
                    .font(.system(size: 13))
                    .foregroundColor(AppColors.textSecondary)
                
                // Form
                VStack(alignment: .leading, spacing: 12) {
                    Text("HỌ VÀ TÊN").font(.system(size: 11, weight: .bold)).foregroundColor(.gray)
                    TextField("Họ và tên của bạn", text: $nameInput)
                        .padding(12)
                        .background(AppColors.surface)
                        .cornerRadius(10)
                        .foregroundColor(.white)
                    
                    Text(isGoogle ? "ĐỊA CHỈ GMAIL" : "EMAIL / SĐT FACEBOOK").font(.system(size: 11, weight: .bold)).foregroundColor(.gray)
                    TextField(isGoogle ? "tencuaban@gmail.com" : "email_hoac_sdt_fb", text: $emailInput)
                        .padding(12)
                        .background(AppColors.surface)
                        .cornerRadius(10)
                        .foregroundColor(.white)
                        .autocapitalization(.none)
                }
                .padding(.vertical, 6)
                
                Button(action: {
                    isProcessing = true
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
                        isProcessing = false
                        let user = UserAccount(
                            id: (isGoogle ? "gg_" : "fb_") + "\(Int(Date().timeIntervalSince1970))",
                            name: nameInput.isEmpty ? "Thành viên \(provider)" : nameInput,
                            email: emailInput.isEmpty ? "user.\(provider.lowercased())@fimax.vn" : emailInput,
                            avatarUrl: isGoogle
                                ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"
                                : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
                            planTier: "Thành viên Tiêu chuẩn",
                            isVip: false
                        )
                        onAuthSuccess(user)
                        presentationMode.wrappedValue.dismiss()
                    }
                }) {
                    HStack {
                        if isProcessing {
                            ProgressView().progressViewStyle(CircularProgressViewStyle(tint: .white))
                        } else {
                            Text("XÁC NHẬN ĐĂNG NHẬP")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(.white)
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(brandColor)
                    .cornerRadius(10)
                }
                
                Spacer()
            }
            .padding(20)
        }
    }
}