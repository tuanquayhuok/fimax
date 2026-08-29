import SwiftUI

public struct AppearanceSettingsView: View {
    @Environment(\.presentationMode) private var presentationMode
    @EnvironmentObject private var appConfig: AppConfiguration
    
    @State private var selectedTheme = 0 // 0: Dark, 1: Light
    @State private var selectedAccent = "#E50914"
    @State private var selectedFontSize: Double = 1.0
    @State private var selectedWeight = "regular"
    
    let accentColors = [
        ("#E50914", "Đỏ Crimson"),
        ("#D4AF37", "Vàng Gold"),
        ("#0A84FF", "Xanh Cyberpunk"),
        ("#AF52DE", "Tím Velvet"),
        ("#30D158", "Xanh Emerald")
    ]
    
    public var body: some View {
        ZStack {
            AppColors.backgroundDark.ignoresSafeArea()
            
            VStack(alignment: .leading, spacing: 18) {
                // Header
                HStack {
                    Text("Tùy Chỉnh Giao Diện & Cỡ Chữ")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(.white)
                    Spacer()
                    Button(action: { presentationMode.wrappedValue.dismiss() }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 22))
                            .foregroundColor(.gray)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 20)
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 18) {
                        // Live Preview Box
                        Text("XEM TRƯỚC THỜI GIAN THỰC")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(AppColors.textSecondary)
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("FIMAX Cinema Original")
                                .font(.system(size: CGFloat(20 * selectedFontSize), weight: selectedWeight == "bold" ? .bold : (selectedWeight == "heavy" ? .black : .medium)))
                                .foregroundColor(.white)
                            
                            Text("Trải nghiệm phim điện ảnh với màu sắc và cỡ chữ tùy chỉnh.")
                                .font(.system(size: CGFloat(12 * selectedFontSize)))
                                .foregroundColor(AppColors.textSecondary)
                            
                            HStack {
                                Image(systemName: "play.fill")
                                Text("Xem Phim Ngay").font(.system(size: CGFloat(13 * selectedFontSize), weight: .bold))
                            }
                            .foregroundColor(.white)
                            .padding(.vertical, 10)
                            .frame(maxWidth: .infinity)
                            .background(Color(hex: selectedAccent))
                            .cornerRadius(8)
                        }
                        .padding(16)
                        .background(AppColors.surface)
                        .cornerRadius(14)
                        
                        // Theme Mode
                        Text("CHẾ ĐỘ NỀN GIAO DIỆN")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(AppColors.textSecondary)
                        
                        Picker("Chế độ nền", selection: $selectedTheme) {
                            Text("Tối OLED").tag(0)
                            Text("Sáng").tag(1)
                        }
                        .pickerStyle(SegmentedPickerStyle())
                        
                        // Accent Color
                        Text("MÀU SẮC CHỦ ĐẠO HỆ THỐNG")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(AppColors.textSecondary)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 12) {
                                ForEach(accentColors, id: \.0) { hex, name in
                                    Button(action: { selectedAccent = hex }) {
                                        VStack(spacing: 4) {
                                            Circle()
                                                .fill(Color(hex: hex))
                                                .frame(width: 36, height: 36)
                                                .overlay(Circle().stroke(selectedAccent == hex ? Color.white : Color.clear, lineWidth: 2.5))
                                            Text(name)
                                                .font(.system(size: 10))
                                                .foregroundColor(selectedAccent == hex ? .white : .gray)
                                        }
                                    }
                                }
                            }
                        }
                        
                        // Font Size Scale
                        Text("KÍCH THƯỚC CỠ CHỮ")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(AppColors.textSecondary)
                        
                        Picker("Cỡ chữ", selection: $selectedFontSize) {
                            Text("Nhỏ (90%)").tag(0.9)
                            Text("Chuẩn (100%)").tag(1.0)
                            Text("Lớn (115%)").tag(1.15)
                            Text("Cực Đại (130%)").tag(1.3)
                        }
                        .pickerStyle(SegmentedPickerStyle())
                        
                        // Font Weight
                        Text("ĐỘ ĐẬM NHẠT CHỮ")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(AppColors.textSecondary)
                        
                        Picker("Độ đậm", selection: $selectedWeight) {
                            Text("Thanh Mảnh").tag("light")
                            Text("Tiêu Chuẩn").tag("regular")
                            Text("Đậm Nét").tag("bold")
                            Text("Siêu Đậm").tag("heavy")
                        }
                        .pickerStyle(SegmentedPickerStyle())
                        
                        // Save Button
                        Button(action: {
                            appConfig.isDarkMode = (selectedTheme == 0)
                            presentationMode.wrappedValue.dismiss()
                        }) {
                            Text("LƯU CÀI ĐẶT")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(Color(hex: selectedAccent))
                                .cornerRadius(10)
                        }
                        .padding(.top, 10)
                    }
                    .padding(.horizontal, 20)
                }
            }
        }
    }
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 229, 9, 20)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}