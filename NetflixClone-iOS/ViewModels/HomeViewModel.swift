import Foundation
import Combine

public struct HomeSection: Identifiable {
    public let id: String
    public let title: String
    public let items: [Movie]
}

@MainActor
public final class HomeViewModel: ObservableObject {
    @Published public var heroBanner: Movie?
    @Published public var sections: [HomeSection] = []
    @Published public var genres: [String] = MockData.genres
    @Published public var countries: [String] = MockData.countries
    @Published public var isLoading: Bool = false
    
    public init() {
        loadHomeFeed()
    }
    
    public func loadHomeFeed() {
        isLoading = true
        // Try network or fallback to MockData
        let movies = MockData.sampleMovies
        self.heroBanner = movies.first(where: { $0.isFeatured == true }) ?? movies.first
        
        self.sections = [
            HomeSection(id: "sec_new", title: "Phim Mới Cập Nhật", items: movies.filter { $0.isNew == true }),
            HomeSection(id: "sec_hot", title: "Phim Đang Hot 🔥", items: movies.filter { $0.isHot == true }),
            HomeSection(id: "sec_views", title: "Phim Được Xem Nhiều Nhất", items: movies.sorted(by: { ($0.viewCount ?? 0) > ($1.viewCount ?? 0) })),
            HomeSection(id: "sec_top", title: "Phim Đánh Giá Cao ⭐", items: movies.sorted(by: { $0.rating > $1.rating })),
            HomeSection(id: "sec_upcoming", title: "Phim Sắp Ra Mắt ⏳", items: movies.filter { $0.isUpcoming == true }.isEmpty ? Array(movies.prefix(2)) : movies.filter { $0.isUpcoming == true })
        ]
        isLoading = false
    }
}