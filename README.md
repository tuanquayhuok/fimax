# 🎬 Netflix Cinema - Hệ Thống Ứng Dụng Xem Phim Điện Ảnh

Dự án bao gồm trọn bộ 3 thành phần:
1. **`NetflixClone-iOS/`**: Mã nguồn Swift / SwiftUI hoàn chỉnh (kiến trúc MVVM + AVPlayer + Dynamic URL Configuration).
2. **`netflix-clone-expo/`**: Ứng dụng Expo React Native (Live Demo) có thể chạy trực tiếp trên iPhone/iPad/Android qua app **Expo Go** hoặc Web.
3. **`backend-admin-server/`**: Server Node.js/Express siêu nhẹ kèm **Web Admin Portal** để thêm phim và theo dõi sự kiện Webhook Callback realtime.

---

## 🚀 Hướng Dẫn Chạy & Trải Nghiệm Demo

### 1. Khởi động Backend & Web Admin Portal
```bash
cd backend-admin-server
npm install
npm start
```
- 📊 **Web Admin Portal:** Mở trình duyệt truy cập `http://localhost:4000`
- 📡 **Callback Webhook Endpoint:** `http://localhost:4000/api/callback/progress`
- 🔗 **API Endpoint:** `http://localhost:4000/api/movies`

---

### 2. Khởi động Ứng dụng Expo (Live Demo trên Điện Thoại & Web)
```bash
cd netflix-clone-expo
npx expo start
```
- **Chạy trên iPhone / Android**: Tải ứng dụng **Expo Go** từ App Store / Google Play, mở camera quét mã QR hiển thị trên màn hình.
- **Chạy trên Trình duyệt Web**: Bấm phím `w` trong terminal.

---

### 3. Mở Dự Án Native iOS Trong Xcode
- Thư mục `NetflixClone-iOS/` chứa toàn bộ code Swift theo chuẩn Apple:
  - `App/NetflixCloneApp.swift`
  - `Views/MainTabView.swift`
  - `Views/Player/CinemaVideoPlayerView.swift`
  - `Core/Network/CallbackService.swift`
  - `App/AppConfiguration.swift` (Đổi API URL và Callback URL linh hoạt)

---

## 📌 7 Module Tính Năng Đã Hoàn Thành
1. **🏠 Trang Chủ:** Hero Banner, Phim Mới, Hot 🔥, Xem Nhiều, Đánh Giá Cao ⭐, Sắp Ra Mắt, Thể Loại Chips, Phim Theo Quốc Gia.
2. **🔎 Tìm Kiếm & Lọc:** Tìm theo Tên/Diễn viên/Đạo diễn, Bộ lọc kết hợp (Thể loại, Quốc gia, Năm, Điểm), Sắp xếp.
3. **🎬 Chi tiết Phim:** Backdrop + Poster, Điểm ⭐, Năm • Thời lượng • Quốc gia, Nút Xem Phim & Yêu Thích, Đánh giá, Chia sẻ, Trailer, Diễn viên & Đạo diễn.
4. **▶️ Trình Phát Phim Điện Ảnh:** Đa chất lượng (360p, 720p, 1080p), Tua 10s, Timeline Scrubber, Phụ đề, Audio, Tốc độ 0.5x - 2.0x, Ghi nhớ vị trí xem dở, Tự động bắn Callback Webhook về server.
5. **❤️ Thư Viện:** 3 Tab - Phim Yêu Thích, Tiếp Tục Xem (% tiến độ), Lịch Sử Xem.
6. **👤 Tài Khoản:** Profile, Apple/Google Login link, Đổi mật khẩu, Thống kê cá nhân.
7. **⚙️ Cài Đặt & Admin Panel:** Dark Mode, Chất lượng mặc định, Phụ đề, **Màn hình Admin đổi Dynamic Base API URL & Callback Webhook URL kèm Test Connection**.