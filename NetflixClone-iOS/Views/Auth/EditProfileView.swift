import SwiftUI

public struct EditProfileView: View {
    @Environment(\.presentationMode) private var presentationMode
    @EnvironmentObject private var authVM: AuthViewModel
    
    @State private var nameInput = ""
    @State private var phoneInput = "0908 123 456"
    @State private var emailInput = ""
    @State private var selectedGender = "Nam"
    @State private var birthdateInput = "15/08/2000"
    @State private var selectedAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"
    
    let avatarPresets = [
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=80"
    ]
    
    public var body: some View {
        ZStack {
            AppColors.backgroundDark.ignoresSafeArea()
            
            VStack(alignment: .leading, spacing: 18) {
                // Header
                HStack {
                    Text("Thông Tin Tài Khoản")
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
                        // Avatar Section
                        VStack(spacing: 12) {
                            AsyncImage(url: URL(string: selectedAvatar)) { img in
                                img.resizable().scaledToFill()
                            } placeholder: {
                                Circle().fill(Color.gray)
                            }
                            .frame(width: 80, height: 80)
                            .clipShape(Circle())
                            .overlay(Circle().stroke(AppColors.primaryRed, lineWidth: 2))
                            
                            Text("Chọn ảnh đại diện từ kho FIMAX:")
                                .font(.system(size: 12))
                                .foregroundColor(AppColors.textSecondary)
                            
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 10) {
                                    ForEach(avatarPresets, id: \.self) { avt in
                                        Button(action: { selectedAvatar = avt }) {
                                            AsyncImage(url: URL(string: avt)) { img in
                                                img.resizable().scaledToFill()
                                            } placeholder: {
                                                Circle().fill(Color.gray)
                                            }
                                            .frame(width: 44, height: 44)
                                            .clipShape(Circle())
                                            .overlay(Circle().stroke(selectedAvatar == avt ? AppColors.primaryRed : Color.clear, lineWidth: 2))
                                        }
                                    }
                                }
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .padding(14)
                        .background(AppColors.surface)
                        .cornerRadius(14)
                        
                        // Registration Metadata Card
                        VStack(alignment: .leading, spacing: 6) {
                            HStack {
                                Text("Mã định danh:").foregroundColor(.gray).font(.system(size: 12))
                                Spacer()
                                Text("#FIMAX-88921").foregroundColor(.white).font(.system(size: 12, weight: .semibold))
                            }
                            HStack {
                                Text("Thời gian đăng ký:").foregroundColor(.gray).font(.system(size: 12))
                                Spacer()
                                Text("29/08/2026 - 15:30").foregroundColor(.white).font(.system(size: 12, weight: .semibold))
                            }
                            HStack {
                                Text("Xác thực OTP:").foregroundColor(.gray).font(.system(size: 12))
                                Spacer()
                                Text("🟢 Đã xác minh").foregroundColor(AppColors.successGreen).font(.system(size: 12, weight: .semibold))
                            }
                        }
                        .padding(14)
                        .background(AppColors.surface)
                        .cornerRadius(12)
                        
                        // Form Inputs
                        VStack(alignment: .leading, spacing: 14) {
                            Text("HỌ VÀ TÊN").font(.system(size: 11, weight: .bold)).foregroundColor(.gray)
                            TextField("Họ và tên", text: $nameInput)
                                .padding(12).background(AppColors.surface).cornerRadius(10).foregroundColor(.white)
                            
                            Text("SỐ ĐIỆN THOẠI").font(.system(size: 11, weight: .bold)).foregroundColor(.gray)
                            TextField("Số điện thoại", text: $phoneInput)
                                .padding(12).background(AppColors.surface).cornerRadius(10).foregroundColor(.white)
                            
                            Text("EMAIL").font(.system(size: 11, weight: .bold)).foregroundColor(.gray)
                            TextField("Email", text: $emailInput)
                                .padding(12).background(AppColors.surface).cornerRadius(10).foregroundColor(.white)
                            
                            Text("GIỚI TÍNH").font(.system(size: 11, weight: .bold)).foregroundColor(.gray)
                            Picker("Giới tính", selection: $selectedGender) {
                                Text("Nam").tag("Nam")
                                Text("Nữ").tag("Nữ")
                                Text("Khác").tag("Khác")
                            }
                            .pickerStyle(SegmentedPickerStyle())
                            
                            Text("NGÀY SINH").font(.system(size: 11, weight: .bold)).foregroundColor(.gray)
                            TextField("Ngày sinh (DD/MM/YYYY)", text: $birthdateInput)
                                .padding(12).background(AppColors.surface).cornerRadius(10).foregroundColor(.white)
                        }
                        
                        // Save Button
                        Button(action: {
                            authVM.currentUser?.name = nameInput
                            authVM.currentUser?.email = emailInput
                            authVM.currentUser?.avatarUrl = selectedAvatar
                            presentationMode.wrappedValue.dismiss()
                        }) {
                            Text("LƯU THAY ĐỔI")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(AppColors.primaryRed)
                                .cornerRadius(10)
                        }
                        .padding(.top, 8)
                    }
                    .padding(.horizontal, 20)
                }
            }
        }
        .onAppear {
            nameInput = authVM.currentUser?.name ?? ""
            emailInput = authVM.currentUser?.email ?? ""
            selectedAvatar = authVM.currentUser?.avatarUrl ?? avatarPresets[0]
        }
    }
}