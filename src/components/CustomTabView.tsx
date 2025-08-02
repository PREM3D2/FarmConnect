import React, { useState } from 'react';
import {
  View,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';

interface RouteType {
  key: string;
  title: string;
  params?: any;
}

interface Props {
  routes: RouteType[];
  scenes: { [key: string]: React.ComponentType<{ isFocused: boolean }> };
}

const CustomTabView: React.FC<Props> = ({ routes, scenes }) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const renderScene = ({ route }: { route: RouteType }) => {
    const SceneComponent = scenes[route.key];
    return <SceneComponent isFocused={routes[index].key === route.key} />;
  };

  return (
    <View style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{ backgroundColor: '#388e3c', height: 3 }}
            style={{
              backgroundColor: '#fff',
              elevation: 0,
              borderBottomWidth: 0,
              shadowOpacity: 0,
              shadowOffset: { height: 0, width: 0 },
              shadowRadius: 0,
            }}
            tabStyle={{ width: 'auto' }}
            activeColor="#388e3c"
            inactiveColor="#999"
          />
        )}
      />
    </View>
  );
};

export default CustomTabView;
