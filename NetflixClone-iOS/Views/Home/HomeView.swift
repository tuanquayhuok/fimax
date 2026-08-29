import SwiftUI

public struct HomeView: View {
    @StateObject private var viewModel = HomeViewModel()
    @EnvironmentObject private var appConfig: AppConfiguration
    @State private var showSearchModal = false
    @State private var showNotificationModal = false
    
    public var body: some View {
        ZStack {
            AppColors.backgroundDark.ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Header Bar with FIMAX, Search, Notifications, Avatar
                HStack {
                    HStack(spacing: 0) {
                        Text("F").font(.system(size: 26, weight: .black)).foregroundColor(AppColors.primaryRed)
                        Text("IMAX").font(.system(size: 22, weight: .black)).foregroundColor(.white)
                    }
                    Spacer()
                    HStack(spacing: 12) {
                        Button(action: { showSearchModal = true }) {
                            Image(systemName: "magnifyingglass")
                                .font(.system(size: 18))
                                .foregroundColor(.white)
                                .padding(8)
                                .background(AppColors.surface)
                                .clipShape(Circle())
                        }
                        
                        Button(action: { showNotificationModal = true }) {
                            Image(systemName: "bell")
                                .font(.system(size: 18))
                                .foregroundColor(.white)
                                .padding(8)
                                .background(AppColors.surface)
                                .clipShape(Circle())
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(AppColors.backgroundDark.opacity(0.95))
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        // Hero Banner Carousel
                        if let hero = viewModel.heroMovie {
                            HeroBannerView(movie: hero)
                        }
                        
                        // Cinema Rows
                        ForEach(viewModel.sections) { section in
                            MovieSectionRow(title: section.title, movies: section.movies)
                        }
                    }
                    .padding(.bottom, 30)
                }
            }
        }
        .sheet(isPresented: $showSearchModal) {
            SearchModalView()
        }
    }
}