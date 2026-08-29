import SwiftUI
import AVKit

public struct TrailerPlayerModal: View {
    public let movie: Movie
    public let onDismiss: () -> Void
    @State private var player: AVPlayer?
    
    public var body: some View {
        ZStack(alignment: .topTrailing) {
            Color.black.ignoresSafeArea()
            
            if let trailerUrl = movie.trailerUrl, let url = URL(string: trailerUrl) {
                VideoPlayer(player: player)
                    .onAppear {
                        player = AVPlayer(url: url)
                        player?.play()
                    }
                    .onDisappear {
                        player?.pause()
                    }
            }
            
            Button(action: onDismiss) {
                Image(systemName: "xmark.circle.fill")
                    .font(.system(size: 30))
                    .foregroundColor(.white.opacity(0.8))
                    .padding(20)
            }
        }
    }
}