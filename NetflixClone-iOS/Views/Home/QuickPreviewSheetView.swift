import SwiftUI

public struct QuickPreviewSheetView: View {
    let movie: Movie
    let onPlay: () -> Void
    let onDetail: () -> Void
    @Environment(\.presentationMode) private var presentationMode
    @EnvironmentObject private var libraryVM: LibraryViewModel
    
    public var body: some View {
        ZStack {
            AppColors.backgroundDark.ignoresSafeArea()
            
            VStack(alignment: .leading, spacing: 14) {
                // Media Backdrop with Play Overlay
                ZStack(alignment: .center) {
                    AsyncImage(url: URL(string: movie.backdropUrl)) { img in
                        img.resizable().scaledToFill()
                    } placeholder: {
                        Rectangle().fill(Color(white: 0.15))
                    }
                    .frame(height: 190)
                    .clipped()
                    
                    Circle()
                        .fill(AppColors.primaryRed)
                        .frame(width: 52, height: 52)
                        .overlay(Image(systemName: "play.fill").foregroundColor(.white).font(.system(size: 22)))
                }
                .cornerRadius(14)
                .onTapGesture {
                    presentationMode.wrappedValue.dismiss()
                    onPlay()
                }
                
                // Title & Metadata
                VStack(alignment: .leading, spacing: 6) {
                    Text(movie.title)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.white)
                    
                    HStack(spacing: 8) {
                        Text("4K HDR")
                            .font(.system(size: 9, weight: .bold))
                            .foregroundColor(AppColors.gold)
                            .padding(.horizontal, 5)
                            .padding(.vertical, 2)
                            .overlay(RoundedRectangle(cornerRadius: 3).stroke(AppColors.gold, lineWidth: 1))
                        Text("⭐ \(String(format: "%.1f", movie.rating))")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(AppColors.gold)
                        Text("•").foregroundColor(.gray)
                        Text("\(movie.releaseYear)").font(.system(size: 12)).foregroundColor(.gray)
                        Text("•").foregroundColor(.gray)
                        Text(movie.duration).font(.system(size: 12)).foregroundColor(.gray)
                    }
                    
                    Text(movie.overview)
                        .font(.system(size: 12))
                        .foregroundColor(AppColors.textSecondary)
                        .lineLimit(2)
                        .padding(.top, 2)
                }
                
                // Action Buttons
                Button(action: {
                    presentationMode.wrappedValue.dismiss()
                    onPlay()
                }) {
                    HStack {
                        Image(systemName: "play.fill")
                        Text("XEM PHIM NGAY")
                    }
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(AppColors.primaryRed)
                    .cornerRadius(10)
                }
                
                // Quick Icons Row
                HStack {
                    Spacer()
                    Button(action: { libraryVM.toggleFavorite(movieId: movie.id) }) {
                        VStack(spacing: 4) {
                            Image(systemName: libraryVM.isFavorite(movieId: movie.id) ? "heart.fill" : "heart")
                                .foregroundColor(libraryVM.isFavorite(movieId: movie.id) ? AppColors.primaryRed : .white)
                            Text("Yêu Thích").font(.system(size: 10)).foregroundColor(.gray)
                        }
                    }
                    Spacer()
                    Button(action: {
                        presentationMode.wrappedValue.dismiss()
                        onDetail()
                    }) {
                        VStack(spacing: 4) {
                            Image(systemName: "info.circle").foregroundColor(.white)
                            Text("Chi Tiết").font(.system(size: 10)).foregroundColor(.gray)
                        }
                    }
                    Spacer()
                }
                .padding(.top, 4)
            }
            .padding(18)
            .background(AppColors.surface)
            .cornerRadius(20)
            .padding(16)
        }
    }
}