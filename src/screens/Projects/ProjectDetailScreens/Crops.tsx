
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import CropHome from './CropTabs/CropHome';
import CropStacking from './CropTabs/CropStacking';
import CropNursery from './CropTabs/CropNursery';
import CropProtection from './CropTabs/CropProtection';
import CropCultivation from './CropTabs/CropCultivation';
import CropHarvest from './CropTabs/CropHarvest';
import CropUproot from './CropTabs/CropUproot';

const initialLayout = { width: Dimensions.get('window').width };

const Crops = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // Try to get project name from route params if available
  const projectName = (route.params && (route.params as any).project?.projectName) || 'Project';

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Home', params: route.params },
    { key: 'stacking', title: 'Stacking', params: route.params },
    { key: 'nursery', title: 'Nursery', params: route.params },
    { key: 'protection', title: 'Protection', params: route.params },
    { key: 'cultivation', title: 'Cultivation', params: route.params },
    { key: 'harvest', title: 'Harvest', params: route.params },
    { key: 'uproot', title: 'Up Root', params: route.params },
  ]);

  // const renderScene = SceneMap({
  //   home: CropHome,
  //   stacking: CropStacking,
  //   nursery: CropNursery,
  //   protection: CropProtection,
  //   cultivation: CropCultivation,
  //   harvest: CropHarvest,
  //   uproot: CropUproot,
  // });


  const renderScene = ({ route }: {
    route: {
      params: any; key: string; title: string
    }
  }) => {
    switch (route.key) {
      case 'home':
        return <CropHome projectInfo={route.params} />;
      case 'stacking':
        return <CropStacking projectInfo={route.params} />;
      case 'cultivation':
        return <CropCultivation projectInfo={route.params} />;
      case 'harvest':
        return <CropHarvest projectInfo={route.params} />;
      case 'protection':
        return <CropProtection projectInfo={route.params} />;
      case 'uproot':
        return <CropUproot projectInfo={route.params} />;
      case 'nursery':
        return <CropNursery projectInfo={route.params} />;
      default:
        return 'home';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header with Back Button and Project Name */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#388e3c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crops</Text>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={props => (
          <TabBar
            {...props}
            scrollEnabled
            style={{ backgroundColor: '#388e3c' }} // Optional: make sure it blends well
            indicatorStyle={{ backgroundColor: '#f8f6fbff' }}
            activeColor="#ffffff"
            inactiveColor="#f0f0f0"
            tabStyle={{ width: 'auto', paddingHorizontal: 12 }} // <-- Key line
          //labelStyle={{ fontSize: 14, fontWeight: 'bold' }} // Optional: tighten text
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

export default Crops;
