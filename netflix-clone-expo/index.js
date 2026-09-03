import { registerRootComponent } from 'expo';
import { enableScreens } from 'react-native-screens';
import App from './App';

// Optimize native screens for React Navigation v6
enableScreens(true);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
registerRootComponent(App);
