import SwiftUI

public struct AdminConfigView: View {
    @EnvironmentObject private var appConfig: AppConfiguration
    @State private var inputApiUrl: String = ""
    @State private var inputCallbackUrl: String = ""
    @State private var testStatus: String?
    
    public var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Image(systemName: "server.rack")
                    .foregroundColor(AppColors.primaryRed)
                Text("Cấu Hình Dynamic Backend URL & Callback")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(.white)
            }
            
            Text("Nhập URL API và Webhook Callback của bạn. App iOS sẽ tải dữ liệu trực tiếp và gửi sự kiện xem phim về server này.")
                .font(.system(size: 12))
                .foregroundColor(AppColors.textSecondary)
            
            VStack(alignment: .leading, spacing: 4) {
                Text("API Base URL:").font(.system(size: 12, weight: .semibold)).foregroundColor(.white)
                TextField("http://...", text: $inputApiUrl)
                    .textFieldStyle(PlainTextFieldStyle())
                    .padding(10)
                    .background(Color(white: 0.1))
                    .cornerRadius(8)
                    .foregroundColor(.white)
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text("Playback Callback Webhook URL:").font(.system(size: 12, weight: .semibold)).foregroundColor(.white)
                TextField("http://...", text: $inputCallbackUrl)
                    .textFieldStyle(PlainTextFieldStyle())
                    .padding(10)
                    .background(Color(white: 0.1))
                    .cornerRadius(8)
                    .foregroundColor(.white)
            }
            
            HStack(spacing: 12) {
                Button(action: testConnection) {
                    Text("Test Kết Nối")
                        .font(.system(size: 13, weight: .semibold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(Color(white: 0.25))
                        .foregroundColor(.white)
                        .cornerRadius(8)
                }
                
                Button(action: saveConfig) {
                    Text("Lưu Cấu Hình")
                        .font(.system(size: 13, weight: .bold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(AppColors.primaryRed)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                }
            }
            
            if let status = testStatus {
                Text(status)
                    .font(.system(size: 12))
                    .foregroundColor(AppColors.gold)
                    .padding(8)
                    .background(Color(white: 0.15))
                    .cornerRadius(6)
            }
        }
        .padding(16)
        .background(AppColors.cardDark)
        .cornerRadius(12)
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(AppColors.borderDark, lineWidth: 1))
        .onAppear {
            inputApiUrl = appConfig.apiBaseUrl
            inputCallbackUrl = appConfig.callbackUrl
        }
    }
    
    private func saveConfig() {
        appConfig.apiBaseUrl = inputApiUrl
        appConfig.callbackUrl = inputCallbackUrl
        testStatus = "✅ Đã lưu cấu hình thành công!"
    }
    
    private func testConnection() {
        testStatus = "Đang kiểm tra kết nối..."
        guard let url = URL(string: "\(inputApiUrl)/movies") else {
            testStatus = "❌ URL không hợp lệ"
            return
        }
        URLSession.shared.dataTask(with: url) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    testStatus = "❌ Lỗi: \(error.localizedDescription)"
                } else if let http = response as? HTTPURLResponse, http.statusCode == 200 {
                    testStatus = "✅ Kết nối máy chủ thành công (HTTP 200 OK)"
                } else {
                    testStatus = "⚠️ Server phản hồi mã HTTP"
                }
            }
        }.resume()
    }
}