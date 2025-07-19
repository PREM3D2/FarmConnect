import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProjectsScreen from '../screens/Projects/ProjectsScreen';
import CropsScreen from '../screens/Crops/CropsScreen';
import MarketScreen from '../screens/Market/MarketScreen';
import WeatherScreen from '../screens/Weather/WeatherScreen';
import { View, Text, Image } from 'react-native';

const Tab = createBottomTabNavigator();

const tabIcons: Record<string, string> = {
  Projects: 'https://img.icons8.com/color/48/000000/project.png',
  Crops: 'https://img.icons8.com/color/48/000000/wheat.png',
  Market: 'https://img.icons8.com/color/48/000000/market-square.png',
  Weather: 'https://img.icons8.com/color/48/000000/partly-cloudy-day.png',
};

const badgeCounts: Record<string, number> = {
  Projects: 2,
  Crops: 5,
  Market: 1,
  Weather: 0,
};

const AppTabs = () => (
  <Tab.Navigator initialRouteName="Projects"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused }) => (
        <View style={{ alignItems: 'center' }}>
          <Image
            source={{ uri: tabIcons[route.name] }}
            style={{ width: 28, height: 28, tintColor: focused ? '#007bff' : '#888' }}
          />
          {badgeCounts[route.name] > 0 && (
            <View style={{
              position: 'absolute',
              top: -4,
              right: -10,
              backgroundColor: '#ff5252',
              borderRadius: 8,
              paddingHorizontal: 5,
              paddingVertical: 1,
              minWidth: 16,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{badgeCounts[route.name]}</Text>
            </View>
          )}
        </View>
      ),
      tabBarLabel: ({ focused }) => (
        <Text style={{ color: focused ? '#007bff' : '#888', fontSize: 12, fontWeight: focused ? 'bold' : 'normal' }}>{route.name}</Text>
      ),
      tabBarStyle: {
        backgroundColor: '#f7faff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        height: 60,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Projects" component={ProjectsScreen} />
    <Tab.Screen name="Crops" component={CropsScreen} />
    <Tab.Screen name="Market" component={MarketScreen} />
    <Tab.Screen name="Weather" component={WeatherScreen} />
  </Tab.Navigator>
);

export default AppTabs;
