import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';

export const RealAuthService = {
  // 1. Open Google Account Chooser in In-App Auth Browser
  async signInWithGoogleBrowser() {
    try {
      const googleChooserUrl = 'https://accounts.google.com/AccountChooser?service=lso&flowName=GlifWebSignIn';
      
      const result = await WebBrowser.openAuthSessionAsync(
        googleChooserUrl,
        'https://auth.expo.io'
      );

      return {
        success: true,
        type: result.type,
        provider: 'Google'
      };
    } catch (error) {
      // Fallback to Linking if WebBrowser fails
      try {
        await Linking.openURL('https://accounts.google.com/AccountChooser?service=lso&flowName=GlifWebSignIn');
        return { success: true, type: 'opened_external', provider: 'Google' };
      } catch (e) {
        return { success: false, error: 'Không thể mở cổng đăng nhập Google.' };
      }
    }
  },

  // 2. Open Facebook Login in In-App Auth Browser
  async signInWithFacebookBrowser() {
    try {
      const fbLoginUrl = 'https://m.facebook.com/login';
      
      const result = await WebBrowser.openAuthSessionAsync(
        fbLoginUrl,
        'https://auth.expo.io'
      );

      return {
        success: true,
        type: result.type,
        provider: 'Facebook'
      };
    } catch (error) {
      // Fallback to Linking
      try {
        await Linking.openURL('https://m.facebook.com/login');
        return { success: true, type: 'opened_external', provider: 'Facebook' };
      } catch (e) {
        return { success: false, error: 'Không thể mở cổng đăng nhập Facebook.' };
      }
    }
  }
};