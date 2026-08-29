import SwiftUI

public struct MovieRowSectionView: View {
    public let title: String
    public let movies: [Movie]
    public let onSelect: (Movie) -> Void
    
    public var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title)
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(AppColors.textPrimary)
                .padding(.horizontal, 16)
            
            ScrollView(.horizontal, showsIndicators: false) {
                LazyHStack(spacing: 12) {
                    ForEach(movies) { movie in
                        Button(action: { onSelect(movie) }) {
                            VStack(alignment: .leading, spacing: 4) {
                                ZStack(alignment: .topLeading) {
                                    AsyncImage(url: URL(string: movie.posterUrl)) { img in
                                        img.resizable().scaledToFill()
                                    } placeholder: {
                                        Rectangle().fill(AppColors.cardDark)
                                    }
                                    .frame(width: 130, height: 190)
                                    .cornerRadius(8)
                                    .clipped()
                                    
                                    Text("⭐ \(String(format: "%.1f", movie.rating))")
                                        .font(.system(size: 10, weight: .bold))
                                        .foregroundColor(AppColors.gold)
                                        .padding(.horizontal, 5)
                                        .padding(.vertical, 2)
                                        .background(Color.black.opacity(0.75))
                                        .cornerRadius(4)
                                        .padding(6)
                                }
                                
                                Text(movie.title)
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundColor(AppColors.textPrimary)
                                    .lineLimit(1)
                                
                                Text("\(String(movie.releaseYear)) • \(movie.country)")
                                    .font(.system(size: 11))
                                    .foregroundColor(AppColors.textSecondary)
                                    .lineLimit(1)
                            }
                            .frame(width: 130)
                        }
                    }
                }
                .padding(.horizontal, 16)
            }
        }
        .padding(.vertical, 8)
    }
}