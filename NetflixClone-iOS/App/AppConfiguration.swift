import Foundation
import Combine

/// Quản lý cấu hình động API Base URL và Webhook Callback URL
public final class AppConfiguration: ObservableObject {
    public static let shared = AppConfiguration()
    
    private let apiBaseUrlKey = "kAppApiBaseUrl"
    private let callbackUrlKey = "kAppCallbackWebhookUrl"
    private let isDarkModeKey = "kAppIsDarkMode"
    private let defaultQualityKey = "kAppDefaultQuality"
    
    @Published public var apiBaseUrl: String {
        didSet { UserDefaults.standard.set(apiBaseUrl, forKey: apiBaseUrlKey) }
    }
    
    @Published public var callbackUrl: String {
        didSet { UserDefaults.standard.set(callbackUrl, forKey: callbackUrlKey) }
    }
    
    @Published public var isDarkMode: Bool {
        didSet { UserDefaults.standard.set(isDarkMode, forKey: isDarkModeKey) }
    }
    
    @Published public var defaultQuality: String {
        didSet { UserDefaults.standard.set(defaultQuality, forKey: defaultQualityKey) }
    }
    
    private init() {
        self.apiBaseUrl = UserDefaults.standard.string(forKey: apiBaseUrlKey) ?? "http://localhost:4000/api"
        self.callbackUrl = UserDefaults.standard.string(forKey: callbackUrlKey) ?? "http://localhost:4000/api/callback/progress"
        self.isDarkMode = UserDefaults.standard.object(forKey: isDarkModeKey) != nil ? UserDefaults.standard.bool(forKey: isDarkModeKey) : true
        self.defaultQuality = UserDefaults.standard.string(forKey: defaultQualityKey) ?? "1080p"
    }
}