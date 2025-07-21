import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './src/store/store';
import MainStack from './src/navigation/MainStack';
import AppTabs from './src/navigation/AppTabs';
import AppHeaderLayout from './src/components/AppHeaderLayout'; // Import AppHeaderLayout

const AppContent = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const isLoggedIn = !!token; // directly use
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
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