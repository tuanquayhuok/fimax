import SwiftUI

public struct ProfileView: View {
    @EnvironmentObject private var authVM: AuthViewModel
    @EnvironmentObject private var libraryVM: LibraryViewModel
    
    // Modals
    @State private var showEditProfileModal = false
    @State private var showAppearanceModal = false
    @State private var showVipModal = false
    @State private var showSubManagerModal = false
    @State private var showRedeemModal = false
    @State private var showOtpModal = false
    @State private var parentalPin = false
    
    // Auth form state (guest)
    @State private var isLoginMode = true
    @State private var emailInput = ""
    @State private var passwordInput = ""
    @State private var nameInput = ""
    @State private var pendingRegistration: (name: String, email: String, pass: String)? = nil
    
    public var body: some View {
        NavigationView {
            ZStack {
                AppColors.backgroundDark.ignoresSafeArea()
                
                if let user = authVM.currentUser {
                    // Authenticated View
                    ScrollView {
                        VStack(alignment: .leading, spacing: 20) {
                            // Profile Hero (Tapping opens Edit Profile Modal)
                            Button(action: { showEditProfileModal = true }) {
                                HStack(spacing: 14) {
                                    ZStack(alignment: .bottomTrailing) {
                                        AsyncImage(url: URL(string: user.avatarUrl)) { img in
                                            img.resizable().scaledToFill()
                                        } placeholder: {
                                            Circle().fill(Color(white: 0.2))
                                        }
                                        .frame(width: 60, height: 60)
                                        .clipShape(Circle())
                                        
                                        Circle()
                                            .fill(AppColors.primaryRed)
                                            .frame(width: 18, height: 18)
                                            .overlay(Image(systemName: "pencil").font(.system(size: 9)).foregroundColor(.white))
                                            .offset(x: 2, y: 2)
                                    }
                                    
                                    VStack(alignment: .leading, spacing: 3) {
                                        Text(user.name)
                                            .font(.system(size: 18, weight: .bold))
                                            .foregroundColor(.white)
                                        Text(user.email)
                                            .font(.system(size: 12))
                                            .foregroundColor(AppColors.textSecondary)
                                        Text(user.planTier)
                                            .font(.system(size: 11, weight: .bold))
                                            .foregroundColor(AppColors.gold)
                                            .padding(.horizontal, 6)
                                            .padding(.vertical, 2)
                                            .background(AppColors.gold.opacity(0.15))
                                            .cornerRadius(4)
                                    }
                                    Spacer()
                                    Image(systemName: "chevron.right").font(.system(size: 14)).foregroundColor(.gray)
                                }
                                .padding(14)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(AppColors.surface)
                                .cornerRadius(14)
                            }
                            
                            // Quick Action Buttons Row
                            HStack(spacing: 10) {
                                Button(action: { showVipModal = true }) {
                                    HStack(spacing: 6) {
                                        Image(systemName: "sparkles")
                                        Text("Nâng Cấp VIP").font(.system(size: 13, weight: .bold))
                                    }
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 12)
                                    .background(AppColors.primaryRed)
                                    .cornerRadius(10)
                                }
                                
                                Button(action: { showRedeemModal = true }) {
                                    HStack(spacing: 6) {
                                        Image(systemName: "gift.fill")
                                        Text("Đổi Mã Giftcode").font(.system(size: 13, weight: .bold))
                                    }
                                    .foregroundColor(AppColors.gold)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 12)
                                    .background(AppColors.surface)
                                    .cornerRadius(10)
                                    .overlay(RoundedRectangle(cornerRadius: 10).stroke(AppColors.borderDark, lineWidth: 1))
                                }
                            }
                            
                            // Section 1: Dịch Vụ & Hội Viên
                            Text("TÀI KHOẢN & HỘI VIÊN")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(AppColors.textSecondary)
                            
                            VStack(spacing: 1) {
                                ProfileRowItem(icon: "person.crop.circle", title: "Thông tin cá nhân", sub: "Họ tên, SĐT, giới tính, đổi avatar") { showEditProfileModal = true }
                                ProfileRowItem(icon: "diamond.fill", title: "Quản lý gói đang sử dụng", sub: "Xem hạn dùng, gia hạn & hủy gói") { showSubManagerModal = true }
                                ProfileRowItem(icon: "key.fill", title: "Kích hoạt mã quà tặng (Giftcode)", sub: "Nhập mã voucher") { showRedeemModal = true }
                            }
                            .cornerRadius(12)
                            
                            // Section 2: Giao Diện & Hiển Thị
                            Text("GIAO DIỆN & HIỂN THỊ")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(AppColors.textSecondary)
                            
                            VStack(spacing: 1) {
                                ProfileRowItem(icon: "paintpalette.fill", title: "Tùy chỉnh giao diện & cỡ chữ", sub: "Màu chủ đạo, Sáng/Tối, Cỡ chữ & Đậm nhạt") { showAppearanceModal = true }
                            }
                            .cornerRadius(12)
                            
                            // Section 3: An Toàn & Bảo Mật
                            Text("AN TOÀN & BẢO MẬT")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(AppColors.textSecondary)
                            
                            VStack(spacing: 1) {
                                ProfileRowItem(icon: "lock.fill", title: "Đổi mật khẩu", sub: nil) {}
                                HStack {
                                    Image(systemName: "shield.fill").foregroundColor(.white)
                                    VStack(alignment: .leading) {
                                        Text("Khóa mã PIN 18+").font(.system(size: 14)).foregroundColor(.white)
                                        Text("Bảo vệ nội dung người lớn").font(.system(size: 11)).foregroundColor(.gray)
                                    }
                                    Spacer()
                                    Toggle("", isOn: $parentalPin).labelsHidden()
                                }
                                .padding(14)
                                .background(AppColors.surface)
                            }
                            .cornerRadius(12)
                            
                            // Logout
                            Button(action: { authVM.logout() }) {
                                Text("Đăng Xuất")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(AppColors.primaryRed)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 14)
                                    .background(AppColors.surface)
                                    .cornerRadius(12)
                            }
                        }
                        .padding(18)
                    }
                } else {
                    // Unauthenticated (Login / Register Form)
                    ScrollView {
                        VStack(spacing: 20) {
                            HStack(spacing: 0) {
                                Text("F").font(.system(size: 38, weight: .black)).foregroundColor(AppColors.primaryRed)
                                Text("IMAX").font(.system(size: 32, weight: .black)).foregroundColor(.white)
                            }
                            .padding(.top, 40)
                            
                            Picker("Chế độ", selection: $isLoginMode) {
                                Text("Đăng Nhập").tag(true)
                                Text("Đăng Ký").tag(false)
                            }
                            .pickerStyle(SegmentedPickerStyle())
                            
                            VStack(spacing: 12) {
                                if !isLoginMode {
                                    TextField("Họ và tên", text: $nameInput)
                                        .padding(12).background(AppColors.surface).cornerRadius(10).foregroundColor(.white)
                                }
                                TextField("Email / Số điện thoại", text: $emailInput)
                                    .padding(12).background(AppColors.surface).cornerRadius(10).foregroundColor(.white)
                                SecureField("Mật khẩu", text: $passwordInput)
                                    .padding(12).background(AppColors.surface).cornerRadius(10).foregroundColor(.white)
                                
                                Button(action: {
                                    if isLoginMode {
                                        _ = authVM.login(email: emailInput, password: passwordInput)
                                    } else {
                                        pendingRegistration = (name: nameInput, email: emailInput, pass: passwordInput)
                                        showOtpModal = true
                                    }
                                }) {
                                    Text(isLoginMode ? "ĐĂNG NHẬP" : "TẠO TÀI KHOẢN")
                                        .font(.system(size: 14, weight: .bold))
                                        .foregroundColor(.white)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 14)
                                        .background(AppColors.primaryRed)
                                        .cornerRadius(10)
                                }
                            }
                        }
                        .padding(20)
                    }
                }
            }
            .navigationBarHidden(true)
            .sheet(isPresented: $showAppearanceModal) {
                AppearanceSettingsView()
            }
            .sheet(isPresented: $showEditProfileModal) {
                EditProfileView()
            }
            .sheet(isPresented: $showSubManagerModal) {
                SubscriptionManagerView()
            }
            .sheet(isPresented: $showVipModal) {
                VipSubscriptionModalView()
            }
            .sheet(isPresented: $showRedeemModal) {
                RedeemCodeModalView()
            }
            .sheet(isPresented: $showOtpModal) {
                OtpVerificationView(
                    destination: emailInput,
                    onVerifySuccess: {
                        showOtpModal = false
                        if let reg = pendingRegistration {
                            _ = authVM.register(name: reg.name, email: reg.email, password: reg.pass)
                        }
                    },
                    onCancel: { showOtpModal = false }
                )
            }
        }
    }
}