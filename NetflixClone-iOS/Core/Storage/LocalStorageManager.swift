import Foundation

public final class LocalStorageManager {
    public static let shared = LocalStorageManager()
    
    private let favoritesKey = "kLocalUserFavorites"
    private let continueWatchingKey = "kLocalContinueWatching"
    private let watchHistoryKey = "kLocalWatchHistory"
    
    private init() {}
    
    public func getFavorites() -> [String] {
        return UserDefaults.standard.stringArray(forKey: favoritesKey) ?? ["mov_1", "mov_3"]
    }
    
    public func saveFavorites(_ list: [String]) {
        UserDefaults.standard.set(list, forKey: favoritesKey)
    }
    
    public func getContinueWatching() -> [PlaybackProgress] {
        guard let data = UserDefaults.standard.data(forKey: continueWatchingKey),
              let list = try? JSONDecoder().decode([PlaybackProgress].self, from: data) else {
            return [
                PlaybackProgress(movieId: "mov_1", currentTime: 1840, duration: 7860, percentage: 23, lastUpdated: Date()),
                PlaybackProgress(movieId: "mov_3", currentTime: 4650, duration: 9300, percentage: 50, lastUpdated: Date())
            ]
        }
        return list
    }
    
    public func saveContinueWatching(_ list: [PlaybackProgress]) {
        if let data = try? JSONEncoder().encode(list) {
            UserDefaults.standard.set(data, forKey: continueWatchingKey)
        }
    }
    
    public func clearAllHistory() {
        UserDefaults.standard.removeObject(forKey: continueWatchingKey)
        UserDefaults.standard.removeObject(forKey: watchHistoryKey)
    }
}