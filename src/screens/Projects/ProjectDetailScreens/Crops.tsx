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
import CustomTabView from '../../../components/CustomTabView';
import { Project } from '../ProjectListScreen';

const initialLayout = { width: Dimensions.get('window').width };

const Crops = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { project } = (route.params as { project: Project });
  const { code } = (route.params as { code: number });

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

  const Home = () => (
    <View style={styles.scene}>
      <CropHome project={project} cropCode ={code} />
    </View>
  );

  const Stacking = () => (
    <View style={styles.scene}>
      <CropStacking project={project} cropCode ={code}/>
    </View>
  );

  const Cultivation = () => (
    <View style={styles.scene}>
      <Text>Home Screen</Text>
    </View>
  );

  const Harvest = () => (
    <View style={styles.scene}>
      <Text>stack Screen</Text>
    </View>
  );
  const Protection = () => (
    <View style={styles.scene}>
      <Text>Home Screen</Text>
    </View>
  );

  const Uproot = () => (
    <View style={styles.scene}>
      <Text>stack Screen</Text>
    </View>
  );

  const Nursery = () => (
    <View style={styles.scene}>
      <Text>stack Screen</Text>
    </View>
  );


  // const renderScene = ({ route }: { route: { key: string; title: string; params: any } }) => {
  //   switch (route.key) {
  //     case 'home':
  //       return <CropHome projectInfo={route.params} />;
  //     case 'stacking':
  //       return <CropStacking projectInfo={route.params} />;
  //     case 'cultivation':
  //       return <CropCultivation projectInfo={route.params} />;
  //     case 'harvest':
  //       return <CropHarvest projectInfo={route.params} />;
  //     case 'protection':
  //       return <CropProtection projectInfo={route.params} />;
  //     case 'uproot':
  //       return <CropUproot projectInfo={route.params} />;
  //     case 'nursery':
  //       return <CropNursery projectInfo={route.params} />;
  //     default:
  //       return null;
  //   }
  // };

  const scenes = {
    home: Home,
    stacking: Stacking,
    cultivation: Cultivation,
    harvest: Harvest,
    protection: Protection,
    uproot: Uproot,
    nursery: Nursery
    // positions: Positions,
    // executed: Executed,
    // pending: Pending,
    // rejected: Rejected,
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      scrollEnabled={true} // ✅ Make tabs scrollable
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
      tabStyle={{ width: 'auto' }} // ✅ Allow dynamic width for each tab
      renderLabel={({
        route,
        focused,
      }: {
        route: { key: string; title: string; params: any };
        focused: boolean;
        color: string;
      }) => (
        <Text style={[styles.label, focused && styles.labelFocused]}>
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header with Back Button and Project Name */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#388e3c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crops</Text>
      </View>
      <CustomTabView
        routes={routes}
        scenes={scenes}
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
  scene: {
    flex: 1,
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
  tabBar: {
    elevation: 0,
  },
  label: {
    color: '#888', // Inactive tab color
    fontSize: 14,
    fontWeight: '600',
  },
  labelFocused: {
    color: '#388e3c', // Active tab label color (Zerodha green)
    fontWeight: '700',
  },
  indicator: {
    backgroundColor: '#388e3c', // Active tab underline
    height: 2,
    borderRadius: 1,
  },
});

export default Crops;
