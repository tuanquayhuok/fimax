import Foundation

public struct MovieFilterCriteria {
    public var query: String = ""
    public var genre: String = "Tất cả"
    public var country: String = "Tất cả"
    public var releaseYear: String = "Tất cả"
    public var minRating: Double? = nil
    public var sortOption: SortOption = .latest
    
    public enum SortOption: String, CaseIterable, Identifiable {
        case latest = "Mới nhất"
        case mostViewed = "Xem nhiều nhất"
        case topRated = "Đánh giá cao"
        
        public var id: String { rawValue }
        public var apiParam: String {
            switch self {
            case .latest: return "latest"
            case .mostViewed: return "views"
            case .topRated: return "rating"
            }
        }
    }
    
    public init() {}
}