import React, { useState } from 'react';
import {
    View,
    useWindowDimensions,
    StyleSheet,
    Text,
} from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native-safe-area-context';

interface RouteType {
    key: string;
    title: string;
}

interface Props {
    routes: RouteType[];
    scenes: { [key: string]: React.ComponentType<any> };
}

const CustomTabView: React.FC<Props> = ({ routes, scenes }) => {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);

    const renderScene = SceneMap(scenes);

    return (
        // <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={{ flex: 1, }}>
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
                        //labelStyle={{ color: '#222', fontWeight: '600' }}
                        activeColor="'#388e3c'"
                        inactiveColor="#999"
                    />
                )}
            />
        </View>
        // </SafeAreaView>
    );
};

export default CustomTabView;
