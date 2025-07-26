import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './src/store/store';
import MainStack from './src/navigation/MainStack';
import AppHeaderLayout from './src/components/AppHeaderLayout'; // Import AppHeaderLayout
import Toast from 'react-native-toast-message';
import toastConfig from './src/components/ToastConfig';

const AppContent = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isLoggedIn = !!token; // directly use
  
  return (
    <SafeAreaView style={{ flex: 1, marginTop: 40 }}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        {isLoggedIn ? (
          <AppHeaderLayout>
            <MainStack/>
          </AppHeaderLayout>
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
};

const App = () => (
  <Provider store={store}>
    <PaperProvider>
      <AppContent />
    </PaperProvider>
  </Provider>
);

export default App;