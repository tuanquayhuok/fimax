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
            
            LibraryView()
                .tabItem {
                    Label("Thư Viện", systemImage: "square.stack.3d.down.right.fill")
                }
                .tag(1)
            
            ProfileView()
                .tabItem {
                    Label("Tài Khoản", systemImage: "person.fill")
                }
                .tag(2)
        }
        .accentColor(AppColors.primaryRed)
    }
}