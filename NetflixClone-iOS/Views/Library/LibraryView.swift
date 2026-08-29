import SwiftUI

public struct LibraryView: View {
    @EnvironmentObject private var libraryVM: LibraryViewModel
    @State private var selectedTab = 0 // 0: Yêu thích, 1: Đang xem, 2: Lịch sử
    @State private var selectedMovie: Movie?
    
    private let columns = [
        GridItem(.flexible(), spacing: 10),
        GridItem(.flexible(), spacing: 10),
        GridItem(.flexible(), spacing: 10)
    ]
    
    public var body: some View {
        NavigationView {
            ZStack {
                AppColors.backgroundDark.ignoresSafeArea()
                
                VStack(alignment: .leading, spacing: 12) {
                    Text("Thư Viện Của Tôi")
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(AppColors.textPrimary)
                        .padding(.horizontal, 16)
                    
                    // Segmented Tabs
                    Picker("Thư viện", selection: $selectedTab) {
                        Text("Yêu thích (\(libraryVM.favorites.count))").tag(0)
                        Text("Đang xem (\(libraryVM.continueWatching.count))").tag(1)
                        Text("Lịch sử").tag(2)
                    }
                    .pickerStyle(SegmentedPickerStyle())
                    .padding(.horizontal, 16)
                    
                    if selectedTab == 0 {
                        // Favorites Grid
                        let favMovies = MockData.sampleMovies.filter { libraryVM.favorites.contains($0.id) }
                        ScrollView {
                            LazyVGrid(columns: columns, spacing: 12) {
                                ForEach(favMovies) { movie in
                                    Button(action: { selectedMovie = movie }) {
                                        VStack(alignment: .leading, spacing: 4) {
                                            AsyncImage(url: URL(string: movie.posterUrl)) { img in
                                                img.resizable().scaledToFill()
                                            } placeholder: {
                                                Rectangle().fill(AppColors.cardDark)
                                            }
                                            .frame(height: 160)
                                            .cornerRadius(6)
                                            .clipped()
                                            
                                            Text(movie.title)
                                                .font(.system(size: 12, weight: .semibold))
                                                .foregroundColor(.white)
                                                .lineLimit(1)
                                        }
                                    }
                                }
                            }
                            .padding(12)
                        }
                    } else if selectedTab == 1 {
                        // Continue Watching List
                        ScrollView {
                            VStack(spacing: 12) {
                                ForEach(libraryVM.continueWatching) { item in
                                    if let movie = MockData.sampleMovies.first(where: { $0.id == item.movieId }) {
                                        HStack(spacing: 12) {
                                            AsyncImage(url: URL(string: movie.backdropUrl)) { img in
                                                img.resizable().scaledToFill()
                                            } placeholder: {
                                                Rectangle().fill(AppColors.cardDark)
                                            }
                                            .frame(width: 100, height: 65)
                                            .cornerRadius(6)
                                            .clipped()
                                            
                                            VStack(alignment: .leading, spacing: 4) {
                                                Text(movie.title)
                                                    .font(.system(size: 14, weight: .bold))
                                                    .foregroundColor(.white)
                                                Text("Đã xem: \(item.percentage)%")
                                                    .font(.system(size: 12))
                                                    .foregroundColor(AppColors.textSecondary)
                                                
                                                ProgressView(value: Double(item.percentage), total: 100.0)
                                                    .accentColor(AppColors.primaryRed)
                                            }
                                            Spacer()
                                        }
                                        .padding(10)
                                        .background(AppColors.cardDark)
                                        .cornerRadius(8)
                                    }
                                }
                            }
                            .padding(16)
                        }
                    } else {
                        // History list
                        VStack {
                            Spacer()
                            Text("Lịch sử xem gần đây được lưu an toàn trên máy")
                                .foregroundColor(AppColors.textSecondary)
                                .font(.system(size: 13))
                            Button("Xóa toàn bộ lịch sử") {
                                libraryVM.clearHistory()
                            }
                            .foregroundColor(AppColors.primaryRed)
                            .padding(.top, 8)
                            Spacer()
                        }
                    }
                }
            }
            .navigationBarHidden(true)
            .sheet(item: $selectedMovie) { movie in
                MovieDetailView(movie: movie, onPlayNow: { _ in })
            }
        }
    }
}