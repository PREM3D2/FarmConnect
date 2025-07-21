import React, { useState, createContext } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Land from './ProjectDetailScreens/Land';
import Pumps from './ProjectDetailScreens/Pumps';
import Crops from './ProjectDetailScreens/Crops';
import Venturi from './ProjectDetailScreens/Venturi';
import { useRoute } from '@react-navigation/native';
import type { Project } from './ProjectListScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { Project } from './ProjectListScreen';

const initialLayout = { width: Dimensions.get('window').width };


export const ProjectDetailContext = createContext<Project | undefined>(undefined);

const ProjectDetailScreen = ({}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { project } = (route.params as { project: Project }); // assuming you passed { project: ProjectDetail }
  const [index, setIndex] = useState(0); // Initial tab is LandRoute
  const [routes] = useState([
    { key: 'land', title: 'Land' },
    { key: 'pumps', title: 'Pumps' },
    { key: 'crops', title: 'Crops' },
    { key: 'venturi', title: 'Venturi' },
  ]);

  const renderScene = SceneMap({
    land: Land,
    pumps: Pumps,
    crops: Crops,
    venturi: Venturi,
  });

  return (
    <ProjectDetailContext.Provider value={project}>
      <View style={{ flex: 1 }}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
           <MaterialCommunityIcons name="arrow-left" size={22} color='#388e3c'/>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{project.projectName}</Text>
        </View>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={props => (
            <TabBar
              {...props}
              style={{ backgroundColor: '#388e3c' }}
              indicatorStyle={{ backgroundColor: '#f8f6fbff' }}
            />
          )}
        />
      </View>
    </ProjectDetailContext.Provider>
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
  backText: {
    color: '#388e3c',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

export default ProjectDetailScreen;
