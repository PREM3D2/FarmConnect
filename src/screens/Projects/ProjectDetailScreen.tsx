import React from 'react';
import { useRoute } from '@react-navigation/native';
import Land from './ProjectDetailScreens/Land';
import Pumps from './ProjectDetailScreens/Pumps';
import CropList from './ProjectDetailScreens/CropList';
import Venturi from './ProjectDetailScreens/Venturi';
// import OverviewScreen from './OverviewScreen'; // <- Your grid page here
import type { Project } from './ProjectListScreen';
import ReusableBottomTabs from '../../navigation/ReusableBottomTabs';
import CropsStack from '../../navigation/CropStackScreen';

const ProjectDetailScreen = () => {
  const route = useRoute();
  const { project } = route.params as { project: Project };

  const tabs = [
    { name: 'Crops', component: CropsStack, icon: 'seed' },
    { name: 'Lands', component: Land, icon: 'home-group' },
    { name: 'Pumps', component: Pumps, icon: 'water-pump' },
    { name: 'Venturi', component: Venturi, icon: 'fan' },
    // { name: 'Overview', component: OverviewScreen, icon: 'view-grid-outline' },
  ];

  return (
    <ReusableBottomTabs
      project={project}
      tabs={tabs}
      initialRouteName="Crops"
    />
  );
};

export default ProjectDetailScreen;
