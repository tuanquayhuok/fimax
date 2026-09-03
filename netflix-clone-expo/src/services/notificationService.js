let Notifications = null;
try {
  Notifications = require('expo-notifications');
  if (Notifications && typeof Notifications.setNotificationHandler === 'function') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }
} catch (e) {
  console.warn('Expo Notifications module init warning:', e);
  Notifications = null;
}

export const NotificationService = {
  async checkPermission() {
    try {
      if (Notifications && typeof Notifications.getPermissionsAsync === 'function') {
        const { status } = await Notifications.getPermissionsAsync();
        return status === 'granted';
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  async requestPermission() {
    try {
      if (Notifications && typeof Notifications.requestPermissionsAsync === 'function') {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync({
            ios: {
              allowAlert: true,
              allowBadge: true,
              allowSound: true,
              allowAnnouncements: true,
            },
          });
          finalStatus = status;
        }
        return finalStatus === 'granted';
      }
      return true;
    } catch (e) {
      console.warn('Notification permission request error:', e);
      return false;
    }
  },

  async sendNativeNotification(title, body, data = {}) {
    try {
      if (Notifications && typeof Notifications.scheduleNotificationAsync === 'function') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: title,
            body: body,
            data: data,
            sound: true,
            badge: 1,
          },
          trigger: null,
        });
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Send native notification error:', e);
      return false;
    }
  }
};
