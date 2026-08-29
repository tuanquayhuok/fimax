import SwiftUI

@main
struct NetflixCloneApp: App {
    @StateObject private var appConfig = AppConfiguration.shared
    @StateObject private var authViewModel = AuthViewModel()
    @StateObject private var libraryViewModel = LibraryViewModel()
    @State private var isShowingSplash = true
    
    var body: some Scene {
        WindowGroup {
            ZStack {
                MainTabView()
                    .environmentObject(appConfig)
                    .environmentObject(authViewModel)
                    .environmentObject(libraryViewModel)
                
                if isShowingSplash {
                    FIMAXSplashScreenView(onFinished: {
                        withAnimation(.easeInOut(duration: 0.4)) {
                            isShowingSplash = false
                        }
                    })
                    .transition(.opacity)
                    .zIndex(1)
                }
            }
            .preferredColorScheme(appConfig.isDarkMode ? .dark : .light)
        }
    }
}

public struct FIMAXSplashScreenView: View {
    public let onFinished: () -> Void
    @State private var opacity: Double = 0.0
    @State private var scale: CGFloat = 0.94
    @State private var lineWidth: CGFloat = 0.0
    
    public var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            VStack(spacing: 8) {
                HStack(spacing: 0) {
                    Text("F")
                        .font(.system(size: 48, weight: .black))
                        .foregroundColor(AppColors.primaryRed)
                    Text("IMAX")
                        .font(.system(size: 40, weight: .black))
                        .foregroundColor(.white)
                }
                
                Rectangle()
                    .fill(AppColors.primaryRed)
                    .frame(width: lineWidth, height: 1.5)
                
                Text("CINEMA")
                    .font(.system(size: 10, weight: .semibold))
                    .foregroundColor(AppColors.textSecondary)
                    .tracking(6)
            }
            .opacity(opacity)
            .scaleEffect(scale)
        }
        .onAppear {
            withAnimation(.easeOut(duration: 0.8)) {
                opacity = 1.0
                scale = 1.0
            }
            withAnimation(.easeInOut(duration: 1.2).delay(0.2)) {
                lineWidth = 100
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.2) {
                onFinished()
            }
        }
    }
}