import SwiftUI

public struct PlayerControlsOverlay: View {
    @ObservedObject public var viewModel: PlayerViewModel
    public let onDismiss: () -> Void
    @State private var showQualityPicker = false
    @State private var showAudioSubPicker = false
    
    public var body: some View {
        ZStack {
            Color.black.opacity(0.55).ignoresSafeArea()
            
            VStack {
                // Top Bar
                HStack {
                    Button(action: onDismiss) {
                        Image(systemName: "chevron.left")
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.white)
                            .padding(8)
                    }
                    
                    VStack(alignment: .leading, spacing: 2) {
                        Text(viewModel.movie.title)
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.white)
                        Text("Cinema Single • \(viewModel.selectedQuality) • \(String(format: "%.2fx", viewModel.playbackSpeed))")
                            .font(.system(size: 11))
                            .foregroundColor(AppColors.textSecondary)
                    }
                    .padding(.leading, 8)
                    
                    Spacer()
                    
                    // Quality Button
                    Button(action: { showQualityPicker.toggle() }) {
                        Text(viewModel.selectedQuality)
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color.white.opacity(0.2))
                            .cornerRadius(4)
                    }
                    
                    // Audio / Subtitle
                    Button(action: { showAudioSubPicker.toggle() }) {
                        Image(systemName: "captions.bubble")
                            .font(.system(size: 18))
                            .foregroundColor(.white)
                            .padding(8)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 10)
                
                Spacer()
                
                // Center Playback Buttons: Seek -10s, Play/Pause, Seek +10s
                HStack(spacing: 50) {
                    Button(action: { viewModel.skip(seconds: -10) }) {
                        VStack(spacing: 2) {
                            Image(systemName: "gobackward.10")
                                .font(.system(size: 32))
                            Text("10s").font(.system(size: 10, weight: .bold))
                        }
                        .foregroundColor(.white)
                    }
                    
                    Button(action: { viewModel.togglePlayPause() }) {
                        Image(systemName: viewModel.isPlaying ? "pause.fill" : "play.fill")
                            .font(.system(size: 38))
                            .foregroundColor(.white)
                            .frame(width: 72, height: 72)
                            .background(AppColors.primaryRed)
                            .clipShape(Circle())
                    }
                    
                    Button(action: { viewModel.skip(seconds: 10) }) {
                        VStack(spacing: 2) {
                            Image(systemName: "goforward.10")
                                .font(.system(size: 32))
                            Text("10s").font(.system(size: 10, weight: .bold))
                        }
                        .foregroundColor(.white)
                    }
                }
                
                Spacer()
                
                // Bottom Timeline Scrubber
                VStack(spacing: 6) {
                    HStack {
                        Text(formatTime(viewModel.currentTime))
                            .font(.system(size: 12, design: .monospaced))
                            .foregroundColor(.white)
                        
                        Slider(
                            value: Binding(
                                get: { viewModel.currentTime },
                                set: { viewModel.seek(to: $0) }
                            ),
                            in: 0...max(1, viewModel.duration)
                        )
                        .accentColor(AppColors.primaryRed)
                        
                        Text(formatTime(viewModel.duration))
                            .font(.system(size: 12, design: .monospaced))
                            .foregroundColor(.white)
                    }
                    
                    HStack {
                        Text("Âm thanh: \(viewModel.selectedAudio) | Phụ đề: \(viewModel.selectedSubtitle)")
                            .font(.system(size: 11))
                            .foregroundColor(AppColors.textSecondary)
                        Spacer()
                        Text("📡 Callback Syncing")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(AppColors.successGreen)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 20)
            }
        }
        .confirmationDialog("Chọn chất lượng video", isPresented: $showQualityPicker, titleVisibility: .visible) {
            Button("1080p (Full HD)") { viewModel.changeQuality("1080p") }
            Button("720p (HD)") { viewModel.changeQuality("720p") }
            Button("360p (SD)") { viewModel.changeQuality("360p") }
        }
        .confirmationDialog("Âm thanh & Phụ đề", isPresented: $showAudioSubPicker, titleVisibility: .visible) {
            Button("Tiếng Việt (Phụ đề)") { viewModel.selectedSubtitle = "Tiếng Việt" }
            Button("English (Phụ đề)") { viewModel.selectedSubtitle = "English" }
            Button("Thuyết minh Tiếng Việt (Audio)") { viewModel.selectedAudio = "Thuyết minh" }
            Button("Gốc Dolby (Audio)") { viewModel.selectedAudio = "Gốc" }
        }
    }
    
    private func formatTime(_ seconds: Double) -> String {
        let total = Int(seconds)
        let m = total / 60
        let s = total % 60
        return String(format: "%02d:%02d", m, s)
    }
}