import React from 'react';
import { StatusBar, Platform, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './src/store/store';
import AuthStack from './src/navigation/AuthStack';
import MainStack from './src/navigation/MainStack';
import AppHeaderLayout from './src/components/AppHeaderLayout';
import Toast from 'react-native-toast-message';
import toastConfig from './src/components/ToastConfig';
import { useColorScheme } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { CombinedDarkTheme, CombinedLightTheme } from './src/theme/AppTheme';

const AppContent = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isLoggedIn = !!token; // ← restore this in production
  // const isLoggedIn = true; // use this only for testing

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const theme = isDarkMode ? CombinedDarkTheme : CombinedLightTheme;
  const statusBarHeight = getStatusBarHeight();

  return (
    <PaperProvider theme={theme}>
      <View style={{ flex: 1, paddingTop: Platform.OS === 'android' ? statusBarHeight : 0 }}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={'dark-content'}
        />
        <NavigationContainer theme={theme}>
          {isLoggedIn ? (
            <AppHeaderLayout>
              <MainStack />
            </AppHeaderLayout>
          ) : (
            <AuthStack />
          )}
        </NavigationContainer>
        <Toast config={toastConfig} />
      </View>
    </PaperProvider>
  );
};

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
