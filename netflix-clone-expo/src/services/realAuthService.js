import { Linking, Alert } from 'react-native';

export const RealAuthService = {
  // 1. Official Apple ID Sign-In Portal
  async signInWithRealApple() {
    try {
      // Official Apple ID Sign-in landing portal (Works reliably on all iOS Safari browsers)
      const appleAuthUrl = 'https://appleid.apple.com/sign-in';
      
      const supported = await Linking.canOpenURL(appleAuthUrl);
      if (supported) {
        await Linking.openURL(appleAuthUrl);
      }
      
      return {
        success: false,
        pending: true,
        message: 'Đang mở trang đăng nhập Apple ID chính thức của Apple. Vui lòng hoàn tất xác thực trên trình duyệt.'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Không thể mở cổng xác thực Apple ID lúc này.'
      };
    }
  },

  // 2. Official Google Account Chooser (Mở giao diện Chọn tài khoản Google)
  async signInWithRealGoogle() {
    try {
      // Official Google Account Chooser & Login Endpoint (Forces account selection list)
      const googleChooserUrl = 'https://accounts.google.com/AccountChooser?service=lso&flowName=GlifWebSignIn';
      
      const supported = await Linking.canOpenURL(googleChooserUrl);
      if (supported) {
        await Linking.openURL(googleChooserUrl);
      }

      return {
        success: false,
        pending: true,
        message: 'Đang mở màn hình CHỌN TÀI KHOẢN GOOGLE. Vui lòng chọn tài khoản Gmail của bạn trên trang đăng nhập.'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Không thể mở cổng đăng nhập Google lúc này.'
      };
    }
  }
};