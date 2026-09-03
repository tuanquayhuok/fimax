import React, { createContext, useState, useEffect } from 'react';
import { MOCK_USER } from '../data/mockMovies';
import { CallbackService } from '../services/callbackService';
import { StorageService } from '../services/storageService';
import { NotificationService } from '../services/notificationService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initial state is null (Unauthenticated)
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [favorites, setFavorites] = useState(['mov_1', 'mov_2']);
  const [watchHistory, setWatchHistory] = useState([
    { movieId: 'mov_1', currentTime: 3420, duration: 7860, percentage: 43, updatedAt: new Date().toISOString() }
  ]);
  const [continueWatching, setContinueWatching] = useState([
    { movieId: 'mov_1', currentTime: 3420, duration: 7860, percentage: 43, updatedAt: new Date().toISOString() }
  ]);
  const [activeMovieForPlayer, setActiveMovieForPlayer] = useState(null);

  // Appearance & Customization System State
  const [themeMode, setThemeMode] = useState('dark');
  const [accentColor, setAccentColor] = useState('#E50914');
  const [fontSizeScale, setFontSizeScale] = useState(1.0);
  const [fontWeightMode, setFontWeightMode] = useState('regular');
  const [layoutDensity, setLayoutDensity] = useState('comfortable');

  // Notification System State - Default is false (OFF) as requested
  const [notificationsEnabled, setNotificationsEnabledState] = useState(false);
  const [popupNotification, setPopupNotification] = useState(null);

  // Dynamic URLs
  const [apiUrl, setApiUrl] = useState('http://localhost:4000/api');
  const [callbackUrl, setCallbackUrl] = useState('http://localhost:4000/api/callback/progress');

  // Load Persisted Session, Registered Accounts & Settings on startup
  useEffect(() => {
    async function loadPersistedState() {
      try {
        const savedUsers = await StorageService.getItem('@fimax_registered_users');
        if (savedUsers) {
          try {
            setRegisteredUsers(JSON.parse(savedUsers));
          } catch (e) {}
        }

        const savedUser = await StorageService.getItem('@fimax_auth_user');
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            if (parsed && parsed.email) {
              setUser(parsed);
            }
          } catch (e) {}
        }

        const savedNotif = await StorageService.getItem('@fimax_notif_enabled');
        if (savedNotif !== null) {
          setNotificationsEnabledState(savedNotif === 'true');
        } else {
          setNotificationsEnabledState(false);
        }

        const savedFavs = await StorageService.getItem('@fimax_favorites');
        if (savedFavs) {
          try {
            setFavorites(JSON.parse(savedFavs));
          } catch (e) {}
        }
      } catch (e) {
        console.warn('Load persisted state error:', e);
      }
    }
    loadPersistedState();
  }, []);

  const setNotificationsEnabled = (val) => {
    setNotificationsEnabledState(val);
    StorageService.setItem('@fimax_notif_enabled', String(val));
  };

  const showNotificationPopup = async (title, message, movie = null, type = 'movie') => {
    if (!notificationsEnabled) return;

    // 1. Dispatch REAL Apple iOS Native Notification into iOS Notification Center & Lockscreen
    await NotificationService.sendNativeNotification(
      title,
      message,
      { movie, type }
    );

    // 2. Dispatch In-App Banner for active screen
    setPopupNotification({
      id: Date.now(),
      title,
      message,
      movie,
      type
    });
  };

  const hideNotificationPopup = () => {
    setPopupNotification(null);
  };

  // Auth Methods with Strict Registration & Verification
  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check in registered users
    const existingUser = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!existingUser) {
      return {
        success: false,
        error: 'Tài khoản chưa được đăng ký trên hệ thống. Vui lòng chuyển sang tab Đăng Ký để tạo tài khoản mới.'
      };
    }

    if (existingUser.password && existingUser.password !== password) {
      return {
        success: false,
        error: 'Mật khẩu không chính xác. Vui lòng kiểm tra lại hoặc chọn Quên mật khẩu.'
      };
    }

    setUser(existingUser);
    StorageService.setItem('@fimax_auth_user', JSON.stringify(existingUser));
    return { success: true, user: existingUser };
  };

  const register = (name, email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const existingUser = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existingUser) {
      return {
        success: false,
        error: 'Email này đã được đăng ký trước đó. Vui lòng chuyển sang tab Đăng Nhập.'
      };
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name: name || cleanEmail.split('@')[0],
      email: cleanEmail,
      password: password,
      phone: '0908 123 456',
      gender: 'Nam',
      birthdate: '15/08/2000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      plan: 'Thành viên Tiêu chuẩn',
      isVip: false,
      createdAt: 'Hôm nay',
      memberId: '#FIMAX-' + Math.floor(10000 + Math.random() * 90000)
    };

    const nextUsers = [...registeredUsers, newUser];
    setRegisteredUsers(nextUsers);
    StorageService.setItem('@fimax_registered_users', JSON.stringify(nextUsers));
    setUser(newUser);
    StorageService.setItem('@fimax_auth_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const resetPassword = (email, newPassword) => {
    const cleanEmail = email.trim().toLowerCase();
    const existingIndex = registeredUsers.findIndex(u => u.email.toLowerCase() === cleanEmail);
    if (existingIndex !== -1) {
      const updated = [...registeredUsers];
      updated[existingIndex] = { ...updated[existingIndex], password: newPassword };
      setRegisteredUsers(updated);
      StorageService.setItem('@fimax_registered_users', JSON.stringify(updated));
      return { success: true };
    } else {
      // If user was not yet in registered list, register them
      return register(cleanEmail.split('@')[0], cleanEmail, newPassword);
    }
  };

  const logout = () => {
    setUser(null);
    StorageService.removeItem('@fimax_auth_user');
  };

  const updateUserProfile = (updatedFields) => {
    setUser(prev => {
      const next = { ...prev, ...updatedFields };
      StorageService.setItem('@fimax_auth_user', JSON.stringify(next));
      // Also update in registered list
      setRegisteredUsers(currentUsers => {
        const updated = currentUsers.map(u => u.id === next.id ? next : u);
        StorageService.setItem('@fimax_registered_users', JSON.stringify(updated));
        return updated;
      });
      return next;
    });
  };

  const toggleFavorite = (movieId) => {
    setFavorites(prev => {
      let next;
      if (prev.includes(movieId)) {
        next = prev.filter(id => id !== movieId);
      } else {
        next = [...prev, movieId];
      }
      StorageService.setItem('@fimax_favorites', JSON.stringify(next));
      return next;
    });
  };

  const updateProgress = async (movieId, movieTitle, currentTime, duration, percentage) => {
    const updated = {
      movieId,
      currentTime,
      duration,
      percentage,
      updatedAt: new Date().toISOString()
    };

    setContinueWatching(prev => {
      const filtered = prev.filter(item => item.movieId !== movieId);
      if (percentage >= 95) return filtered;
      return [updated, ...filtered];
    });

    setWatchHistory(prev => {
      const filtered = prev.filter(item => item.movieId !== movieId);
      return [updated, ...filtered];
    });

    await CallbackService.sendPlaybackEvent(callbackUrl, {
      event: 'playback_progress',
      movieId,
      movieTitle,
      userId: user ? user.id : 'guest',
      currentTime,
      duration,
      percentage,
      isCompleted: percentage >= 95
    });
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser: updateUserProfile,
      login,
      register,
      resetPassword,
      logout,
      favorites,
      toggleFavorite,
      watchHistory,
      continueWatching,
      updateProgress,
      activeMovieForPlayer,
      setActiveMovieForPlayer,
      themeMode,
      setThemeMode,
      accentColor,
      setAccentColor,
      fontSizeScale,
      setFontSizeScale,
      fontWeightMode,
      setFontWeightMode,
      layoutDensity,
      setLayoutDensity,
      notificationsEnabled,
      setNotificationsEnabled,
      popupNotification,
      showNotificationPopup,
      hideNotificationPopup,
      apiUrl,
      setApiUrl,
      callbackUrl,
      setCallbackUrl
    }}>
      {children}
    </AppContext.Provider>
  );
};
