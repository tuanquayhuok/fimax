import Foundation

public struct CastMember: Identifiable, Codable, Hashable {
    public var id: String { name }
    public let name: String
    public let role: String
    public let avatar: String?
}

public struct SubtitleOption: Identifiable, Codable, Hashable {
    public var id: String { code }
    public let language: String
    public let code: String
    public let label: String
}

public struct AudioOption: Identifiable, Codable, Hashable {
    public var id: String { code }
    public let language: String
    public let code: String
    public let label: String
}

public struct Movie: Identifiable, Codable, Hashable {
    public let id: String
    public let title: String
    public let originalTitle: String?
    public let rating: Double
    public let releaseYear: Int
    public let duration: String
    public let durationSeconds: Double
    public let country: String
    public let ageRating: String?
    public let isFeatured: Bool?
    public let isHot: Bool?
    public let isNew: Bool?
    public let isTrending: Bool?
    public let isUpcoming: Bool?
    public let viewCount: Int?
    public let genres: [String]
    public let director: String?
    public let cast: [CastMember]?
    public let overview: String
    public let backdropUrl: String
    public let posterUrl: String
    public let trailerUrl: String?
    public let videoSources: [String: String]? // "1080p", "720p", "360p", "auto"
    public let subtitles: [SubtitleOption]?
    public let audioTracks: [AudioOption]?
    
    public init(
        id: String,
        title: String,
        originalTitle: String? = nil,
        rating: Double,
        releaseYear: Int,
        duration: String,
        durationSeconds: Double = 7200,
        country: String,
        ageRating: String? = "16+",
        isFeatured: Bool? = false,
        isHot: Bool? = false,
        isNew: Bool? = false,
        isTrending: Bool? = false,
        isUpcoming: Bool? = false,
        viewCount: Int? = 100000,
        genres: [String],
        director: String? = nil,
        cast: [CastMember]? = nil,
        overview: String,
        backdropUrl: String,
        posterUrl: String,
        trailerUrl: String? = nil,
        videoSources: [String: String]? = nil,
        subtitles: [SubtitleOption]? = nil,
        audioTracks: [AudioOption]? = nil
    ) {
        self.id = id
        self.title = title
        self.originalTitle = originalTitle
        self.rating = rating
        self.releaseYear = releaseYear
        self.duration = duration
        self.durationSeconds = durationSeconds
        self.country = country
        self.ageRating = ageRating
        self.isFeatured = isFeatured
        self.isHot = isHot
        self.isNew = isNew
        self.isTrending = isTrending
        self.isUpcoming = isUpcoming
        self.viewCount = viewCount
        self.genres = genres
        self.director = director
        self.cast = cast
        self.overview = overview
        self.backdropUrl = backdropUrl
        self.posterUrl = posterUrl
        self.trailerUrl = trailerUrl
        self.videoSources = videoSources
        self.subtitles = subtitles
        self.audioTracks = audioTracks
    }
}