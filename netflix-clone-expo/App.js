import React, { useState, useContext } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { AppProvider, AppContext } from './src/context/AppContext';
import { getThemeColors } from './src/theme/colors';

import { SplashScreen } from './src/components/SplashScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { DetailScreen } from './src/screens/DetailScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { AccountScreen } from './src/screens/AccountScreen';
import { CinemaPlayer } from './src/components/CinemaPlayer';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  const { themeMode } = useContext(AppContext);
  const theme = getThemeColors(themeMode);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.background } }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}

function LibraryStack() {
  const { themeMode } = useContext(AppContext);
  const theme = getThemeColors(themeMode);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.background } }}>
      <Stack.Screen name="LibraryMain" component={LibraryScreen} />
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
      
      {/* 2.2-Second Minimalist Splash Animation */}
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <>
          <NavigationContainer theme={customNavigationTheme}>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                  backgroundColor: theme.tabBarBg,
                  borderTopColor: theme.tabBarBorder,
                  height: 64,
                  paddingBottom: 10,
                  paddingTop: 8
                },
                tabBarActiveTintColor: accentColor,
                tabBarInactiveTintColor: theme.textSecondary,
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
                  else if (route.name === 'LibraryTab') iconName = focused ? 'file-tray-full' : 'file-tray-full-outline';
                  else if (route.name === 'AccountTab') iconName = focused ? 'person' : 'person-outline';
                  return <Ionicons name={iconName} size={22} color={color} />;
                }
              })}
            >
              <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Trang Chủ' }} />
              <Tab.Screen name="LibraryTab" component={LibraryStack} options={{ title: 'Thư Viện' }} />
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
    <AppProvider>
      <MainNavigation />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});