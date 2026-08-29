import SwiftUI

public struct RatingDialogView: View {
    public let movie: Movie
    public let onDismiss: () -> Void
    @State private var ratingScore: Double = 9.0
    @State private var reviewText: String = ""
    
    public var body: some View {
        ZStack {
            Color.black.opacity(0.8).ignoresSafeArea()
            
            VStack(spacing: 16) {
                Text("Đánh Giá Phim")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.white)
                
                Text(movie.title)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(AppColors.primaryRed)
                
                HStack(spacing: 6) {
                    ForEach(1...10, id: \.self) { star in
                        Image(systemName: Double(star) <= ratingScore ? "star.fill" : "star")
                            .foregroundColor(Double(star) <= ratingScore ? AppColors.gold : .gray)
                            .font(.system(size: 20))
                            .onTapGesture {
                                ratingScore = Double(star)
                            }
                    }
                }
                
                Text("\(String(format: "%.0f", ratingScore)) / 10 Điểm")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(AppColors.gold)
                
                TextField("Viết cảm nhận của bạn về bộ phim này...", text: $reviewText)
                    .padding(12)
                    .background(Color(white: 0.15))
                    .cornerRadius(8)
                    .foregroundColor(.white)
                
                HStack(spacing: 12) {
                    Button("Đóng") { onDismiss() }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(Color(white: 0.25))
                        .foregroundColor(.white)
                        .cornerRadius(8)
                    
                    Button("Gửi Đánh Giá") { onDismiss() }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(AppColors.primaryRed)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                }
            }
            .padding(20)
            .background(AppColors.cardDark)
            .cornerRadius(16)
            .padding(24)
        }
    }
}