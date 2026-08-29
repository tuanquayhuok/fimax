import Foundation

public final class NetworkManager {
    public static let shared = NetworkManager()
    private let session: URLSession
    
    private init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 15
        self.session = URLSession(configuration: config)
    }
    
    public func request<T: Decodable>(_ endpoint: APIEndpoint, baseURL: String) async throws -> T {
        guard let urlRequest = endpoint.urlRequest(baseURLString: baseURL) else {
            throw URLError(.badURL)
        }
        
        let (data, response) = try await session.data(for: urlRequest)
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            throw URLError(.badServerResponse)
        }
        
        let decoder = JSONDecoder()
        return try decoder.decode(T.self, from: data)
    }
}