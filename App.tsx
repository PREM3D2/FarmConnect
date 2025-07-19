import React, { useState } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import AppTabs from './src/navigation/AppTabs';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, marginTop:15 }}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        {isLoggedIn ? (
          <AppTabs />
        ) : (
          <AuthStack setIsLoggedIn={setIsLoggedIn} />
        )}
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;