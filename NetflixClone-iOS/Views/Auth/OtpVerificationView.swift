import SwiftUI

public struct OtpVerificationView: View {
    public let destination: String
    public let onVerifySuccess: () -> Void
    public let onCancel: () -> Void
    
    @State private var pinDigits = ["", "", "", "", "", ""]
    @State private var timeRemaining = 60
    @State private var isVerifying = false
    let timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()
    
    public var body: some View {
        ZStack {
            Color.black.opacity(0.92).ignoresSafeArea()
            
            VStack(alignment: .leading, spacing: 16) {
                HStack {
                    Image(systemName: "shield.checkmark.fill")
                        .font(.system(size: 26))
                        .foregroundColor(AppColors.primaryRed)
                    Spacer()
                    Button(action: onCancel) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 22))
                            .foregroundColor(.gray)
                    }
                }
                
                Text("Xác Minh Tài Khoản")
                    .font(.system(size: 22, weight: .bold))
                    .foregroundColor(.white)
                
                Text("Chúng tôi đã gửi mã xác nhận 6 số đến:\n\(destination)")
                    .font(.system(size: 13))
                    .foregroundColor(AppColors.textSecondary)
                
                // Fast Demo helper
                Button(action: {
                    pinDigits = ["8", "8", "8", "8", "8", "8"]
                }) {
                    HStack {
                        Image(systemName: "key.fill")
                            .foregroundColor(AppColors.gold)
                        Text("Mã thử nghiệm nhanh: 888888 (Nhấn để tự điền)")
                            .font(.system(size: 12))
                            .foregroundColor(AppColors.gold)
                    }
                    .padding(8)
                    .frame(maxWidth: .infinity)
                    .background(AppColors.gold.opacity(0.12))
                    .cornerRadius(8)
                }
                
                // 6 Pin Boxes
                HStack(spacing: 8) {
                    ForEach(0..<6, id: \.self) { index in
                        TextField("", text: $pinDigits[index])
                            .frame(height: 52)
                            .background(AppColors.cardDark)
                            .cornerRadius(10)
                            .multilineTextAlignment(.center)
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                            .overlay(RoundedRectangle(cornerRadius: 10).stroke(pinDigits[index].isEmpty ? AppColors.borderDark : AppColors.primaryRed, lineWidth: 1.5))
                            .keyboardType(.numberPad)
                    }
                }
                .padding(.vertical, 8)
                
                // Resend Timer
                HStack {
                    Spacer()
                    if timeRemaining > 0 {
                        Text("Gửi lại mã sau \(timeRemaining)s")
                            .font(.system(size: 12))
                            .foregroundColor(.gray)
                    } else {
                        Button("Gửi lại mã xác nhận") {
                            timeRemaining = 60
                        }
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(AppColors.primaryRed)
                    }
                    Spacer()
                }
                
                // Confirm Button
                Button(action: {
                    isVerifying = true
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                        isVerifying = false
                        onVerifySuccess()
                    }
                }) {
                    if isVerifying {
                        ProgressView().accentColor(.white)
                    } else {
                        Text("XÁC NHẬN & HOÀN TẤT")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(AppColors.primaryRed)
                            .cornerRadius(10)
                    }
                }
                .padding(.top, 8)
            }
            .padding(24)
            .background(AppColors.surface)
            .cornerRadius(20)
            .padding(20)
        }
        .onReceive(timer) { _ in
            if timeRemaining > 0 { timeRemaining -= 1 }
        }
    }
}