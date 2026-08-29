import SwiftUI

public struct SearchModalView: View {
    @Binding public var isPresented: Bool
    public let onSelectMovie: (Movie) -> Void
    @State private var query = ""
    @State private var selectedGenre = "Tất cả"
    
    private var filteredMovies: [Movie] {
        var list = MockData.sampleMovies
        if !query.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            let q = query.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
            list = list.filter {
                $0.title.lowercased().contains(q) ||
                ($0.originalTitle?.lowercased().contains(q) ?? false) ||
                ($0.director?.lowercased().contains(q) ?? false) ||
                ($0.cast?.contains(where: { $0.name.lowercased().contains(q) }) ?? false)
            }
        }
        if selectedGenre != "Tất cả" {
            list = list.filter { $0.genres.contains(selectedGenre) }
        }
        return list
    }
    
    public var body: some View {
        ZStack {
            Color.black.opacity(0.95).ignoresSafeArea()
            
            VStack(alignment: .leading, spacing: 14) {
                // Header Search Input
                HStack(spacing: 12) {
                    HStack {
                        Image(systemName: "magnifyingglass")
                            .foregroundColor(AppColors.primaryRed)
                        TextField("Tìm phim, diễn viên (vd: Mai)...", text: $query)
                            .foregroundColor(.white)
                        if !query.isEmpty {
                            Button(action: { query = "" }) {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundColor(.gray)
                            }
                        }
                    }
                    .padding(10)
                    .background(Color(white: 0.12))
                    .cornerRadius(10)
                    .overlay(RoundedRectangle(cornerRadius: 10).stroke(AppColors.borderDark, lineWidth: 1))
                    
                    Button("Đóng") {
                        isPresented = false
                    }
                    .foregroundColor(AppColors.primaryRed)
                    .font(.system(size: 15, weight: .bold))
                }
                .padding(.horizontal, 16)
                .padding(.top, 16)
                
                // Quick Genre Chips
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(MockData.genres, id: \.self) { genre in
                            Button(action: { selectedGenre = genre }) {
                                Text(genre)
                                    .font(.system(size: 12, weight: selectedGenre == genre ? .bold : .regular))
                                    .foregroundColor(selectedGenre == genre ? .white : AppColors.textSecondary)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(selectedGenre == genre ? AppColors.primaryRed : AppColors.cardDark)
                                    .cornerRadius(16)
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                }
                
                // Realtime Suggestions Results List
                Text(query.isEmpty ? "PHIM ĐỀ XUẤT" : "GỢI Ý TÌM KIẾM (\(filteredMovies.count))")
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(AppColors.textSecondary)
                    .padding(.horizontal, 16)
                
                ScrollView {
                    LazyVStack(spacing: 10) {
                        ForEach(filteredMovies) { movie in
                            Button(action: {
                                isPresented = false
                                onSelectMovie(movie)
                            }) {
                                HStack(spacing: 12) {
                                    AsyncImage(url: URL(string: movie.posterUrl)) { img in
                                        img.resizable().scaledToFill()
                                    } placeholder: {
                                        Rectangle().fill(AppColors.cardDark)
                                    }
                                    .frame(width: 55, height: 80)
                                    .cornerRadius(6)
                                    .clipped()
                                    
                                    VStack(alignment: .leading, spacing: 3) {
                                        Text(movie.title)
                                            .font(.system(size: 15, weight: .bold))
                                            .foregroundColor(.white)
                                        if let orig = movie.originalTitle {
                                            Text(orig)
                                                .font(.system(size: 12))
                                                .foregroundColor(.gray)
                                        }
                                        HStack(spacing: 6) {
                                            Text("⭐ \(String(format: "%.1f", movie.rating))")
                                                .font(.system(size: 11, weight: .bold))
                                                .foregroundColor(AppColors.gold)
                                            Text("•  \(String(movie.releaseYear))  •  \(movie.country)")
                                                .font(.system(size: 11))
                                                .foregroundColor(AppColors.textSecondary)
                                        }
                                        Text(movie.genres.joined(separator: ", "))
                                            .font(.system(size: 11))
                                            .foregroundColor(.gray)
                                            .lineLimit(1)
                                    }
                                    
                                    Spacer()
                                    
                                    Image(systemName: "play.circle.fill")
                                        .font(.system(size: 28))
                                        .foregroundColor(AppColors.primaryRed)
                                }
                                .padding(10)
                                .background(AppColors.cardDark)
                                .cornerRadius(10)
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 30)
                }
            }
        }
    }
}