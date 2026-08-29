import Foundation

public struct UserAccount: Codable {
    public var name: String
    public var email: String
    public var avatarUrl: String
    public var planTier: String
    public var isVip: Bool
    
    public static let sample = UserAccount(
        name: "Nguyễn Văn A",
        email: "user@netflix-cinema.vn",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
        planTier: "VIP Cinema 4K",
        isVip: true
    )
}