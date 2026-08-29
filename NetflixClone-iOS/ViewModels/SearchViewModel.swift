import Foundation
import Combine

@MainActor
public final class SearchViewModel: ObservableObject {
    @Published public var query: String = ""
    @Published public var filterCriteria = MovieFilterCriteria()
    @Published public var searchResults: [Movie] = []
    @Published public var isLoading: Bool = false
    
    public init() {
        performSearch()
    }
    
    public func performSearch() {
        var results = MockData.sampleMovies
        
        if !query.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            let q = query.lowercased()
            results = results.filter { movie in
                movie.title.lowercased().contains(q) ||
                (movie.director?.lowercased().contains(q) ?? false) ||
                (movie.cast?.contains(where: { $0.name.lowercased().contains(q) }) ?? false)
            }
        }
        
        if filterCriteria.genre != "Tất cả" && !filterCriteria.genre.isEmpty {
            results = results.filter { $0.genres.contains(filterCriteria.genre) }
        }
        
        if filterCriteria.country != "Tất cả" && !filterCriteria.country.isEmpty {
            results = results.filter { $0.country == filterCriteria.country }
        }
        
        if let minRating = filterCriteria.minRating {
            results = results.filter { $0.rating >= minRating }
        }
        
        switch filterCriteria.sortOption {
        case .latest:
            results.sort(by: { $0.releaseYear > $1.releaseYear })
        case .mostViewed:
            results.sort(by: { ($0.viewCount ?? 0) > ($1.viewCount ?? 0) })
        case .topRated:
            results.sort(by: { $0.rating > $1.rating })
        }
        
        self.searchResults = results
    }
}