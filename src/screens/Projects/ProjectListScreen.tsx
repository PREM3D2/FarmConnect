import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProjectService from '../../services/ProjectService';

export type Project = {
  projectId: number;
  projectName: string;
  projectShortName: string;
  projectDesc: string;
  projectLandArea: number;
  projectAddress: string;
  projectAddressPincode: number;
  soilId: number;
  soilName: string;
};

export type ProjectStackParamList = {
    ProjectList: undefined;
    ProjectDetailScreen: { project: Project };
    LandScreen: undefined;
    PumpScreen: undefined;
    VenturiScreen: undefined;
    CropScreen: undefined;
};

const ProjectListScreen = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<ProjectStackParamList>>();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await ProjectService.getProjects();
        setProjects(response.result || []);
      } catch (error) {
      }
    };
    fetchProjects();
  },[]);


  const handleClickofItem = (item: Project) => {
    navigation.navigate('ProjectDetailScreen', { project: item });
  }

  const renderItem = ({ item }: { item: Project }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleClickofItem(item)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.bold}>{item.projectName} ({item.projectShortName})</Text>
        <Text style={{color:'green',  fontWeight: 'bold',}}>{item.projectLandArea} Acres</Text>
        <Text style={{color:'green',  fontWeight: 'bold',}}>{item.soilName}</Text>
        <Text style={styles.projectDescription}>
          {item.projectAddress.length > 60 ? `${item.projectAddress.substring(0, 60)}...` : item.projectAddress}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>Projects</Text>
      </View>
      <FlatList
        data={projects}
        keyExtractor={item => item.projectId.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7faff',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#388e3c',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  projectName: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  projectArea: {
    fontSize: 15,
    marginBottom: 4,
    color: '#388e3c',
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
  },
  bold: {
    fontWeight: 'bold',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconBtn: {
    marginLeft: 8,
    padding: 2,
  },
});

export default ProjectListScreen;
