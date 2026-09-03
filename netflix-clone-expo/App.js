import React, { useState, useContext } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppProvider, AppContext } from './src/context/AppContext';
import { getThemeColors } from './src/theme/colors';

import { SplashScreen } from './src/components/SplashScreen';
import { CustomTabBar } from './src/components/CustomTabBar';

import { HomeScreen } from './src/screens/HomeScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { DownloadScreen } from './src/screens/DownloadScreen';
import { AccountScreen } from './src/screens/AccountScreen';
import { DetailScreen } from './src/screens/DetailScreen';
import { CinemaPlayer } from './src/components/CinemaPlayer';

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
      
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <>
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

          {/* Global Cinema Player Modal */}
          {activeMovieForPlayer && (
            <CinemaPlayer
              visible={!!activeMovieForPlayer}
              movie={activeMovieForPlayer}
              onClose={() => setActiveMovieForPlayer(null)}
            />
          )}
        </>
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainNavigation />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
