import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const dummyProjects = [
  {
    id: '1',
    name: 'Green Valley',
    area: 120,
    description: 'A large organic farm focused on sustainable agriculture and innovative crop rotation methods. This project is a model for eco-friendly farming practices in the region.'
  },
  {
    id: '2',
    name: 'Sunrise Acres',
    area: 75,
    description: 'A mid-sized farm specializing in high-yield wheat and corn production. The project uses modern irrigation and soil management techniques.'
  },
  {
    id: '3',
    name: 'Riverbend Project',
    area: 200,
    description: 'A riverside farm with advanced water management and a focus on fruit orchards. The project is known for its community engagement and educational programs.'
  },
  {
    id: '4', name: 'Mountain View', area: 150, description: 'A farm located in the foothills, specializing in organic vegetables and herbs. Known for its scenic beauty and eco-tourism.' },
  {
    id: '5', name: 'Golden Fields', area: 90, description: 'A wheat and barley farm with modern machinery and efficient crop management.' },
  {
    id: '6', name: 'Blue Lake Farm', area: 110, description: 'A lakeside farm with a focus on aquaculture and rice cultivation.' },
  {
    id: '7', name: 'Sunny Orchard', area: 60, description: 'A small orchard producing apples, pears, and peaches for local markets.' },
  {
    id: '8', name: 'EcoFarm', area: 130, description: 'A sustainable farm using renewable energy and permaculture techniques.' },
  {
    id: '9', name: 'Harvest Ranch', area: 180, description: 'A large ranch with cattle, grains, and a variety of crops.' },
  {
    id: '10', name: 'Riverbank Estate', area: 95, description: 'A riverside estate with vineyards and berry plantations.' },
  {
    id: '11', name: 'Green Pastures', area: 140, description: 'A dairy farm with lush pastures and modern milking facilities.' },
  {
    id: '12', name: 'Sunset Farm', area: 80, description: 'A farm known for its beautiful sunsets and organic produce.' },
  {
    id: '13', name: 'Maple Grove', area: 105, description: 'A maple syrup farm with extensive groves and eco-friendly practices.' },
  {
    id: '14', name: 'Cedar Hill', area: 170, description: 'A hilly farm with cedar trees and mixed crops.' },
  {
    id: '15', name: 'Willow Springs', area: 125, description: 'A spring-fed farm with a focus on irrigation and water conservation.' },
  {
    id: '16', name: 'Oakwood Farm', area: 155, description: 'A farm surrounded by oak trees, specializing in nuts and grains.' },
  {
    id: '17', name: 'Berry Patch', area: 50, description: 'A small berry farm with strawberries, blueberries, and raspberries.' },
  {
    id: '18', name: 'FarmConnect Demo', area: 100, description: 'A demonstration farm for new agricultural technologies and smart farming.' },
  {
    id: '19', name: 'Pine Ridge', area: 160, description: 'A pine forest farm with timber and mushroom cultivation.' },
  {
    id: '20', name: 'Silver Meadows', area: 85, description: 'A meadow farm with wildflowers, honey production, and sheep grazing.' },
];

const ProjectListScreen = () => {
  const [projects, setProjects] = useState(dummyProjects);
  const navigation = useNavigation();

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Project',
      'Do you want to delete the Project?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => setProjects(projects.filter(p => p.id !== id)) },
      ],
      { cancelable: true }
    );
  };

  type Project = {
    id: string;
    name: string;
    area: number;
    description: string;
  };
  
  const renderItem = ({ item }: { item: Project }) => (
    <TouchableOpacity style={styles.card} onPress={() => (navigation as any).navigate('ProjectDetail', { project: item })}>
      <View style={{ flex: 1 }}>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => {/* handle edit */}}>
            <Icon name="pencil" size={22} color="#388e3c" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => handleDelete(item.id)}>
            <Icon name="delete" size={22} color="#ff5252" />
          </TouchableOpacity>
        </View>
        <Text style={styles.projectName}>Project Name: <Text style={styles.bold}>{item.name}</Text></Text>
        <Text style={styles.projectArea}>Area: <Text style={styles.bold}>{item.area} acres</Text></Text>
        <Text style={styles.projectDescription}>
          Description: {item.description.length > 60 ? `${item.description.substring(0, 60)}...` : item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Total Projects: {projects.length}</Text>
      <FlatList
        data={projects}
        keyExtractor={item => item.id}
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
