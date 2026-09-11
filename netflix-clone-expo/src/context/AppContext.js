import React, { createContext, useState, useEffect } from 'react';
import { MOCK_USER } from '../data/mockMovies';
import { CallbackService } from '../services/callbackService';
import { StorageService } from '../services/storageService';
import { NotificationService } from '../services/notificationService';
import { TRANSLATIONS, LANGUAGES } from '../locales/translations';

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
  const [appIcon, setAppIcon] = useState('classic_red');
  const [ambientLighting, setAmbientLighting] = useState(true);
  const [frameRate, setFrameRateState] = useState(60); // 30, 45, 60, 90, 120 FPS
  const [sleepTimer, setSleepTimerState] = useState(null); // in minutes: 15, 30, 45, 60
  const [sleepTimerEndTime, setSleepTimerEndTime] = useState(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState(null); // in seconds

  // Multi-Language Support State - Default is 'vi' (Tiếng Việt)
  const [currentLanguage, setCurrentLanguageState] = useState('vi');

  // Notification System State - Default is false (OFF) as requested
  const [notificationsEnabled, setNotificationsEnabledState] = useState(false);

  // 1. Daily Check-in & Rewards Points Wallet
  const [fimaxPoints, setFimaxPointsState] = useState(650);
  const [checkInStreak, setCheckInStreakState] = useState(3);
  const [lastCheckInDate, setLastCheckInDate] = useState(null);
  const [redeemedRewards, setRedeemedRewards] = useState([]);

  // 2. Movie Requests
  const [movieRequests, setMovieRequestsState] = useState([
    { id: 'req_1', title: 'Spider-Man: Beyond the Spider-Verse', year: '2025', genre: 'Hoạt hình / Sci-Fi', upvotes: 142, status: 'Đang tìm bản 4K HDR', requester: 'Hoàng Long' },
    { id: 'req_2', title: 'Oppenheimer (Bản IMAX Enhanced)', year: '2023', genre: 'Lịch sử / Kịch tính', upvotes: 98, status: 'Đã có tại Rạp FIMAX', requester: 'Minh Tuấn' },
    { id: 'req_3', title: 'Dune: Part Two (Dolby Vision)', year: '2024', genre: 'Khoa học viễn tưởng', upvotes: 215, status: 'Đã có tại Rạp FIMAX', requester: 'Thu Trang' },
    { id: 'req_4', title: 'Lật Mặt 8: Vòng Tay Mẹ', year: '2025', genre: 'Hành động / Gia đình', upvotes: 310, status: 'Đang xếp lịch chiếu rạp', requester: 'Lý Hải Fan' }
  ]);

  // 3. Watch Party Active Room State
  const [activeWatchParty, setActiveWatchParty] = useState(null);

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

        const savedIcon = await StorageService.getItem('@fimax_app_icon');
        if (savedIcon) setAppIcon(savedIcon);

        const savedAccent = await StorageService.getItem('@fimax_accent_color');
        if (savedAccent) setAccentColor(savedAccent);

        const savedTheme = await StorageService.getItem('@fimax_theme_mode');
        if (savedTheme) setThemeMode(savedTheme);

        const savedFps = await StorageService.getItem('@fimax_frame_rate');
        if (savedFps) setFrameRateState(Number(savedFps));

        const savedPts = await StorageService.getItem('@fimax_points');
        if (savedPts) setFimaxPointsState(Number(savedPts));

        const savedStreak = await StorageService.getItem('@fimax_checkin_streak');
        if (savedStreak) setCheckInStreakState(Number(savedStreak));

        const savedLastCheckIn = await StorageService.getItem('@fimax_last_checkin');
        if (savedLastCheckIn) setLastCheckInDate(savedLastCheckIn);

        const savedReqs = await StorageService.getItem('@fimax_movie_requests');
        if (savedReqs) {
          try {
            setMovieRequestsState(JSON.parse(savedReqs));
          } catch (e) {}
        }

        const savedLang = await StorageService.getItem('@fimax_language');
        if (savedLang) {
          setCurrentLanguageState(savedLang);
        }
      } catch (e) {
        console.warn('Load persisted state error:', e);
      }
    }
    loadPersistedState();
  }, []);

  const setLanguage = (langCode) => {
    setCurrentLanguageState(langCode);
    StorageService.setItem('@fimax_language', langCode);
  };

  const t = (key) => {
    return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS['vi']?.[key] || key;
  };

  const setFimaxPoints = (pts) => {
    setFimaxPointsState(pts);
    StorageService.setItem('@fimax_points', String(pts));
  };

  const checkInToday = () => {
    const todayStr = new Date().toDateString();
    if (lastCheckInDate === todayStr) {
      return { success: false, message: 'Hôm nay bạn đã điểm danh rồi! Hãy quay lại vào ngày mai nhé.' };
    }

    const newStreak = (checkInStreak % 7) + 1;
    // Points per streak day: Day 1=50, Day 2=100, Day 3=150, Day 4=200, Day 5=250, Day 6=300, Day 7=500
    const pointsGained = newStreak === 7 ? 500 : newStreak * 50;
    const newTotal = fimaxPoints + pointsGained;

    setFimaxPointsState(newTotal);
    setCheckInStreakState(newStreak);
    setLastCheckInDate(todayStr);

    StorageService.setItem('@fimax_points', String(newTotal));
    StorageService.setItem('@fimax_checkin_streak', String(newStreak));
    StorageService.setItem('@fimax_last_checkin', todayStr);

    return {
      success: true,
      pointsGained,
      newTotal,
      newStreak,
      message: `Điểm danh Ngày ${newStreak} thành công! Bạn nhận được +${pointsGained} F-Points.`
    };
  };

  const redeemReward = (rewardItem) => {
    if (fimaxPoints < rewardItem.cost) {
      return { success: false, message: `Bạn cần ${rewardItem.cost} điểm để đổi "${rewardItem.title}". Hiện tại bạn có ${fimaxPoints} điểm.` };
    }

    const nextPoints = fimaxPoints - rewardItem.cost;
    setFimaxPointsState(nextPoints);
    StorageService.setItem('@fimax_points', String(nextPoints));

    const newRedeemed = [...redeemedRewards, { ...rewardItem, redeemedAt: new Date().toISOString(), code: 'FMX-' + Math.floor(100000 + Math.random() * 900000) }];
    setRedeemedRewards(newRedeemed);

    // If VIP reward, grant VIP to user
    if (rewardItem.isVip && user) {
      updateUserProfile({ isVip: true, plan: rewardItem.title });
    }

    return {
      success: true,
      remainingPoints: nextPoints,
      code: newRedeemed[newRedeemed.length - 1].code,
      message: `Đổi quà thành công! Đã nhận "${rewardItem.title}".`
    };
  };

  const submitMovieRequest = (title, year, genre, note = '') => {
    if (!title.trim()) return { success: false, message: 'Vui lòng nhập tên bộ phim.' };

    const newReq = {
      id: 'req_' + Date.now(),
      title: title.trim(),
      year: year || '2026',
      genre: genre || 'Điện Ảnh',
      note: note.trim(),
      upvotes: 1,
      status: 'Đang tiếp nhận & kiểm duyệt',
      requester: user ? user.name : 'Khán giả FIMAX',
      createdAt: 'Vừa xong'
    };

    const nextReqs = [newReq, ...movieRequests];
    setMovieRequestsState(nextReqs);
    StorageService.setItem('@fimax_movie_requests', JSON.stringify(nextReqs));

    return { success: true, request: newReq, message: `Yêu cầu phim "${title}" đã được gửi lên ban biên tập rạp FIMAX!` };
  };

  const upvoteMovieRequest = (reqId) => {
    const nextReqs = movieRequests.map(r => {
      if (r.id === reqId) {
        return { ...r, upvotes: (r.upvotes || 0) + 1 };
      }
      return r;
    });
    setMovieRequestsState(nextReqs);
    StorageService.setItem('@fimax_movie_requests', JSON.stringify(nextReqs));
  };

  const createWatchParty = (movie, roomName = null) => {
    const roomCode = 'FMX-' + Math.floor(1000 + Math.random() * 9000);
    const room = {
      id: 'room_' + Date.now(),
      roomCode,
      name: roomName || `Phòng xem phim của ${user ? user.name : 'Bạn'}`,
      movie,
      host: user ? { id: user.id, name: user.name, avatar: user.avatar } : { id: 'host', name: 'Chủ Phòng', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' },
      members: [
        user ? { id: user.id, name: user.name, avatar: user.avatar, isHost: true } : { id: 'host', name: 'Chủ Phòng', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200', isHost: true }
      ],
      createdAt: new Date().toISOString()
    };
    setActiveWatchParty(room);
    return room;
  };

  const joinWatchParty = (roomCode, movie = null) => {
    const cleanCode = roomCode.trim().toUpperCase();
    const room = {
      id: 'room_' + Date.now(),
      roomCode: cleanCode,
      name: `Phòng Xem Chung ${cleanCode}`,
      movie: movie || { id: 'mov_1', title: 'Đào, Phở và Piano', posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
      host: { id: 'host_1', name: 'Minh Trí (Host)', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' },
      members: [
        { id: 'host_1', name: 'Minh Trí', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', isHost: true },
        { id: 'm_2', name: 'Phương Thảo', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', isHost: false },
        { id: 'm_3', name: 'Hoàng Long', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200', isHost: false },
        user ? { id: user.id, name: user.name, avatar: user.avatar, isHost: false } : { id: 'guest_' + Date.now(), name: 'Khách Xem', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200', isHost: false }
      ],
      createdAt: new Date().toISOString()
    };
    setActiveWatchParty(room);
    return room;
  };

  const leaveWatchParty = () => {
    setActiveWatchParty(null);
  };

  const setFrameRate = (fps) => {
    setFrameRateState(fps);
    StorageService.setItem('@fimax_frame_rate', String(fps));
  };

  const setSleepTimer = (minutes) => {
    if (!minutes) {
      setSleepTimerState(null);
      setSleepTimerEndTime(null);
      setSleepTimerRemaining(null);
      return;
    }
    setSleepTimerState(minutes);
    const targetEnd = Date.now() + minutes * 60 * 1000;
    setSleepTimerEndTime(targetEnd);
    setSleepTimerRemaining(minutes * 60);
  };

  // Real Sleep Timer countdown interval
  useEffect(() => {
    if (!sleepTimerEndTime) return;

    const timerInterval = setInterval(() => {
      const remainingMs = sleepTimerEndTime - Date.now();
      if (remainingMs <= 0) {
        clearInterval(timerInterval);
        setSleepTimerState(null);
        setSleepTimerEndTime(null);
        setSleepTimerRemaining(null);
        // Automatically stop playing movie and close player
        setActiveMovieForPlayer(null);
        Alert.alert(
          'Hẹn Giờ Tắt Phim 💤',
          'Đã hết thời gian hẹn giờ xem phim. FIMAX đã tự động dừng phát video để bạn nghỉ ngơi.'
        );
      } else {
        setSleepTimerRemaining(Math.ceil(remainingMs / 1000));
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [sleepTimerEndTime]);

  const changePassword = (oldPassword, newPassword) => {
    if (!user) {
      return { success: false, error: 'Vui lòng đăng nhập tài khoản để đổi mật khẩu.' };
    }
    if (user.password && user.password !== oldPassword) {
      return { success: false, error: 'Mật khẩu hiện tại không chính xác. Vui lòng kiểm tra lại!' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Mật khẩu mới phải có ít nhất 6 ký tự.' };
    }

    const updatedUser = { ...user, password: newPassword };
    setUser(updatedUser);
    StorageService.setItem('@fimax_auth_user', JSON.stringify(updatedUser));

    setRegisteredUsers(currentUsers => {
      const updated = currentUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
      StorageService.setItem('@fimax_registered_users', JSON.stringify(updated));
      return updated;
    });

    return { success: true };
  };

  const setNotificationsEnabled = (val) => {
    setNotificationsEnabledState(val);
    StorageService.setItem('@fimax_notif_enabled', String(val));
  };

  const showNotificationPopup = async (title, message, movie = null, type = 'movie') => {
    if (!notificationsEnabled) return;

    // Dispatch REAL Apple iOS Native Notification into iOS Notification Center, Lockscreen & Audio
    await NotificationService.sendNativeNotification(
      title,
      message,
      { movie, type }
    );
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

  const toggleFavorite = (movieId, movieObj = null) => {
    setFavorites(prev => {
      let next;
      const isCurrentlyFav = prev.includes(movieId);
      if (isCurrentlyFav) {
        next = prev.filter(id => id !== movieId);
        showNotificationPopup(
          'Đã Xóa Khỏi Yêu Thích',
          movieObj ? `Đã gỡ phim "${movieObj.title}" khỏi Thư Viện của bạn.` : 'Đã gỡ phim khỏi danh sách yêu thích.',
          movieObj,
          'movie'
        );
      } else {
        next = [...prev, movieId];
        showNotificationPopup(
          '❤️ Đã Thêm Vào Yêu Thích',
          movieObj ? `Phim "${movieObj.title}" đã được lưu vào Thư Viện của bạn!` : 'Đã lưu phim vào Thư Viện yêu thích!',
          movieObj,
          'movie'
        );
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
      setThemeMode: (mode) => {
        setThemeMode(mode);
        StorageService.setItem('@fimax_theme_mode', mode);
      },
      accentColor,
      setAccentColor: (color) => {
        setAccentColor(color);
        StorageService.setItem('@fimax_accent_color', color);
      },
      fontSizeScale,
      setFontSizeScale,
      fontWeightMode,
      setFontWeightMode,
      layoutDensity,
      setLayoutDensity,
      appIcon,
      setAppIcon: (iconId) => {
        setAppIcon(iconId);
        StorageService.setItem('@fimax_app_icon', iconId);
      },
      ambientLighting,
      setAmbientLighting,
      frameRate,
      setFrameRate,
      sleepTimer,
      sleepTimerRemaining,
      setSleepTimer,
      changePassword,
      currentLanguage,
      setLanguage,
      t,
      LANGUAGES,
      notificationsEnabled,
      setNotificationsEnabled,
      showNotificationPopup,
      fimaxPoints,
      setFimaxPoints,
      checkInStreak,
      lastCheckInDate,
      checkInToday,
      redeemReward,
      redeemedRewards,
      movieRequests,
      submitMovieRequest,
      upvoteMovieRequest,
      activeWatchParty,
      createWatchParty,
      joinWatchParty,
      leaveWatchParty,
      apiUrl,
      setApiUrl,
      callbackUrl,
      setCallbackUrl
    }}>
      {children}
    </AppContext.Provider>
  );
};
