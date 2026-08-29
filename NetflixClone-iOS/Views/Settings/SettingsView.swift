import SwiftUI

public struct SettingsView: View {
    @EnvironmentObject private var appConfig: AppConfiguration
    @EnvironmentObject private var libraryVM: LibraryViewModel
    @State private var autoPlay = true
    @State private var notifications = true
    
    public var body: some View {
        NavigationView {
            ZStack {
                AppColors.backgroundDark.ignoresSafeArea()
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 18) {
                        Text("Cài Đặt & Quản Trị")
                            .font(.system(size: 24, weight: .bold))
                            .foregroundColor(.white)
                        
                        // Admin Config Section
                        AdminConfigView()
                        
                        // App Preferences
                        Text("TÙY CHỌN TRẢI NGHIỆM")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(AppColors.textSecondary)
                        
                        VStack(spacing: 1) {
                            Toggle("Giao diện Dark Mode", isOn: $appConfig.isDarkMode)
                                .padding(14)
                                .background(AppColors.cardDark)
                            
                            Toggle("Tự động phát preview trailer", isOn: $autoPlay)
                                .padding(14)
                                .background(AppColors.cardDark)
                            
                            Toggle("Thông báo phim mới", isOn: $notifications)
                                .padding(14)
                                .background(AppColors.cardDark)
                        }
                        .foregroundColor(.white)
                        .cornerRadius(10)
                        
                        // Storage
                        Text("DỮ LIỆU & BỘ NHỚ")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(AppColors.textSecondary)
                        
                        Button(action: { libraryVM.clearHistory() }) {
                            HStack {
                                Text("Xóa toàn bộ lịch sử xem")
                                    .foregroundColor(AppColors.primaryRed)
                                Spacer()
                                Image(systemName: "trash").foregroundColor(AppColors.primaryRed)
                            }
                            .padding(14)
                            .background(AppColors.cardDark)
                            .cornerRadius(10)
                        }
                    }
                    .padding(16)
                }
            }
            .navigationBarHidden(true)
        }
    }
}