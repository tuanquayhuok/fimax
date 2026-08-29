import Foundation

public struct PlaybackProgress: Identifiable, Codable {
    public var id: String { movieId }
    public let movieId: String
    public var currentTime: Double
    public var duration: Double
    public var percentage: Int
    public var lastUpdated: Date
    
    public init(movieId: String, currentTime: Double, duration: Double, percentage: Int, lastUpdated: Date = Date()) {
        self.movieId = movieId
        self.currentTime = currentTime
        self.duration = duration
        self.percentage = percentage
        self.lastUpdated = lastUpdated
    }
}