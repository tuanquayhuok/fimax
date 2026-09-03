import SwiftUI

public struct ExploreView: View {
    @State private var selectedCategory = "Tất cả"
    let categories = ["Tất cả", "Top 10 Rạp Phim 🔥", "Hành Động", "Tâm Lý", "Kinh Dị"]
    
    public var body: some View {
        ZStack {
            AppColors.backgroundDark.ignoresSafeArea()
            
            VStack(alignment: .leading, spacing: 14) {
                Text("Khám Phá & Thịnh Hành")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 16)
                    .padding(.top, 16)
                
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(categories, id: \.self) { cat in
                            Button(action: { selectedCategory = cat }) {
                                Text(cat)
                                    .font(.system(size: 12, weight: .semibold))
                                    .foregroundColor(selectedCategory == cat ? .white : .gray)
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 8)
                                    .background(selectedCategory == cat ? AppColors.primaryRed : AppColors.surface)
                                    .cornerRadius(20)
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                }
                
                ScrollView {
                    VStack(spacing: 16) {
                        ForEach(MockData.movies) { movie in
                            VStack(alignment: .leading, spacing: 8) {
                                AsyncImage(url: URL(string: movie.backdropUrl)) { img in
                                    img.resizable().scaledToFill()
                                } placeholder: {
                                    Rectangle().fill(Color.gray)
                                }
                                .frame(height: 180)
                                .cornerRadius(12)
                                .clipped()
                                
                                Text(movie.title)
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.white)
                            }
                            .padding(12)
                            .background(AppColors.surface)
                            .cornerRadius(14)
                        }
                    }
                    .padding(.horizontal, 16)
                }
            }
        }
    }
}