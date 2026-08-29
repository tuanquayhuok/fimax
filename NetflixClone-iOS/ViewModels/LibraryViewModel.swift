import Foundation
import Combine

@MainActor
public final class LibraryViewModel: ObservableObject {
    @Published public var favorites: [String] = []
    @Published public var continueWatching: [PlaybackProgress] = []
    
    public init() {
        self.favorites = LocalStorageManager.shared.getFavorites()
        self.continueWatching = LocalStorageManager.shared.getContinueWatching()
    }
    
    public func isFavorite(movieId: String) -> Bool {
        favorites.contains(movieId)
    }
    
    public func toggleFavorite(movieId: String) {
        if isFavorite(movieId: movieId) {
            favorites.removeAll(where: { $0 == movieId })
        } else {
            favorites.append(movieId)
        }
        LocalStorageManager.shared.saveFavorites(favorites)
    }
    
    public func updateProgress(movieId: String, currentTime: Double, duration: Double) {
        let percentage = duration > 0 ? Int(round((currentTime / duration) * 100)) : 0
        continueWatching.removeAll(where: { $0.movieId == movieId })
        if percentage < 95 {
            continueWatching.insert(PlaybackProgress(movieId: movieId, currentTime: currentTime, duration: duration, percentage: percentage), at: 0)
        }
        LocalStorageManager.shared.saveContinueWatching(continueWatching)
    }
    
    public func clearHistory() {
        continueWatching.removeAll()
        LocalStorageManager.shared.clearAllHistory()
    }
}