import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProjectListScreen from '../screens/Projects/ProjectListScreen';
import ProjectDetailScreen from '../screens/Projects/ProjectDetailScreen';
import Land from '../screens/Projects/ProjectDetailScreens/Land';
import Venturi from '../screens/Projects/ProjectDetailScreens/Venturi';
import Crops from '../screens/Projects/ProjectDetailScreens/Crops';
import Pumps from '../screens/Projects/ProjectDetailScreens/Pumps';
import CropList from '../screens/Projects/ProjectDetailScreens/CropList';
import Schedules from '../screens/Projects/ProjectDetailScreens/Schedules';

const Stack = createNativeStackNavigator();

const MainStack = () => (
  <Stack.Navigator initialRouteName="Projects" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Projects" component={ProjectListScreen} />
    <Stack.Screen name="ProjectDetailScreen" component={ProjectDetailScreen} />
    <Stack.Screen name="LandScreen" component={Land} />
    <Stack.Screen name="VenturiScreen" component={Venturi} />
    <Stack.Screen name="CropScreen" component={Crops} />
    <Stack.Screen name="CropListScreen" component={CropList} />
    <Stack.Screen name="PumpScreen" component={Pumps} />
    <Stack.Screen name="ScheduleScreen" component={Schedules} />
  </Stack.Navigator>
);

export default MainStack;