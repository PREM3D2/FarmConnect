import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const initialLayout = { width: Dimensions.get('window').width };

const LandRoute = () => (
  <View style={styles.scene}><Text>Land Details</Text></View>
);
const PumpsRoute = () => (
  <View style={styles.scene}><Text>Pumps Details</Text></View>
);
const CropsRoute = () => (
  <View style={styles.scene}><Text>Crops Details</Text></View>
);
const VenturiRoute = () => (
  <View style={styles.scene}><Text>Venturi Details</Text></View>
);

const ProjectDetailScreen = () => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0); // Initial tab is LandRoute
  const [routes] = useState([
    { key: 'land', title: 'Land' },
    { key: 'pumps', title: 'Pumps' },
    { key: 'crops', title: 'Crops' },
    { key: 'others', title: 'Others' },
  ]);

  const renderScene = SceneMap({
    land: LandRoute,
    pumps: PumpsRoute,
    venturi : VenturiRoute,
    crops: CropsRoute,
    
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Project Details</Text>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#388e3c' }}
            style={{ backgroundColor: '#f7faff' }}
            // labelStyle={{ color: '#388e3c', fontWeight: 'bold' }}
          />
        )}
      />
    </View>
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
