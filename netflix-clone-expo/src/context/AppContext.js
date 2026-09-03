import React, { createContext, useState, useEffect } from 'react';
import { MOCK_USER } from '../data/mockMovies';
import { CallbackService } from '../services/callbackService';
import { StorageService } from '../services/storageService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initial state is null (Unauthenticated)
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState(['mov_1', 'mov_2']);
  const [watchHistory, setWatchHistory] = useState([
    { movieId: 'mov_1', currentTime: 3420, duration: 7860, percentage: 43, updatedAt: new Date().toISOString() }
  ]);
  const [continueWatching, setContinueWatching] = useState([
    { movieId: 'mov_1', currentTime: 3420, duration: 7860, percentage: 43, updatedAt: new Date().toISOString() }
  ]);
  const [activeMovieForPlayer, setActiveMovieForPlayer] = useState(null);

  // Appearance & Customization System State
  const [themeMode, setThemeMode] = useState('dark'); // 'dark' | 'light' | 'system'
  const [accentColor, setAccentColor] = useState('#E50914'); // Red, Gold, Blue, Purple, Green
  const [fontSizeScale, setFontSizeScale] = useState(1.0); // 0.9, 1.0, 1.15, 1.3
  const [fontWeightMode, setFontWeightMode] = useState('regular'); // 'light' | 'regular' | 'bold' | 'heavy'
  const [layoutDensity, setLayoutDensity] = useState('comfortable'); // 'compact' | 'comfortable'

  // Notification System State - Default is false (OFF) as requested
  const [notificationsEnabled, setNotificationsEnabledState] = useState(false);
  const [popupNotification, setPopupNotification] = useState(null);

  // Dynamic URLs
  const [apiUrl, setApiUrl] = useState('http://localhost:4000/api');
  const [callbackUrl, setCallbackUrl] = useState('http://localhost:4000/api/callback/progress');

  // Load Persisted Session & Settings on startup
  useEffect(() => {
    async function loadPersistedState() {
      try {
        const savedUser = await StorageService.getItem('@fimax_auth_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.email) {
            setUser(parsed);
          }
        }

        const savedNotif = await StorageService.getItem('@fimax_notif_enabled');
        if (savedNotif !== null) {
          setNotificationsEnabledState(savedNotif === 'true');
        } else {
          setNotificationsEnabledState(false);
        }

        const savedFavs = await StorageService.getItem('@fimax_favorites');
        if (savedFavs) {
          setFavorites(JSON.parse(savedFavs));
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

  const showNotificationPopup = (title, message, movie = null, type = 'movie') => {
    if (!notificationsEnabled) return;
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

  // Auth Methods with Session Persistence
  const login = (email, password) => {
    const loggedUser = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0] || 'Thành viên FIMAX',
      email: email,
      phone: '0908 123 456',
      gender: 'Nam',
      birthdate: '15/08/2000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      plan: 'Thành viên Tiêu chuẩn',
      isVip: false,
      createdAt: '29/08/2026 - 15:30',
      memberId: '#FIMAX-88921'
    };
    setUser(loggedUser);
    StorageService.setItem('@fimax_auth_user', JSON.stringify(loggedUser));
    return true;
  };

  const register = (name, email, password) => {
    const newUser = {
      id: 'usr_' + Date.now(),
      name: name || 'Thành viên Mới',
      email: email,
      phone: '0908 123 456',
      gender: 'Nam',
      birthdate: '15/08/2000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      plan: 'Thành viên Tiêu chuẩn',
      isVip: false,
      createdAt: '29/08/2026 - 15:30',
      memberId: '#FIMAX-88921'
    };
    setUser(newUser);
    StorageService.setItem('@fimax_auth_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    StorageService.removeItem('@fimax_auth_user');
  };

  const updateUserProfile = (updatedFields) => {
    setUser(prev => {
      const next = { ...prev, ...updatedFields };
      StorageService.setItem('@fimax_auth_user', JSON.stringify(next));
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
