import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Project, ProjectStackParamList } from '../screens/Projects/ProjectListScreen';

const Tab = createBottomTabNavigator();

const Header = ({ title }: { title: string }) => {
  const navigation = useNavigation<NativeStackNavigationProp<ProjectStackParamList>>();
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('ProjectListScreen')} style={styles.backBtn}>
        <MaterialCommunityIcons name="arrow-left" size={22} color="#388e3c" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

type TabItem = {
  name: string;
  component: React.ComponentType<any>;
  icon: string;
  label?: string;
};

interface Props {
  project: Project;
  tabs: TabItem[];
  initialRouteName: string;
}

const ReusableBottomTabs: React.FC<Props> = ({ project, tabs, initialRouteName }) => {
  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        header: () => <Header title={project.projectName} />,
        tabBarActiveTintColor: '#388e3c',
      }}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          initialParams={{ project }}
          options={{
            title: tab.label ?? tab.name,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name={tab.icon} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f7faff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ReusableBottomTabs;
