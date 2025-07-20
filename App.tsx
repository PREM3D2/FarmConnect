import React, { useEffect, useState } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import AppTabs from './src/navigation/AppTabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './src/store/store';

const AppContent = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        {isLoggedIn ? (
          <AppTabs />
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
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