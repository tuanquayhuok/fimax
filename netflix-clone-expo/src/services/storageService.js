let storageModule = null;
try {
  storageModule = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  storageModule = null;
}

const memoryStore = {};

export const StorageService = {
  async getItem(key) {
    try {
      if (storageModule) {
        return await storageModule.getItem(key);
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return memoryStore[key] || null;
    } catch (e) {
      return memoryStore[key] || null;
    }
  },

  async setItem(key, value) {
    try {
      memoryStore[key] = value;
      if (storageModule) {
        await storageModule.setItem(key, value);
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {}
  },

  async removeItem(key) {
    try {
      delete memoryStore[key];
      if (storageModule) {
        await storageModule.removeItem(key);
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {}
  }
};
