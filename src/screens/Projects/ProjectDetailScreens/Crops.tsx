import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Crops = () => {
  return (
    <View style={styles.scene}>
      <Text>Crops Details</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

export default Crops;
