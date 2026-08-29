import os

expo_dir = r"C:\Users\ADMIN\.gemini\antigravity\scratch\netflix-cinema-project\netflix-clone-expo"
src_dir = os.path.join(expo_dir, "src")
os.makedirs(os.path.join(src_dir, "theme"), exist_ok=True)
os.makedirs(os.path.join(src_dir, "data"), exist_ok=True)
os.makedirs(os.path.join(src_dir, "services"), exist_ok=True)
os.makedirs(os.path.join(src_dir, "context"), exist_ok=True)
os.makedirs(os.path.join(src_dir, "components"), exist_ok=True)
os.makedirs(os.path.join(src_dir, "screens"), exist_ok=True)

# 1. package.json
package_json = """{
  "name": "netflix-cinema-expo",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-status-bar": "~1.12.1",
    "expo-av": "~14.0.5",
    "react": "18.2.0",
    "react-native": "0.74.5",
    "react-native-safe-area-context": "4.10.1",
    "react-native-screens": "3.31.1",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/bottom-tabs": "^6.5.20",
    "@react-navigation/native-stack": "^6.9.26",
    "@expo/vector-icons": "^14.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}"""
with open(os.path.join(expo_dir, "package.json"), "w", encoding="utf-8") as f:
    f.write(package_json)

# 2. app.json
app_json = """{
  "expo": {
    "name": "Netflix Cinema",
    "slug": "netflix-cinema-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "backgroundColor": "#141414"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#141414"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}"""
with open(os.path.join(expo_dir, "app.json"), "w", encoding="utf-8") as f:
    f.write(app_json)

# 3. src/theme/colors.js
colors_js = """export const Colors = {
  primary: '#E50914',
  background: '#141414',
  card: '#1F1F1F',
  cardAlt: '#2A2A2A',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textMuted: '#666666',
  border: '#333333',
  gold: '#FFD700',
  success: '#46D369',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.75)',
  gradientDark: 'rgba(20, 20, 20, 0.95)'
};
"""
with open(os.path.join(src_dir, "theme", "colors.js"), "w", encoding="utf-8") as f:
    f.write(colors_js)

print("Created Expo core configuration")