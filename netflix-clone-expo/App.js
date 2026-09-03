import React, { Component, useState, useContext } from 'react';
import { View, StyleSheet, StatusBar, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppProvider, AppContext } from './src/context/AppContext';
import { getThemeColors } from './src/theme/colors';

import { CustomTabBar } from './src/components/CustomTabBar';
import { SplashScreen } from './src/components/SplashScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { DownloadScreen } from './src/screens/DownloadScreen';
import { AccountScreen } from './src/screens/AccountScreen';
import { DetailScreen } from './src/screens/DetailScreen';
import { CinemaPlayer } from './src/components/CinemaPlayer';

// Global Error Boundary to prevent any unhandled black-screen crash
class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Unhandled React Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>FIMAX Cinema</Text>
          <Text style={styles.errorSubtitle}>Đã khởi động lại phiên xem phim an toàn.</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.retryBtnText}>Vào Trang Chủ</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  animationDuration: 280
};

function HomeStack() {
  const { themeMode } = useContext(AppContext);
  const theme = getThemeColors(themeMode);
  return (
    <Stack.Navigator screenOptions={{ ...screenOptions, contentStyle: { backgroundColor: theme.background } }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}

function ExploreStack() {
  const { themeMode } = useContext(AppContext);
  const theme = getThemeColors(themeMode);
  return (
    <Stack.Navigator screenOptions={{ ...screenOptions, contentStyle: { backgroundColor: theme.background } }}>
      <Stack.Screen name="ExploreMain" component={ExploreScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}

function LibraryStack() {
  const { themeMode } = useContext(AppContext);
  const theme = getThemeColors(themeMode);
  return (
    <Stack.Navigator screenOptions={{ ...screenOptions, contentStyle: { backgroundColor: theme.background } }}>
      <Stack.Screen name="LibraryMain" component={LibraryScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}

function DownloadStack() {
  const { themeMode } = useContext(AppContext);
  const theme = getThemeColors(themeMode);
  return (
    <Stack.Navigator screenOptions={{ ...screenOptions, contentStyle: { backgroundColor: theme.background } }}>
      <Stack.Screen name="DownloadMain" component={DownloadScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}

function MainNavigation() {
  const { activeMovieForPlayer, setActiveMovieForPlayer, themeMode, accentColor } = useContext(AppContext);
  const [showSplash, setShowSplash] = useState(true);
  const theme = getThemeColors(themeMode);

  const customNavigationTheme = {
    ...(theme.isLight ? DefaultTheme : DarkTheme),
    colors: {
      ...(theme.isLight ? DefaultTheme.colors : DarkTheme.colors),
      background: theme.background,
      card: theme.tabBarBg,
      text: theme.textPrimary,
      border: theme.tabBarBorder,
      primary: accentColor
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={theme.isLight ? 'dark-content' : 'light-content'}
        backgroundColor={theme.background}
      />
      
      {/* 1. Underlying Main Navigation (always active & mounted immediately) */}
      <NavigationContainer theme={customNavigationTheme}>
        <Tab.Navigator
          tabBar={(props) => <CustomTabBar {...props} />}
          screenOptions={{ headerShown: false }}
        >
          <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Trang Chủ' }} />
          <Tab.Screen name="ExploreTab" component={ExploreStack} options={{ title: 'Khám Phá' }} />
          <Tab.Screen name="LibraryTab" component={LibraryStack} options={{ title: 'Thư Viện' }} />
          <Tab.Screen name="DownloadTab" component={DownloadStack} options={{ title: 'Tải Xuống' }} />
          <Tab.Screen name="AccountTab" component={AccountScreen} options={{ title: 'Tài Khoản' }} />
        </Tab.Navigator>
      </NavigationContainer>

      {/* 2. Global Cinema Player Modal */}
      {activeMovieForPlayer && (
        <CinemaPlayer
          visible={!!activeMovieForPlayer}
          movie={activeMovieForPlayer}
          onClose={() => setActiveMovieForPlayer(null)}
        />
      )}

      {/* 3. Smooth Cinematic Splash Screen Overlay */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}
    </View>
  );
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <SafeAreaProvider>
        <AppProvider>
          <MainNavigation />
        </AppProvider>
      </SafeAreaProvider>
    </GlobalErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0A0A0C',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  errorTitle: {
    color: '#E50914',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8
  },
  errorSubtitle: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24
  },
  retryBtn: {
    backgroundColor: '#E50914',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14
  }
});
