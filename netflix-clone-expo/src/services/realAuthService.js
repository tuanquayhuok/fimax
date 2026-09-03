import { Linking } from 'react-native';

export const RealAuthService = {
  // 1. Open Google Account Chooser
  async signInWithGoogleBrowser() {
    try {
      const googleChooserUrl = 'https://accounts.google.com/AccountChooser?service=lso&flowName=GlifWebSignIn';
      const supported = await Linking.canOpenURL(googleChooserUrl);
      if (supported) {
        await Linking.openURL(googleChooserUrl);
      }
      return {
        success: true,
        provider: 'Google'
      };
    } catch (error) {
      return { success: false, error: 'Không thể mở cổng đăng nhập Google.' };
    }
  },

  // 2. Open Facebook Login
  async signInWithFacebookBrowser() {
    try {
      const fbLoginUrl = 'https://m.facebook.com/login';
      const supported = await Linking.canOpenURL(fbLoginUrl);
      if (supported) {
        await Linking.openURL(fbLoginUrl);
      }
      return {
        success: true,
        provider: 'Facebook'
      };
    } catch (error) {
      return { success: false, error: 'Không thể mở cổng đăng nhập Facebook.' };
    }
  }
};