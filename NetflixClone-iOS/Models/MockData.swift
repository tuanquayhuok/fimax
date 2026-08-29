import Foundation

public enum MockData {
    public static let genres: [String] = [
        "Tất cả", "Hành động", "Tâm lý", "Gia đình", "Khoa học viễn tưởng",
        "Hoạt hình", "Hồi hộp", "Kỳ ảo", "Hài hước", "Tình cảm"
    ]
    
    public static let countries: [String] = [
        "Tất cả", "Việt Nam", "Mỹ", "Hàn Quốc", "Nhật Bản", "Trung Quốc", "Thái Lan"
    ]
    
    public static let sampleMovies: [Movie] = [
        Movie(
            id: "mov_1",
            title: "Mai",
            originalTitle: "Mai (2024)",
            rating: 8.7,
            releaseYear: 2024,
            duration: "2h 11m",
            durationSeconds: 7860,
            country: "Việt Nam",
            ageRating: "18+",
            isFeatured: true,
            isHot: true,
            isNew: true,
            isTrending: true,
            viewCount: 1540000,
            genres: ["Tâm lý", "Tình cảm", "Gia đình"],
            director: "Trấn Thành",
            cast: [
                CastMember(name: "Phương Anh Đào", role: "Mai", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"),
                CastMember(name: "Tuấn Trần", role: "Dương", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"),
                CastMember(name: "Hồng Đào", role: "Bà Đào", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200")
            ],
            overview: "Cuộc đời đầy sóng gió và hy sinh của Mai - một nhân viên massage trị liệu, và chuyện tình dang dở nhưng chân thành với chàng nhạc công trẻ Dương.",
            backdropUrl: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1200&auto=format&fit=crop&q=80",
            posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
            trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            videoSources: [
                "1080p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                "720p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                "360p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                "auto": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            ],
            subtitles: [
                SubtitleOption(language: "Tiếng Việt", code: "vi", label: "Tiếng Việt (Chuẩn)"),
                SubtitleOption(language: "English", code: "en", label: "English (CC)")
            ],
            audioTracks: [
                AudioOption(language: "Gốc", code: "vi_orig", label: "Gốc (Tiếng Việt) - Dolby 5.1"),
                AudioOption(language: "Thuyết minh", code: "vi_tm", label: "Thuyết minh Tiếng Việt")
            ]
        ),
        Movie(
            id: "mov_2",
            title: "Lật Mặt 7: Một Điều Ước",
            originalTitle: "Face Off 7: One Wish",
            rating: 8.5,
            releaseYear: 2024,
            duration: "2h 18m",
            durationSeconds: 8280,
            country: "Việt Nam",
            ageRating: "13+",
            isFeatured: true,
            isHot: true,
            isNew: true,
            isTrending: true,
            viewCount: 1890000,
            genres: ["Gia đình", "Tâm lý", "Hài hước"],
            director: "Lý Hải",
            cast: [
                CastMember(name: "Thanh Hiền", role: "Bà Hai", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200")
            ],
            overview: "Câu chuyện xúc động về bà mẹ già 73 tuổi cùng 5 người con đi làm ăn xa. Khi biến cố ập đến, tình thân gia đình được thử thách.",
            backdropUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80",
            posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80",
            trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            videoSources: [
                "1080p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                "720p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                "360p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
            ]
        ),
        Movie(
            id: "mov_3",
            title: "Cyberpunk: Thành Phố Bất Diệt",
            originalTitle: "Neon Nexus 2049",
            rating: 9.1,
            releaseYear: 2026,
            duration: "2h 35m",
            durationSeconds: 9300,
            country: "Mỹ",
            ageRating: "16+",
            isFeatured: true,
            isHot: true,
            isNew: true,
            isTrending: true,
            viewCount: 2450000,
            genres: ["Khoa học viễn tưởng", "Hành động", "Hồi hộp"],
            director: "Denis Villeneuve",
            cast: [
                CastMember(name: "Ryan Gosling", role: "Agent K", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200")
            ],
            overview: "Trong thế giới tương lai tràn ngập ánh đèn neon và công nghệ cyborg, một thám tử tư phát hiện ra bí mật đe dọa sự tồn vong của toàn nhân loại.",
            backdropUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80",
            posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
            trailerUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            videoSources: [
                "1080p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
                "720p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                "360p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
            ]
        ),
        Movie(
            id: "mov_4",
            title: "Ký Sinh Trùng 2: Sự Trỗi Dậy",
            originalTitle: "Parasite: The Resurgence",
            rating: 8.9,
            releaseYear: 2025,
            duration: "2h 10m",
            durationSeconds: 7800,
            country: "Hàn Quốc",
            ageRating: "18+",
            isFeatured: false,
            isHot: true,
            isNew: true,
            isTrending: true,
            viewCount: 1980000,
            genres: ["Tâm lý", "Hồi hộp", "Kịch tính"],
            director: "Bong Joon-ho",
            overview: "Sự tiếp nối của câu chuyện phân tầng giai cấp tàn khốc, nơi những ranh giới giữa người giàu và người nghèo một lần nữa bị xóa nhòa.",
            backdropUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop&q=80",
            posterUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80",
            videoSources: [
                "1080p": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            ]
        )
    ]
}