import SwiftUI

public struct MovieDetailView: View {
    public let movie: Movie
    public let onPlayNow: (Movie) -> Void
    @Environment(\.presentationMode) private var presentationMode
    @EnvironmentObject private var libraryVM: LibraryViewModel
    @State private var showRatingDialog = false
    @State private var showTrailerModal = false
    
    public var body: some View {
        ZStack {
            AppColors.backgroundDark.ignoresSafeArea()
            
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 14) {
                    // 1. Header Media (Backdrop + Floating Poster)
                    ZStack(alignment: .bottomLeading) {
                        AsyncImage(url: URL(string: movie.backdropUrl)) { img in
                            img.resizable().scaledToFill()
                        } placeholder: {
                            Rectangle().fill(AppColors.cardDark)
                        }
                        .frame(height: 260)
                        .clipped()
                        
                        LinearGradient(colors: [Color.clear, AppColors.backgroundDark], startPoint: .top, endPoint: .bottom)
                            .frame(height: 120)
                        
                        // Poster overlapping
                        AsyncImage(url: URL(string: movie.posterUrl)) { img in
                            img.resizable().scaledToFill()
                        } placeholder: {
                            Rectangle().fill(AppColors.cardAlt)
                        }
                        .frame(width: 105, height: 155)
                        .cornerRadius(8)
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(AppColors.borderDark, lineWidth: 1.5))
                        .padding(.leading, 16)
                        .offset(y: 40)
                    }
                    
                    // Close button
                    .overlay(alignment: .topLeading) {
                        Button(action: { presentationMode.wrappedValue.dismiss() }) {
                            Image(systemName: "chevron.down.circle.fill")
                                .font(.system(size: 30))
                                .foregroundColor(.white.opacity(0.8))
                                .padding(16)
                        }
                    }
                    
                    // 2. Title & Metadata
                    VStack(alignment: .leading, spacing: 6) {
                        Text(movie.title)
                            .font(.system(size: 26, weight: .black))
                            .foregroundColor(AppColors.textPrimary)
                        
                        if let orig = movie.originalTitle {
                            Text(orig)
                                .font(.system(size: 13))
                                .foregroundColor(AppColors.textSecondary)
                        }
                        
                        HStack(spacing: 8) {
                            Text("⭐ \(String(format: "%.1f", movie.rating))")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(AppColors.gold)
                            Text("•  \(String(movie.releaseYear))  •  \(movie.duration)  •  \(movie.country)")
                                .font(.system(size: 13))
                                .foregroundColor(AppColors.textSecondary)
                            if let age = movie.ageRating {
                                Text(age)
                                    .font(.system(size: 11, weight: .bold))
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 1)
                                    .background(Color.gray.opacity(0.4))
                                    .cornerRadius(4)
                            }
                        }
                        .padding(.vertical, 4)
                        
                        // Action Buttons: [▶ XEM PHIM] & [♡ Yêu thích]
                        HStack(spacing: 12) {
                            Button(action: { onPlayNow(movie) }) {
                                HStack(spacing: 8) {
                                    Image(systemName: "play.fill")
                                    Text("XEM PHIM")
                                        .font(.system(size: 16, weight: .bold))
                                }
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 13)
                                .background(AppColors.primaryRed)
                                .foregroundColor(.white)
                                .cornerRadius(8)
                            }
                            
                            Button(action: { libraryVM.toggleFavorite(movieId: movie.id) }) {
                                let isFav = libraryVM.isFavorite(movieId: movie.id)
                                Image(systemName: isFav ? "heart.fill" : "heart")
                                    .font(.system(size: 22))
                                    .foregroundColor(isFav ? AppColors.primaryRed : .white)
                                    .frame(width: 50, height: 50)
                                    .background(AppColors.cardDark)
                                    .cornerRadius(8)
                                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(AppColors.borderDark, lineWidth: 1))
                            }
                        }
                        .padding(.vertical, 8)
                        
                        // Secondary Actions: Trailer, Rating, Share
                        HStack {
                            Button(action: { showTrailerModal = true }) {
                                VStack(spacing: 4) {
                                    Image(systemName: "play.rectangle.on.rectangle")
                                    Text("Trailer").font(.system(size: 11))
                                }
                            }
                            Spacer()
                            Button(action: { showRatingDialog = true }) {
                                VStack(spacing: 4) {
                                    Image(systemName: "star")
                                    Text("Đánh giá").font(.system(size: 11))
                                }
                            }
                            Spacer()
                            Button(action: {}) {
                                VStack(spacing: 4) {
                                    Image(systemName: "square.and.arrow.up")
                                    Text("Chia sẻ").font(.system(size: 11))
                                }
                            }
                        }
                        .foregroundColor(AppColors.textSecondary)
                        .padding(.vertical, 10)
                        .overlay(Rectangle().frame(height: 1).foregroundColor(AppColors.borderDark), alignment: .top)
                        .overlay(Rectangle().frame(height: 1).foregroundColor(AppColors.borderDark), alignment: .bottom)
                        
                        // Overview
                        Text("Nội Dung Phim")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(AppColors.textPrimary)
                            .padding(.top, 8)
                        
                        Text(movie.overview)
                            .font(.system(size: 14))
                            .foregroundColor(Color(white: 0.8))
                            .lineSpacing(4)
                        
                        // Genres
                        Text("Thể Loại")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(AppColors.textPrimary)
                            .padding(.top, 8)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(movie.genres, id: \.self) { genre in
                                    Text(genre)
                                        .font(.system(size: 12))
                                        .foregroundColor(.white)
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 6)
                                        .background(AppColors.cardDark)
                                        .cornerRadius(16)
                                        .overlay(RoundedRectangle(cornerRadius: 16).stroke(AppColors.borderDark, lineWidth: 1))
                                }
                            }
                        }
                        
                        // Cast & Crew
                        if let director = movie.director {
                            Text("Đạo diễn: \(director)")
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(AppColors.textSecondary)
                                .padding(.top, 6)
                        }
                        
                        if let cast = movie.cast, !cast.isEmpty {
                            Text("Diễn Viên")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(AppColors.textPrimary)
                                .padding(.top, 8)
                            
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 12) {
                                    ForEach(cast) { member in
                                        VStack(spacing: 4) {
                                            AsyncImage(url: URL(string: member.avatar ?? "")) { img in
                                                img.resizable().scaledToFill()
                                            } placeholder: {
                                                Circle().fill(Color.gray.opacity(0.3))
                                            }
                                            .frame(width: 60, height: 60)
                                            .clipShape(Circle())
                                            
                                            Text(member.name)
                                                .font(.system(size: 11, weight: .semibold))
                                                .foregroundColor(.white)
                                                .lineLimit(1)
                                            Text(member.role)
                                                .font(.system(size: 10))
                                                .foregroundColor(.gray)
                                                .lineLimit(1)
                                        }
                                        .frame(width: 80)
                                    }
                                }
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 36)
                    
                    Spacer().frame(height: 60)
                }
            }
            
            if showRatingDialog {
                RatingDialogView(movie: movie, onDismiss: { showRatingDialog = false })
            }
            
            if showTrailerModal {
                TrailerPlayerModal(movie: movie, onDismiss: { showTrailerModal = false })
            }
        }
    }
}