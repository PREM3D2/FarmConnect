import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProjectListScreen from '../../screens/Projects/ProjectListScreen';
import ProjectDetailScreen from '../../screens/Projects/ProjectDetailScreen';

const Stack = createStackNavigator();

const ProjectStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ProjectList">
      <Stack.Screen name="ProjectList" component={ProjectListScreen} options={{ title: 'Projects' }} />
      <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ title: 'Project Details' }} />
    </Stack.Navigator>
  );
};

export default ProjectStackNavigator;
