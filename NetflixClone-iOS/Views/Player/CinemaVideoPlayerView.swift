import SwiftUI
import AVKit

public struct CinemaVideoPlayerView: View {
    public let movie: Movie
    @StateObject private var viewModel: PlayerViewModel
    @Environment(\.presentationMode) private var presentationMode
    @State private var showControls = true
    
    public init(movie: Movie) {
        self.movie = movie
        _viewModel = StateObject(wrappedValue: PlayerViewModel(movie: movie))
    }
    
    public var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            if let player = viewModel.player {
                VideoPlayer(player: player)
                    .ignoresSafeArea()
                    .onTapGesture {
                        withAnimation { showControls.toggle() }
                    }
            }
            
            if showControls {
                PlayerControlsOverlay(viewModel: viewModel, onDismiss: {
                    viewModel.syncPlaybackCallback(isCompleted: false)
                    presentationMode.wrappedValue.dismiss()
                })
                .transition(.opacity)
            }
        }
        .statusBar(hidden: true)
    }
}