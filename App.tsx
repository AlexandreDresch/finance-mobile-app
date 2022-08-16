import 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/en-US';

import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Routes } from './src/routes';
import { SignIn } from './src/screens/SignIn';
import { AppRoutes } from './src/routes/app.routes';

import { AuthProvider, useAuth } from './src/hooks/auth';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import { theme } from './src/global/styles/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  const { userStorageLoading } = useAuth();

  if (!fontsLoaded || userStorageLoading) {
    return <AppLoading />
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
    <ThemeProvider theme={theme}>
        <AuthProvider>
          <Routes />
        </AuthProvider>
        <StatusBar style="light" />
    </ThemeProvider>
    </GestureHandlerRootView>
  );
}
