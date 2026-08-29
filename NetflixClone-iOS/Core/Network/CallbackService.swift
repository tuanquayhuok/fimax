import Foundation

public final class CallbackService {
    public static let shared = CallbackService()
    
    private init() {}
    
    /// Gửi sự kiện callback / webhook tiến độ xem phim về server
    public func sendPlaybackProgress(
        callbackUrlString: String,
        movieId: String,
        movieTitle: String,
        userId: String,
        currentTime: Double,
        duration: Double,
        quality: String,
        isCompleted: Bool
    ) {
        guard let url = URL(string: callbackUrlString) else { return }
        
        let percentage = duration > 0 ? Int(round((currentTime / duration) * 100)) : 0
        let payload: [String: Any] = [
            "event": isCompleted ? "movie_completed" : "playback_progress",
            "movieId": movieId,
            "movieTitle": movieTitle,
            "userId": userId,
            "currentTime": currentTime,
            "duration": duration,
            "percentage": percentage,
            "quality": quality,
            "isCompleted": isCompleted,
            "timestamp": ISO8601DateFormatter().string(from: Date())
        ]
        
        guard let bodyData = try? JSONSerialization.data(withJSONObject: payload) else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = bodyData
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("[CALLBACK SEND ERROR]:", error.localizedDescription)
            } else if let httpResponse = response as? HTTPURLResponse {
                print("[CALLBACK SENT SUCCESS]: HTTP", httpResponse.statusCode, "Movie:", movieTitle, "Progress:", "\(percentage)%")
            }
        }.resume()
    }
}