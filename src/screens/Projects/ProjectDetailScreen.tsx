import React, { useState, createContext } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Land from './ProjectDetailScreens/Land';
import Pumps from './ProjectDetailScreens/Pumps';
import Crops from './ProjectDetailScreens/Crops';
import Venturi from './ProjectDetailScreens/Venturi';
import { useRoute } from '@react-navigation/native';
import type { Project, ProjectStackParamList } from './ProjectListScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';




export const ProjectDetailContext = createContext<Project | undefined>(undefined);

const ProjectDetailScreen = ({ }) => {
  const navigation = useNavigation<NativeStackNavigationProp<ProjectStackParamList>>();
  const route = useRoute();
  const { project } = (route.params as { project: Project }); // assuming you passed { project: ProjectDetail }

  return (
    <ProjectDetailContext.Provider value={project}>
      <View style={{ flex: 1 }}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={22} color='#388e3c' />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{project.projectName}</Text>
        </View>
        <View style={styles.gridContainer}>
          {[
            { key: 'img1', label: 'Lands', img: require('../../../assets/images/Land_Image.png'), route: 'LandScreen' },
            { key: 'img2', label: 'Pumps', img: require('../../../assets/images/Pump_Image.png'), route: 'PumpScreen' },
            { key: 'img3', label: 'Venturis', img: require('../../../assets/images/Venturi_Image.png'), route: 'VenturiScreen' },
            { key: 'img4', label: 'Crops', img: require('../../../assets/images/Crop_Image.png'), route: 'CropListScreen' },
            { key: 'img5', label: 'Schedules', img: require('../../../assets/images/Schedule_Image.png'), route: 'LandScreen' },
          ].map((item) => (
            <View style={styles.gridItem}  key={item.key}>
              <TouchableOpacity style={styles.imageWrapper} onPress={() => navigation.navigate({ name: item.route as any, params: { project: project } })}>
                <View style={styles.imageBox}>
                  <Image source={item.img} style={styles.image} />
                </View>
              </TouchableOpacity>
              <Text style={styles.imageLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </ProjectDetailContext.Provider>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  gridItem: {
    width: '47%',
    marginBottom: 24,
    alignItems: 'center',
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f7faff',
    elevation: 2,
  },
  imageBox: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  image: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
  },
  imageLabel: {
    marginTop: 2,
    fontSize: 20,
    color: '#388e3c',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProjectDetailScreen;
