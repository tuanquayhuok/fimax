import Foundation
import AVKit
import Combine

@MainActor
public final class PlayerViewModel: ObservableObject {
    @Published public var movie: Movie
    @Published public var player: AVPlayer?
    @Published public var isPlaying: Bool = true
    @Published public var currentTime: Double = 0
    @Published public var duration: Double = 0
    @Published public var selectedQuality: String = "1080p"
    @Published public var playbackSpeed: Float = 1.0
    @Published public var selectedSubtitle: String = "Tiếng Việt"
    @Published public var selectedAudio: String = "Gốc"
    @Published public var isControlsVisible: Bool = true
    
    private var timeObserver: Any?
    
    public init(movie: Movie, initialResumeTime: Double = 0) {
        self.movie = movie
        setupPlayer(initialResumeTime: initialResumeTime)
    }
    
    public func setupPlayer(initialResumeTime: Double = 0) {
        let streamUrlStr = movie.videoSources?[selectedQuality] ?? movie.videoSources?["1080p"] ?? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        guard let url = URL(string: streamUrlStr) else { return }
        
        let playerItem = AVPlayerItem(url: url)
        self.player = AVPlayer(playerItem: playerItem)
        self.duration = movie.durationSeconds
        
        if initialResumeTime > 10 {
            seek(to: initialResumeTime)
        }
        
        player?.play()
        self.isPlaying = true
        
        // Progress tracking
        let interval = CMTime(seconds: 1.0, preferredTimescale: CMTimeScale(NSEC_PER_SEC))
        timeObserver = player?.addPeriodicTimeObserver(forInterval: interval, queue: .main) { [weak self] time in
            guard let self = self else { return }
            self.currentTime = time.seconds
            
            // Periodically sync webhook progress
            if Int(self.currentTime) % 10 == 0 {
                self.syncPlaybackCallback(isCompleted: false)
            }
        }
    }
    
    public func togglePlayPause() {
        if isPlaying {
            player?.pause()
            isPlaying = false
        } else {
            player?.play()
            isPlaying = true
        }
    }
    
    public func seek(to seconds: Double) {
        let targetTime = CMTime(seconds: max(0, min(duration, seconds)), preferredTimescale: 600)
        player?.seek(to: targetTime)
    }
    
    public func skip(seconds: Double) {
        seek(to: currentTime + seconds)
    }
    
    public func setSpeed(_ speed: Float) {
        self.playbackSpeed = speed
        player?.rate = speed
    }
    
    public func changeQuality(_ quality: String) {
        self.selectedQuality = quality
        let currentPos = currentTime
        setupPlayer(initialResumeTime: currentPos)
    }
    
    public func syncPlaybackCallback(isCompleted: Bool) {
        CallbackService.shared.sendPlaybackProgress(
            callbackUrlString: AppConfiguration.shared.callbackUrl,
            movieId: movie.id,
            movieTitle: movie.title,
            userId: "ios_user@cinema.vn",
            currentTime: currentTime,
            duration: duration,
            quality: selectedQuality,
            isCompleted: isCompleted
        )
    }
    
    deinit {
        if let observer = timeObserver {
            player?.removeTimeObserver(observer)
        }
    }
}