import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProjectDetailScreen from '../screens/Projects/ProjectDetailScreen';
import ProjectsScreen from '../screens/Projects/ProjectsScreen';

const Stack = createStackNavigator();

const ProjectStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Projects">
            <Stack.Screen name="Projects" component={ProjectsScreen} options={{ title: 'Projects' }} />
            <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ title: 'Project Details' }} />
        </Stack.Navigator>
    );
};

export default ProjectStackNavigator;
