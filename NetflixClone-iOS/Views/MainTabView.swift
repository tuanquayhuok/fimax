import SwiftUI

public struct MainTabView: View {
    @State private var selectedTab = 0
    
    public var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Label("Trang Chủ", systemImage: "house.fill")
                }
                .tag(0)
            
            ExploreView()
                .tabItem {
                    Label("Khám Phá", systemImage: "flame.fill")
                }
                .tag(1)
            
            LibraryView()
                .tabItem {
                    Label("Thư Viện", systemImage: "square.stack.3d.down.right.fill")
                }
                .tag(2)
            
            DownloadView()
                .tabItem {
                    Label("Tải Xuống", systemImage: "arrow.down.circle.fill")
                }
                .tag(3)
            
            ProfileView()
                .tabItem {
                    Label("Tài Khoản", systemImage: "person.fill")
                }
                .tag(4)
        }
        .accentColor(AppColors.primaryRed)
    }
}