import SwiftUI

public struct DownloadView: View {
    public var body: some View {
        ZStack {
            AppColors.backgroundDark.ignoresSafeArea()
            
            VStack(spacing: 16) {
                Image(systemName: "arrow.down.circle.fill")
                    .font(.system(size: 54))
                    .foregroundColor(AppColors.primaryRed)
                    .padding(.top, 60)
                
                Text("Tải Xuống Ngoại Tuyến")
                    .font(.system(size: 22, weight: .bold))
                    .foregroundColor(.white)
                
                Text("Xem phim chuẩn 4K mọi lúc mọi nơi không cần kết nối mạng.")
                    .font(.system(size: 13))
                    .foregroundColor(AppColors.textSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 30)
                
                Spacer()
            }
        }
    }
}