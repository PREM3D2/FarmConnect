// CropsStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native';
import { Project } from '../screens/Projects/ProjectListScreen';
import CropList from '../screens/Projects/ProjectDetailScreens/CropList';
import Crops from '../screens/Projects/ProjectDetailScreens/Crops';

type RouteParams = { project: Project };

const Stack = createNativeStackNavigator();

const CropsStack = () => {
  const route = useRoute();
  const { project } = route.params as RouteParams;

  return (
    <Stack.Navigator initialRouteName="CropList" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="CropList"
        component={CropList}
        initialParams={{ project }}
      />
      <Stack.Screen name="CropDetail" component={Crops} />
    </Stack.Navigator>
  );
};

export default CropsStack;
