import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProjectListScreen from '../screens/Projects/ProjectListScreen';
import ProjectDetailScreen from '../screens/Projects/ProjectDetailScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => (
  <Stack.Navigator initialRouteName="Projects" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Projects" component={ProjectListScreen} />
    <Stack.Screen name="ProjectDetailScreen" component={ProjectDetailScreen} />
  </Stack.Navigator>
);

export default MainStack;