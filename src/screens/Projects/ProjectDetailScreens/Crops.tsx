import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import CropHome from './CropTabs/CropHome';
import CropStacking from './CropTabs/CropStacking';
import CropNursery from './CropTabs/CropNursery';
import CropProtection from './CropTabs/CropProtection';
import CropCultivation from './CropTabs/CropCultivation';
import CropHarvest from './CropTabs/CropHarvest';
import CustomTabView from '../../../components/CustomTabView';
import { Project } from '../ProjectListScreen';
import CropUproot from './CropTabs/CropUproot';


const Crops = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { project } = (route.params as { project: Project });
  const { cropDetail } = (route.params as { cropDetail: any });

  const [routes, setRoutes] = useState([
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
      <CropHome project={project} cropCode={cropDetail.code} />
    </View>
  );

  const Stacking = () => (
    <View style={styles.scene}>
      <CropStacking project={project} cropCode={cropDetail.code} />
    </View>
  );

  const Cultivation = () => (
    <View style={styles.scene}>
      <CropCultivation project={project} cropCode={cropDetail.code} />
    </View>
  );

  const Harvest = () => (
    <View style={styles.scene}>
      <CropHarvest project={project} cropCode={cropDetail.code} />
    </View>
  );
  const Protection = () => (
    <View style={styles.scene}>
      <CropProtection project={project} cropCode={cropDetail.code} />
    </View>
  );

  const Uproot = () => (
    <View style={styles.scene}>
      <CropUproot project={project} cropCode={cropDetail.code} />
    </View>
  );

  const Nursery = () => (
    <View style={styles.scene}>
      <CropNursery project={project} cropCode={cropDetail.code} />
    </View>
  );

  const scenes = {
    home: Home,
    stacking: Stacking,
    cultivation: Cultivation,
    harvest: Harvest,
    protection: Protection,
    uproot: Uproot,
    nursery: Nursery
  };

  useEffect(() => {
    let updatedRoutes = [...routes];

    if (cropDetail.cropCultivationType === 'sowing') {
      updatedRoutes = updatedRoutes.filter((x) => x.key !== 'nursery');
    }

    if (!cropDetail.protectionsRequired) {
      updatedRoutes = updatedRoutes.filter((x) => x.key !== 'protection');
    }

    setRoutes(updatedRoutes);
  }, [])


  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header with Back Button and Project Name */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#388e3c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{cropDetail?.cropName}</Text>
      </View> */}
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
