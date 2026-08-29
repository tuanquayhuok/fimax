import SwiftUI

public struct HeaderBarView: View {
    @EnvironmentObject private var authVM: AuthViewModel
    @State private var showNotifications = false
    public let onSearchTap: () -> Void
    public let onProfileTap: () -> Void
    
    public var body: some View {
        HStack {
            // FIMAX Brand
            HStack(spacing: 0) {
                Text("F")
                    .font(.system(size: 24, weight: .black))
                    .foregroundColor(AppColors.primaryRed)
                Text("IMAX")
                    .font(.system(size: 20, weight: .black))
                    .foregroundColor(.white)
            }
            
            Spacer()
            
            // Minimal Actions
            HStack(spacing: 14) {
                Button(action: onSearchTap) {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.white)
                        .frame(width: 34, height: 34)
                        .background(Color.white.opacity(0.08))
                        .clipShape(Circle())
                }
                
                Button(action: { showNotifications = true }) {
                    ZStack(alignment: .topTrailing) {
                        Image(systemName: "bell")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                            .frame(width: 34, height: 34)
                            .background(Color.white.opacity(0.08))
                            .clipShape(Circle())
                        
                        Circle()
                            .fill(AppColors.primaryRed)
                            .frame(width: 6, height: 6)
                            .offset(x: -6, y: 6)
                    }
                }
                
                Button(action: onProfileTap) {
                    if let user = authVM.currentUser {
                        AsyncImage(url: URL(string: user.avatarUrl)) { img in
                            img.resizable().scaledToFill()
                        } placeholder: {
                            Circle().fill(Color(white: 0.2))
                        }
                        .frame(width: 32, height: 32)
                        .clipShape(Circle())
                    } else {
                        Image(systemName: "person.fill")
                            .font(.system(size: 14))
                            .foregroundColor(.white)
                            .frame(width: 32, height: 32)
                            .background(Color.white.opacity(0.12))
                            .clipShape(Circle())
                    }
                }
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 10)
        .background(Color.black)
    }
}