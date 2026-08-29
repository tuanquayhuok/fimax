import Foundation
import Combine

public class AuthViewModel: ObservableObject {
    @Published public var currentUser: UserAccount? = nil
    
    public init() {}
    
    public func login(email: String, password: String) -> Bool {
        let user = UserAccount(
            id: "usr_\(Int(Date().timeIntervalSince1970))",
            name: email.components(separatedBy: "@").first ?? "Thành viên FIMAX",
            email: email,
            avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
            planTier: "Thành viên Tiêu chuẩn",
            isVip: false
        )
        self.currentUser = user
        return true
    }
    
    public func register(name: String, email: String, password: String) -> Bool {
        let user = UserAccount(
            id: "usr_\(Int(Date().timeIntervalSince1970))",
            name: name.isEmpty ? "Thành viên Mới" : name,
            email: email,
            avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
            planTier: "Thành viên Tiêu chuẩn",
            isVip: false
        )
        self.currentUser = user
        return true
    }
    
    public func loginWithSocial(provider: String) {
        let user = UserAccount(
            id: "usr_\(provider.lowercased())_\(Int(Date().timeIntervalSince1970))",
            name: provider == "Apple" ? "Người dùng Apple" : "Người dùng Google",
            email: "\(provider.lowercased())_user@fimax.vn",
            avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
            planTier: "Thành viên Tiêu chuẩn",
            isVip: false
        )
        self.currentUser = user
    }
    
    public func logout() {
        self.currentUser = nil
    }
}