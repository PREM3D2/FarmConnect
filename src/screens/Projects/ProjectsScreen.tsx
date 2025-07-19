import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProjectListScreen from './ProjectListScreen';

const ProjectsScreen = () => (
  <View style={styles.container}>
    {/* <Text style={styles.text}>Projects Screen</Text> */}
    <ProjectListScreen/>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ProjectsScreen;
