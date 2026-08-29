import SwiftUI

public struct SearchView: View {
    @StateObject private var viewModel = SearchViewModel()
    @State private var showFilterSheet = false
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
                
                VStack(spacing: 10) {
                    // Search Bar
                    HStack {
                        HStack {
                            Image(systemName: "magnifyingglass")
                                .foregroundColor(.gray)
                            TextField("Tìm tên phim, diễn viên, đạo diễn...", text: $viewModel.query)
                                .foregroundColor(.white)
                                .onChange(of: viewModel.query) { _ in viewModel.performSearch() }
                            if !viewModel.query.isEmpty {
                                Button(action: { viewModel.query = ""; viewModel.performSearch() }) {
                                    Image(systemName: "xmark.circle.fill")
                                        .foregroundColor(.gray)
                                }
                            }
                        }
                        .padding(10)
                        .background(AppColors.cardDark)
                        .cornerRadius(8)
                        
                        Button(action: { showFilterSheet = true }) {
                            Image(systemName: "line.3.horizontal.decrease.circle")
                                .font(.system(size: 24))
                                .foregroundColor(.white)
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 10)
                    
                    // Results Grid
                    ScrollView {
                        LazyVGrid(columns: columns, spacing: 12) {
                            ForEach(viewModel.searchResults) { movie in
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
                }
            }
            .navigationBarHidden(true)
            .sheet(isPresented: $showFilterSheet, onDismiss: { viewModel.performSearch() }) {
                FilterModalView(filterCriteria: $viewModel.filterCriteria)
            }
            .sheet(item: $selectedMovie) { movie in
                MovieDetailView(movie: movie, onPlayNow: { _ in })
            }
        }
    }
}