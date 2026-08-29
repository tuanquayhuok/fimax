import SwiftUI

public struct SocialAuthSheetView: View {
    public let provider: String
    public let onConfirm: (String, String) -> Void
    public let onCancel: () -> Void
    @State private var isProcessing = false
    
    public var body: some View {
        ZStack {
            Color.black.opacity(0.85).ignoresSafeArea()
            
            if provider == "Apple" {
                // Apple ID Sheet
                VStack(spacing: 16) {
                    Image(systemName: "apple.logo")
                        .font(.system(size: 32))
                        .foregroundColor(.black)
                    
                    Text("Sign in with Apple")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(.black)
                    
                    Text("Do you want to sign in to FIMAX Cinema with your Apple ID?")
                        .font(.system(size: 13))
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                    
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Name: Apple User").font(.system(size: 13, weight: .semibold))
                        Divider()
                        Text("Email: Hide My Email (icloud.com)").font(.system(size: 13, weight: .semibold))
                    }
                    .padding(12)
                    .background(Color.white)
                    .cornerRadius(10)
                    
                    HStack {
                        Image(systemName: "faceid")
                            .font(.system(size: 24))
                            .foregroundColor(.blue)
                        Text("Confirm with Face ID")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(.blue)
                    }
                    .padding(.vertical, 4)
                    
                    Button(action: {
                        isProcessing = true
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                            onConfirm("Apple User", "apple_user@icloud.com")
                        }
                    }) {
                        Text("Continue with Apple ID")
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(Color.black)
                            .cornerRadius(10)
                    }
                    
                    Button("Cancel", action: onCancel)
                        .foregroundColor(.gray)
                        .font(.system(size: 14))
                }
                .padding(24)
                .background(Color(white: 0.95))
                .cornerRadius(20)
                .padding(20)
            } else {
                // Google Sheet
                VStack(spacing: 14) {
                    Text("G")
                        .font(.system(size: 28, weight: .black))
                        .foregroundColor(.blue)
                    
                    Text("Đăng nhập bằng Google")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.white)
                    
                    Text("Chọn tài khoản để tiếp tục tới FIMAX Cinema")
                        .font(.system(size: 12))
                        .foregroundColor(AppColors.textSecondary)
                    
                    Button(action: {
                        onConfirm("Nguyễn An", "nguyen.an@gmail.com")
                    }) {
                        HStack(spacing: 12) {
                            Circle().fill(Color.gray).frame(width: 36, height: 36)
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Nguyễn An").font(.system(size: 13, weight: .semibold)).foregroundColor(.white)
                                Text("nguyen.an@gmail.com").font(.system(size: 11)).foregroundColor(.gray)
                            }
                            Spacer()
                        }
                        .padding(12)
                        .background(AppColors.cardDark)
                        .cornerRadius(10)
                    }
                    
                    Button("Hủy bỏ", action: onCancel)
                        .foregroundColor(.gray)
                        .padding(.top, 4)
                }
                .padding(24)
                .background(AppColors.surface)
                .cornerRadius(20)
                .padding(20)
            }
        }
    }
}