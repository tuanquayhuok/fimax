import SwiftUI

public struct HeroBannerView: View {
    public let featuredMovies: [Movie]
    public let onPlay: (Movie) -> Void
    public let onDetail: (Movie) -> Void
    @EnvironmentObject private var libraryVM: LibraryViewModel
    @State private var currentIndex = 0
    
    public var body: some View {
        VStack(spacing: 8) {
            TabView(selection: $currentIndex) {
                ForEach(Array(featuredMovies.enumerated()), id: \.offset) { index, movie in
                    ZStack(alignment: .bottom) {
                        AsyncImage(url: URL(string: movie.backdropUrl)) { image in
                            image.resizable().scaledToFill()
                        } placeholder: {
                            Rectangle().fill(AppColors.surface)
                        }
                        .frame(height: 460)
                        .clipped()
                        
                        LinearGradient(
                            colors: [Color.clear, Color.black.opacity(0.6), Color.black],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                        .frame(height: 220)
                        
                        VStack(alignment: .leading, spacing: 6) {
                            HStack(spacing: 6) {
                                Text("4K HDR")
                                    .font(.system(size: 9, weight: .bold))
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(Color.white.opacity(0.16))
                                    .cornerRadius(4)
                                
                                Text("\(String(movie.releaseYear))  •  \(movie.duration)  •  \(movie.country)")
                                    .font(.system(size: 12))
                                    .foregroundColor(AppColors.textSecondary)
                            }
                            
                            Text(movie.title)
                                .font(.system(size: 30, weight: .heavy))
                                .foregroundColor(.white)
                            
                            Text(movie.genres.joined(separator: "  /  "))
                                .font(.system(size: 12))
                                .foregroundColor(AppColors.textSecondary)
                                .padding(.bottom, 10)
                            
                            HStack(spacing: 12) {
                                Button(action: { onPlay(movie) }) {
                                    HStack(spacing: 6) {
                                        Image(systemName: "play.fill")
                                        Text("Xem Phim").fontWeight(.bold)
                                    }
                                    .foregroundColor(.black)
                                    .padding(.vertical, 11)
                                    .frame(maxWidth: .infinity)
                                    .background(Color.white)
                                    .cornerRadius(8)
                                }
                                
                                Button(action: { libraryVM.toggleFavorite(movieId: movie.id) }) {
                                    let isFav = libraryVM.isFavorite(movieId: movie.id)
                                    HStack(spacing: 4) {
                                        Image(systemName: isFav ? "checkmark" : "plus")
                                        Text(isFav ? "Đã lưu" : "Danh sách")
                                    }
                                    .foregroundColor(.white)
                                    .padding(.vertical, 11)
                                    .frame(maxWidth: .infinity)
                                    .background(Color.white.opacity(0.12))
                                    .cornerRadius(8)
                                }
                                
                                Button(action: { onDetail(movie) }) {
                                    Image(systemName: "info.circle")
                                        .font(.system(size: 20))
                                        .foregroundColor(.white)
                                        .frame(width: 42, height: 42)
                                        .background(Color.white.opacity(0.12))
                                        .cornerRadius(8)
                                }
                            }
                        }
                        .padding(.horizontal, 20)
                        .padding(.bottom, 24)
                    }
                    .tag(index)
                }
            }
            .tabViewStyle(PageTabViewStyle(indexDisplayMode: .automatic))
            .frame(height: 460)
        }
    }
}