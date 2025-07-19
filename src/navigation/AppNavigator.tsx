import React, { useState } from 'react';
import AppTabs from './AppTabs';
import LoginScreen from '../screens/Login/LoginScreen';
import AppSlider from '../components/Slider/AppSlider';
import { View, TouchableOpacity, Text } from 'react-native';


const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sliderVisible, setSliderVisible] = useState(false);

  const HeaderLeft = () => (
    <TouchableOpacity style={{ marginLeft: 16 }} onPress={() => setSliderVisible(true)}>
      {/* Hamburger icon using react-native-vector-icons */}
      <Text>Slider</Text>
    </TouchableOpacity>
  );

  // Render login screen until user logs in, then show main app
  if (!isLoggedIn) {
    return <LoginScreen setIsLoggedIn={() => setIsLoggedIn(true)} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <AppSlider visible={sliderVisible} onClose={() => setSliderVisible(false)} />
      <AppTabs />
      {/* Custom header for hamburger icon */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 56, backgroundColor: '#f7faff', flexDirection: 'row', alignItems: 'center', zIndex: 99, elevation: 4 }}>
        <HeaderLeft />
      </View>
    </View>
  );
};

export default AppNavigator;
